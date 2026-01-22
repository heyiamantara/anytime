'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface UsageLimits {
  eventsThisWeek: number
  maxEvents: number
  maxParticipants: number
  canCreateEvent: boolean
  canAddParticipant: (currentCount: number) => boolean
}

export function useUsageLimits(): UsageLimits {
  const { user } = useAuth()
  const [eventsThisWeek, setEventsThisWeek] = useState(0)
  
  // Free tier limits
  const MAX_EVENTS_PER_WEEK = 10
  const MAX_PARTICIPANTS_PER_EVENT = 7

  useEffect(() => {
    if (user) {
      fetchWeeklyEventCount()
    }
  }, [user])

  const fetchWeeklyEventCount = async () => {
    try {
      const response = await fetch('/api/usage/events-this-week')
      const data = await response.json()
      
      if (response.ok) {
        setEventsThisWeek(data.count)
      }
    } catch (error) {
      console.error('Failed to fetch weekly event count:', error)
    }
  }

  const canCreateEvent = eventsThisWeek < MAX_EVENTS_PER_WEEK
  
  const canAddParticipant = (currentCount: number) => {
    return currentCount < MAX_PARTICIPANTS_PER_EVENT
  }

  return {
    eventsThisWeek,
    maxEvents: MAX_EVENTS_PER_WEEK,
    maxParticipants: MAX_PARTICIPANTS_PER_EVENT,
    canCreateEvent,
    canAddParticipant
  }
}