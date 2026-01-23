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

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Optimize: Only fetch necessary fields and use more efficient query
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        id,
        name,
        description,
        start_date,
        end_date,
        time_blocks,
        is_24_7,
        status,
        created_at,
        participants:participants(id, name, color),
        availability:availability(id, available)
      `)
      .eq('created_by', session.user.id)
      .order('created_at', { ascending: false })
      .limit(50) // Limit to prevent excessive data loading

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ events: events || [] })
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

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, start_date, end_date, time_blocks, is_24_7 } = body

    // Validate required fields
    if (!name || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate time blocks (unless 24/7 is enabled)
    if (!is_24_7 && (!time_blocks || time_blocks.length === 0)) {
      return NextResponse.json(
        { error: 'Please select at least one time slot or enable 24/7 availability' },
        { status: 400 }
      )
    }

    // Validate date range
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)
    if (startDate > endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Optimize: Use a single database transaction for better performance
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        start_date,
        end_date,
        time_blocks: Array.isArray(time_blocks) ? time_blocks : [],
        is_24_7: Boolean(is_24_7),
        created_by: session.user.id,
        status: 'open'
      })
      .select('id, name, description, start_date, end_date, time_blocks, is_24_7, status, created_at')
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}