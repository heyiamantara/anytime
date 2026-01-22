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
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Calculate start of current week (Monday)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Sunday = 0, so 6 days back to Monday
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - daysToMonday)
    startOfWeek.setHours(0, 0, 0, 0)

    // Count events created this week
    const { data: events, error } = await supabase
      .from('events')
      .select('id')
      .eq('created_by', user.id)
      .gte('created_at', startOfWeek.toISOString())

    if (error) {
      console.error('Error fetching weekly events:', error)
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    }

    return NextResponse.json({ 
      count: events?.length || 0,
      startOfWeek: startOfWeek.toISOString()
    })

  } catch (error) {
    console.error('Error in events-this-week API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}