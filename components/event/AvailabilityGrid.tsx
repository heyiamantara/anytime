'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Users, CheckCircle, AlertCircle } from 'lucide-react'

interface AvailabilityGridProps {
  event: any
  currentParticipant: any
  onAvailabilityUpdate: () => void
}

export default function AvailabilityGrid({ event, currentParticipant, onAvailabilityUpdate }: AvailabilityGridProps) {
  const [availability, setAvailability] = useState<any[]>([])
  const [userAvailability, setUserAvailability] = useState<{[key: string]: boolean}>({})
  const [loading, setLoading] = useState(false)
  const [hoveredSlot, setHoveredSlot] = useState<{date: string, time: string} | null>(null)

  useEffect(() => {
    fetchAvailability()
    // Load user's existing availability if they're a participant
    if (currentParticipant) {
      loadUserAvailability()
    }
  }, [event.id, currentParticipant])

  const loadUserAvailability = async () => {
    if (!currentParticipant) return
    
    try {
      const response = await fetch(`/api/availability?event_id=${event.id}`)
      const data = await response.json()
      
      if (response.ok) {
        const userAvail = {}
        data.availability
          .filter((a: any) => a.participant_id === currentParticipant.id)
          .forEach((a: any) => {
            const key = getSlotKey(a.date, a.time_block)
            userAvail[key] = a.available
          })
        setUserAvailability(userAvail)
      }
    } catch (error) {
      console.error('Failed to load user availability:', error)
    }
  }

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`/api/availability?event_id=${event.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setAvailability(data.availability)
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error)
    }
  }

  const generateDateRange = () => {
    const dates = []
    const start = new Date(event.start_date)
    const end = new Date(event.end_date)
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }
    
    return dates
  }

  const getSlotKey = (date: string, time: string) => `${date}-${time}`

  const getAvailabilityForSlot = (date: string, time: string) => {
    return availability.filter(a => 
      a.date === date && 
      a.time_block === time && 
      a.available
    )
  }

  const getSlotIntensity = (date: string, time: string) => {
    const available = getAvailabilityForSlot(date, time)
    const total = event.participants?.length || 1
    const percentage = available.length / total
    
    if (percentage >= 0.8) return 'bg-green-500 text-white'
    if (percentage >= 0.6) return 'bg-green-400 text-white'
    if (percentage >= 0.4) return 'bg-yellow-400 text-neutral-900'
    if (percentage >= 0.2) return 'bg-orange-400 text-white'
    if (available.length > 0) return 'bg-orange-300 text-neutral-900'
    return 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
  }

  const toggleAvailability = async (date: string, time: string) => {
    if (!currentParticipant || event.status === 'locked') return

    const slotKey = getSlotKey(date, time)
    const newValue = !userAvailability[slotKey]
    
    setUserAvailability(prev => ({
      ...prev,
      [slotKey]: newValue
    }))

    // Prepare availability data for all slots
    const availabilityData = []
    const dates = generateDateRange()
    
    for (const dateObj of dates) {
      const dateStr = dateObj.toISOString().split('T')[0]
      for (const timeBlock of event.time_blocks) {
        const key = getSlotKey(dateStr, timeBlock)
        const available = key === slotKey ? newValue : (userAvailability[key] || false)
        
        availabilityData.push({
          date: dateStr,
          time_block: timeBlock,
          available
        })
      }
    }

    try {
      setLoading(true)
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participant_id: currentParticipant.id,
          event_id: event.id,
          availability_data: availabilityData
        }),
      })

      if (response.ok) {
        onAvailabilityUpdate()
        fetchAvailability()
      }
    } catch (error) {
      console.error('Failed to update availability:', error)
      // Revert the change on error
      setUserAvailability(prev => ({
        ...prev,
        [slotKey]: !newValue
      }))
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const dates = generateDateRange()

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4 sm:gap-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Availability Grid
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">
            {currentParticipant 
              ? 'Click on time slots to mark your availability' 
              : 'Join the event to mark your availability'
            }
          </p>
        </div>
        
        {event.status === 'locked' && (
          <div className="flex items-center space-x-2 text-orange-600">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">Event Locked</span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="min-w-[500px] sm:min-w-[600px]">
          {/* Header Row */}
          <div className="grid gap-1 sm:gap-2 mb-3 sm:mb-4" style={{ gridTemplateColumns: `80px sm:120px repeat(${dates.length}, 1fr)` }}>
            <div></div> {/* Empty corner */}
            {dates.map((date, index) => {
              const formatted = formatDate(date)
              return (
                <div key={index} className="text-center p-3">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {formatted.day}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {formatted.date}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Time Rows */}
          <div className="space-y-2">
            {event.time_blocks?.map((time: string, timeIndex: number) => (
              <div 
                key={timeIndex} 
                className="grid gap-2 items-center"
                style={{ gridTemplateColumns: `120px repeat(${dates.length}, 1fr)` }}
              >
                {/* Time Label */}
                <div className="text-right pr-4">
                  <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {formatTime(time)}
                  </div>
                </div>

                {/* Availability Slots */}
                {dates.map((date, dateIndex) => {
                  const dateStr = date.toISOString().split('T')[0]
                  const slotKey = getSlotKey(dateStr, time)
                  const availableUsers = getAvailabilityForSlot(dateStr, time)
                  const isUserAvailable = userAvailability[slotKey]
                  const isHovered = hoveredSlot?.date === dateStr && hoveredSlot?.time === time
                  const canInteract = currentParticipant && event.status === 'open'

                  return (
                    <motion.div
                      key={dateIndex}
                      whileHover={canInteract ? { scale: 1.05 } : {}}
                      whileTap={canInteract ? { scale: 0.95 } : {}}
                      onMouseEnter={() => setHoveredSlot({ date: dateStr, time })}
                      onMouseLeave={() => setHoveredSlot(null)}
                      onClick={() => toggleAvailability(dateStr, time)}
                      className={`
                        h-12 rounded-lg transition-all duration-200 flex items-center justify-center relative
                        ${canInteract ? 'cursor-pointer' : 'cursor-default'}
                        ${getSlotIntensity(dateStr, time)}
                        ${isUserAvailable ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900' : ''}
                        ${isHovered ? 'shadow-lg' : ''}
                        ${loading ? 'opacity-50' : ''}
                      `}
                    >
                      {/* Availability Count */}
                      <span className="text-sm font-medium">
                        {availableUsers.length > 0 ? `${availableUsers.length}/${event.participants?.length || 0}` : ''}
                      </span>

                      {/* User's availability indicator */}
                      {isUserAvailable && (
                        <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-primary-600 bg-white dark:bg-neutral-900 rounded-full" />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Legend:
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">High availability</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">Medium availability</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-neutral-300 dark:bg-neutral-700 rounded"></div>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">Low availability</span>
            </div>
          </div>

          {/* Hover Info */}
          {hoveredSlot && (
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {formatTime(hoveredSlot.time)} on {new Date(hoveredSlot.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
              {(() => {
                const available = getAvailabilityForSlot(hoveredSlot.date, hoveredSlot.time)
                return available.length > 0 ? ` • ${available.length} available` : ' • No responses'
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}