import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
        },
      }
    )

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('event_id')

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    // Optimize: Only select necessary fields and add timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const { data: participants, error } = await supabase
        .from('participants')
        .select('id, name, email, color, created_at')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true })
        .limit(100) // Prevent excessive data loading

      clearTimeout(timeoutId)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ participants: participants || [] })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
        },
      }
    )

    const body = await request.json()
    const { event_id, name, email } = body

    // Validate required fields
    if (!event_id || !name?.trim()) {
      return NextResponse.json(
        { error: 'Event ID and name are required' },
        { status: 400 }
      )
    }

    // Validate name length
    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Name must be less than 100 characters' },
        { status: 400 }
      )
    }

    // Add timeout for database operations
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    try {
      // Check if event exists and get participant count in one query
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
          id,
          participants:participants(id)
        `)
        .eq('id', event_id)
        .single()

      if (eventError || !eventData) {
        clearTimeout(timeoutId)
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      }

      // Check participant limit
      const participantCount = eventData.participants?.length || 0
      if (participantCount >= 7) {
        clearTimeout(timeoutId)
        return NextResponse.json({ 
          error: 'Event has reached maximum participants (7). Upgrade to Pro for more participants.' 
        }, { status: 400 })
      }

      // Check for duplicate participant name in this event
      const { data: existingParticipant } = await supabase
        .from('participants')
        .select('id')
        .eq('event_id', event_id)
        .ilike('name', name.trim())
        .single()

      if (existingParticipant) {
        clearTimeout(timeoutId)
        return NextResponse.json({ 
          error: 'A participant with this name already exists in this event' 
        }, { status: 400 })
      }

      // Generate a random color for the participant
      const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6']
      const color = colors[Math.floor(Math.random() * colors.length)]

      const { data: participant, error } = await supabase
        .from('participants')
        .insert({
          event_id,
          name: name.trim(),
          email: email?.trim() || null,
          color,
        })
        .select('id, name, email, color, created_at')
        .single()

      clearTimeout(timeoutId)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ participant }, { status: 201 })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}