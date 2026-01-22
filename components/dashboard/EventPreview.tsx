'use client'

import { motion } from 'framer-motion'
import { Users, Calendar, Clock, Star } from 'lucide-react'
import { useState, useEffect } from 'react'

interface EventPreviewProps {
  event: {
    id: string
    name: string
    description?: string
    start_date: string
    end_date: string
    status: 'open' | 'locked'
    participants?: any[]
    availability?: any[]
    time_blocks?: string[]
    created_at: string
  }
}

export default function EventPreview({ event }: EventPreviewProps) {
  const [availabilityData, setAvailabilityData] = useState<any>({})
  const [bestMatches, setBestMatches] = useState<any[]>([])

  useEffect(() => {
    if (event?.availability && event?.participants && event?.time_blocks) {
      processAvailabilityData()
    }
  }, [event])

  const processAvailabilityData = () => {
    const data: any = {}
    const totalParticipants = event.participants?.length || 0
    
    // Generate date range
    const startDate = new Date(event.start_date)
    const endDate = new Date(event.end_date)
    const dates = []
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }

    // Initialize data structure
    dates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0]
      data[dateStr] = {}
      
      event.time_blocks?.forEach(timeBlock => {
        data[dateStr][timeBlock] = {
          count: 0,
          participants: []
        }
      })
    })

    // Process availability data
    event.availability?.forEach(avail => {
      if (avail.available && data[avail.date] && data[avail.date][avail.time_block]) {
        data[avail.date][avail.time_block].count++
        
        // Find participant name
        const participant = event.participants?.find(p => p.id === avail.participant_id)
        if (participant) {
          data[avail.date][avail.time_block].participants.push(participant)
        }
      }
    })

    // Find best matches (top 3)
    const matches: any[] = []
    Object.keys(data).forEach(date => {
      Object.keys(data[date]).forEach(timeBlock => {
        const slot = data[date][timeBlock]
        if (slot.count > 0) {
          matches.push({
            date,
            timeBlock,
            count: slot.count,
            participants: slot.participants,
            percentage: totalParticipants > 0 ? (slot.count / totalParticipants) * 100 : 0
          })
        }
      })
    })

    const sortedMatches = matches.sort((a, b) => b.count - a.count).slice(0, 3)
    
    setAvailabilityData(data)
    setBestMatches(sortedMatches)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getIntensityColor = (count: number, maxCount: number) => {
    if (count === 0) return 'bg-neutral-800 text-neutral-500'
    
    const intensity = count / maxCount
    if (intensity >= 0.8) return 'bg-primary-600 text-white'
    if (intensity >= 0.6) return 'bg-primary-500 text-white'
    if (intensity >= 0.4) return 'bg-primary-400 text-white'
    if (intensity >= 0.2) return 'bg-primary-300 text-primary-900'
    return 'bg-primary-200 text-primary-800'
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    return `${start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })} - ${end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })}`
  }

  // Generate dates for grid
  const dates = []
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d))
  }

  const maxCount = Math.max(
    ...Object.values(availabilityData).flatMap((dateData: any) =>
      Object.values(dateData).map((slot: any) => slot.count)
    ),
    1
  )

  const totalParticipants = event.participants?.length || 0

  return (
    <div className="h-full overflow-y-auto">
      {/* Event Header */}
      <div className="p-6 border-b border-neutral-800">
        <h2 className="text-xl font-bold text-neutral-100 mb-2">
          {event.name}
        </h2>
        {event.description && (
          <p className="text-neutral-400 mb-4">
            {event.description}
          </p>
        )}
        
        <div className="flex items-center space-x-6 text-sm text-neutral-400">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDateRange(event.start_date, event.end_date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>{totalParticipants} participants</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{event.time_blocks?.length || 0} time slots</span>
          </div>
        </div>
      </div>

      {/* Availability Grid */}
      {event.time_blocks && event.time_blocks.length > 0 && (
        <div className="p-6 border-b border-neutral-800">
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">
            Availability Grid
          </h3>
          
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header Row */}
              <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: `100px repeat(${dates.length}, 1fr)` }}>
                <div></div>
                {dates.map((date, index) => {
                  const formatted = formatDate(date.toISOString().split('T')[0])
                  return (
                    <div key={index} className="text-center">
                      <div className="text-xs text-neutral-400">
                        {formatted.day}
                      </div>
                      <div className="text-sm font-medium text-neutral-300">
                        {formatted.date}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Time Rows */}
              {event.time_blocks.map((timeBlock, timeIndex) => (
                <div key={timeIndex} className="grid gap-2 mb-2" style={{ gridTemplateColumns: `100px repeat(${dates.length}, 1fr)` }}>
                  {/* Time Label */}
                  <div className="flex items-center justify-end pr-3">
                    <span className="text-xs text-neutral-400">
                      {formatTime(timeBlock)}
                    </span>
                  </div>

                  {/* Availability Cells */}
                  {dates.map((date, dateIndex) => {
                    const dateStr = date.toISOString().split('T')[0]
                    const slot = availabilityData[dateStr]?.[timeBlock] || { count: 0, participants: [] }
                    const isHighlight = bestMatches.some(match => 
                      match.date === dateStr && match.timeBlock === timeBlock
                    )

                    return (
                      <div
                        key={dateIndex}
                        className={`
                          relative h-8 rounded flex items-center justify-center text-xs font-medium
                          transition-all duration-200 cursor-pointer hover:scale-105
                          ${getIntensityColor(slot.count, maxCount)}
                          ${isHighlight ? 'ring-1 ring-yellow-400' : ''}
                        `}
                        title={`${slot.count}/${totalParticipants} available${slot.participants.length > 0 ? '\n' + slot.participants.map((p: any) => p.name).join(', ') : ''}`}
                      >
                        {slot.count > 0 && (
                          <>
                            <span>{slot.count}/{totalParticipants}</span>
                            {isHighlight && (
                              <Star className="w-2 h-2 absolute -top-0.5 -right-0.5 text-yellow-400 fill-current" />
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Best Matches */}
      {bestMatches.length > 0 && (
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-4 h-4 text-yellow-500" />
            <h3 className="text-lg font-semibold text-neutral-100">
              Best Matches
            </h3>
          </div>
          
          <div className="space-y-3">
            {bestMatches.map((match, index) => {
              const formatted = formatDate(match.date)
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg border border-yellow-800/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-neutral-200">
                      {formatted.day}, {formatted.date} at {formatTime(match.timeBlock)}
                    </div>
                    <div className="text-sm font-bold text-yellow-400">
                      {match.count}/{totalParticipants} ({Math.round(match.percentage)}%)
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400">
                    {match.participants.map((p: any) => p.name).join(', ')}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}