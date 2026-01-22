import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Event {
  id: string
  name: string
  description?: string
  start_date: string
  end_date: string
  time_blocks: string[]
  status: 'open' | 'locked'
  locked_time?: string
  locked_by?: string
  locked_at?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Participant {
  id: string
  event_id: string
  name: string
  email?: string
  color: string
  created_at: string
}

export interface Availability {
  id: string
  participant_id: string
  event_id: string
  date: string
  time_block: string
  available: boolean
  created_at: string
  updated_at: string
}

// Helper types for API responses
export interface AvailabilitySummary {
  date: string
  time_block: string
  available_count: number
  participant_names: string[]
}

export interface OptimalTime {
  date: string
  time_block: string
  available_count: number
  total_participants: number
  percentage: number
}