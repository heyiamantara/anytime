'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, Clock, Star, X } from 'lucide-react'

interface ExpandedEventViewProps {
  event: {
    id: string
    name: string
    start_date: string
    end_date: string
    time_blocks: string[]
    participants?: any[]
    availability?: any[]
  }
  onClose: () => void
}

export default function ExpandedEventView({ event, onClose }: ExpandedEventViewProps) {
  const [availabilityData, setAvailabilityData] = useState<any>({})
  const [bestMatches, setBestMatches] = useState<any[]>([])

  useEffect(() => {
    if (event.availability && event.participants) {
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
      
      event.time_blocks.forEach(timeBlock => {
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

    // Find best matches (highest availability counts)
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

    // Sort by count (descending) and take top matches
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
    if (count === 0) return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
    
    const intensity = count / maxCount
    if (intensity >= 0.8) return 'bg-primary-600 text-white'
    if (intensity >= 0.6) return 'bg-primary-500 text-white'
    if (intensity >= 0.4) return 'bg-primary-400 text-white'
    if (intensity >= 0.2) return 'bg-primary-300 text-primary-900'
    return 'bg-primary-200 text-primary-800'
  }

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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-6 h-full overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {event.name}
          </h2>
          <div className="flex items-center space-x-6 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{totalParticipants} participants</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{dates.length} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Interactive Preview
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Hover over cells to explore availability details
        </p>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header Row */}
            <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: `120px repeat(${dates.length}, 1fr)` }}>
              <div></div> {/* Empty cell for time labels */}
              {dates.map((date, index) => {
                const formatted = formatDate(date.toISOString().split('T')[0])
                return (
                  <div key={index} className="text-center">
                    <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      {formatted.day}
                    </div>
                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {formatted.date}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Time Rows */}
            {event.time_blocks.map((timeBlock, timeIndex) => (
              <div key={timeIndex} className="grid gap-2 mb-2" style={{ gridTemplateColumns: `120px repeat(${dates.length}, 1fr)` }}>
                {/* Time Label */}
                <div className="flex items-center justify-end pr-4">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
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
                        relative h-12 rounded-lg flex items-center justify-center text-sm font-medium
                        transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-md
                        ${getIntensityColor(slot.count, maxCount)}
                        ${isHighlight ? 'ring-2 ring-yellow-400' : ''}
                      `}
                      title={`${slot.count}/${totalParticipants} available${slot.participants.length > 0 ? '\n' + slot.participants.map((p: any) => p.name).join(', ') : ''}`}
                    >
                      {slot.count > 0 && (
                        <>
                          <span>{slot.count}/{totalParticipants}</span>
                          {isHighlight && (
                            <Star className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400 fill-current" />
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

      {/* Best Matches Section */}
      {bestMatches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Best Matches
            </h3>
          </div>
          
          <div className="space-y-3">
            {bestMatches.map((match, index) => {
              const formatted = formatDate(match.date)
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {formatted.day}, {formatted.date} at {formatTime(match.timeBlock)}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {match.participants.map((p: any) => p.name).join(', ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                        {match.count}/{totalParticipants}
                      </div>
                      <div className="text-sm text-yellow-600 dark:text-yellow-400">
                        {Math.round(match.percentage)}% available
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Participants List */}
      {event.participants && event.participants.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Participants
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {event.participants.map((participant: any, index: number) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: participant.color || '#8b5cf6' }}
                >
                  {participant.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {participant.name || 'Unknown'}
                  </p>
                  {participant.email && (
                    <p className="text-xs text-neutral-500">
                      {participant.email}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}