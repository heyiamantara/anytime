import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

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
    const { participant_id, event_id, availability_data, date, time_block, available } = body

    // Validate required fields
    if (!participant_id || !event_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Handle single slot update (faster)
    if (date && time_block !== undefined && available !== undefined) {
      // Check if record exists
      const { data: existing } = await supabase
        .from('availability')
        .select('id')
        .eq('participant_id', participant_id)
        .eq('event_id', event_id)
        .eq('date', date)
        .eq('time_block', time_block)
        .single()

      if (existing) {
        // Update existing record
        const { data: availability, error } = await supabase
          .from('availability')
          .update({ available })
          .eq('id', existing.id)
          .select()

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ availability }, { status: 200 })
      } else {
        // Insert new record
        const { data: availability, error } = await supabase
          .from('availability')
          .insert({
            participant_id,
            event_id,
            date,
            time_block,
            available,
          })
          .select()

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ availability }, { status: 201 })
      }
    }

    // Handle full availability array (legacy support)
    if (!availability_data) {
      return NextResponse.json(
        { error: 'Missing availability data' },
        { status: 400 }
      )
    }

    // Delete existing availability for this participant
    await supabase
      .from('availability')
      .delete()
      .eq('participant_id', participant_id)
      .eq('event_id', event_id)

    // Insert new availability data
    const availabilityRecords = availability_data.map((item: any) => ({
      participant_id,
      event_id,
      date: item.date,
      time_block: item.time_block,
      available: item.available,
    }))

    const { data: availability, error } = await supabase
      .from('availability')
      .insert(availabilityRecords)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ availability }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    const event_id = searchParams.get('event_id')

    if (!event_id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const { data: availability, error } = await supabase
      .from('availability')
      .select(`
        *,
        participants(name, color)
      `)
      .eq('event_id', event_id)
      .order('date')
      .order('time_block')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ availability })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}