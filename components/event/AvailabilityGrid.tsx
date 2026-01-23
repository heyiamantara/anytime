'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

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
  const timeSlots = event.time_blocks || []
  
  // Calculate dynamic sizing based on content
  const getGridDimensions = () => {
    const timeSlotCount = timeSlots.length
    
    // Base minimum height per slot
    const minSlotHeight = 56 // 14 * 4 (h-14 equivalent)
    const maxSlotHeight = 120 // Increased maximum height for better fill
    
    // Calculate available height (viewport minus headers, padding, etc.)
    const availableHeight = Math.max(500, window.innerHeight * 0.7)
    const headerHeight = 100 // Approximate header space
    const legendHeight = 140 // Approximate legend space
    const gridHeight = availableHeight - headerHeight - legendHeight
    
    // Calculate optimal slot height
    let slotHeight = Math.max(minSlotHeight, gridHeight / timeSlotCount)
    slotHeight = Math.min(slotHeight, maxSlotHeight)
    
    // Use flex layout for fewer slots to fill space better
    const useFlex = timeSlotCount <= 8
    
    return {
      slotHeight,
      useFlex,
      gridHeight: useFlex ? Math.max(gridHeight, 400) : 'auto'
    }
  }

  const [gridDimensions, setGridDimensions] = useState({ slotHeight: 56, useFlex: false, gridHeight: 'auto' })

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        setGridDimensions(getGridDimensions())
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [timeSlots.length])

  const { slotHeight, useFlex, gridHeight } = gridDimensions

  return (
    <>
      {/* Responsive Grid Container */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Refined Header Row */}
          <div className="flex mb-8">
            <div className="w-32 flex-shrink-0"></div>
            {dates.map((date, index) => {
              const formatted = formatDate(date)
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 min-w-[6rem] text-center px-3"
                >
                  <div className="text-sm font-extralight text-neutral-900 dark:text-white mb-2 tracking-widest luxury-caption">
                    {formatted.day}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400/70 font-extralight tracking-widest luxury-caption">
                    {formatted.date}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Adaptive Time Slots Grid */}
          <div 
            className={`${useFlex ? 'flex flex-col gap-4' : 'space-y-4'}`}
            style={useFlex ? { height: gridHeight, minHeight: '400px' } : {}}
          >
            {timeSlots.map((time: string, timeIndex: number) => (
              <motion.div 
                key={timeIndex} 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + timeIndex * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-center ${useFlex ? 'flex-1 min-h-[4rem]' : ''}`}
                style={!useFlex ? { minHeight: slotHeight } : {}}
              >
                {/* Refined Time Label */}
                <div className="w-32 flex-shrink-0 text-right pr-8 flex items-center justify-end">
                  <div className="text-sm font-extralight text-neutral-700 dark:text-neutral-300/90 tracking-widest luxury-caption">
                    {formatTime(time)}
                  </div>
                </div>

                {/* Responsive Availability Slots */}
                {dates.map((date, dateIndex) => {
                  const dateStr = date.toISOString().split('T')[0]
                  const slotKey = getSlotKey(dateStr, time)
                  const availableUsers = getAvailabilityForSlot(dateStr, time)
                  const isUserAvailable = userAvailability[slotKey]
                  const isHovered = hoveredSlot?.date === dateStr && hoveredSlot?.time === time
                  const canInteract = currentParticipant && event.status === 'open'

                  return (
                    <div key={dateIndex} className="flex-1 min-w-[6rem] px-3 flex items-center">
                      <motion.div
                        whileHover={canInteract ? { scale: 1.05, y: -2 } : {}}
                        whileTap={canInteract ? { scale: 0.95 } : {}}
                        onMouseEnter={() => setHoveredSlot({ date: dateStr, time })}
                        onMouseLeave={() => setHoveredSlot(null)}
                        onClick={() => toggleAvailability(dateStr, time)}
                        className={`
                          w-full rounded-3xl transition-all duration-700 flex items-center justify-center relative overflow-hidden backdrop-blur-sm
                          ${useFlex ? 'flex-1 min-h-[3.5rem]' : 'h-12'}
                          ${canInteract ? 'cursor-pointer' : 'cursor-default'}
                          ${availableUsers.length === 0 
                            ? 'bg-neutral-200/50 dark:bg-neutral-800/20 border border-neutral-300/30 dark:border-neutral-700/20 hover:bg-neutral-300/60 dark:hover:bg-neutral-700/30 hover:border-neutral-400/40 dark:hover:border-neutral-600/30' 
                            : availableUsers.length === 1
                              ? 'bg-gradient-to-br from-violet-500/15 to-indigo-500/15 border border-violet-500/25 shadow-lg shadow-violet-500/10'
                              : availableUsers.length === 2
                                ? 'bg-gradient-to-br from-violet-500/25 to-indigo-500/25 border border-violet-400/35 shadow-lg shadow-violet-500/15'
                                : 'bg-gradient-to-br from-violet-500/35 to-indigo-500/35 border border-violet-400/45 shadow-xl shadow-violet-500/20'
                          }
                          ${isUserAvailable ? 'ring-2 ring-violet-400/50 shadow-xl shadow-violet-500/25' : ''}
                          ${isHovered ? 'shadow-2xl shadow-violet-500/30 border-violet-400/60' : ''}
                          ${loading ? 'opacity-40' : ''}
                        `}
                        style={useFlex ? {} : { height: Math.max(48, slotHeight * 0.8) }}
                      >
                        {/* Atmospheric Background Glow */}
                        {availableUsers.length > 0 && (
                          <div className="absolute inset-0 bg-gradient-to-br from-violet-400/8 to-indigo-400/8 rounded-3xl"></div>
                        )}

                        {/* Availability Count */}
                        {availableUsers.length > 0 && (
                          <span className="relative text-sm font-extralight text-violet-600 dark:text-violet-200/90 tracking-widest">
                            {availableUsers.length}
                          </span>
                        )}

                        {/* User's Selection Indicator */}
                        {isUserAvailable && (
                          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-br from-violet-400 to-indigo-400 rounded-full shadow-xl shadow-violet-500/50"></div>
                        )}

                        {/* Hover Atmosphere Effect */}
                        {isHovered && canInteract && (
                          <div className="absolute inset-0 bg-gradient-to-br from-violet-400/15 to-indigo-400/15 rounded-3xl"></div>
                        )}
                      </motion.div>
                    </div>
                  )
                })}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Refined Scroll Hint */}
      {dates.length > 4 && (
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500 dark:text-neutral-500/70 font-extralight tracking-widest luxury-caption">
            Scroll horizontally to explore all dates
          </p>
        </div>
      )}

      {/* Atmospheric Legend */}
      <div className="mt-12 pt-8 border-t border-neutral-200/50 dark:border-white/8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div className="flex items-center space-x-10">
            <div className="text-sm font-extralight text-neutral-600 dark:text-neutral-400/80 tracking-widest luxury-caption">
              Availability:
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-neutral-200/50 dark:bg-neutral-800/20 border border-neutral-300/30 dark:border-neutral-700/20 rounded-2xl"></div>
                <span className="text-xs text-neutral-500 dark:text-neutral-500/80 font-extralight tracking-widest luxury-caption">None</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gradient-to-br from-violet-500/15 to-indigo-500/15 border border-violet-500/25 rounded-2xl"></div>
                <span className="text-xs text-neutral-500 dark:text-neutral-500/80 font-extralight tracking-widest luxury-caption">Low</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gradient-to-br from-violet-500/25 to-indigo-500/25 border border-violet-400/35 rounded-2xl"></div>
                <span className="text-xs text-neutral-500 dark:text-neutral-500/80 font-extralight tracking-widest luxury-caption">Medium</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gradient-to-br from-violet-500/35 to-indigo-500/35 border border-violet-400/45 rounded-2xl"></div>
                <span className="text-xs text-neutral-500 dark:text-neutral-500/80 font-extralight tracking-widest luxury-caption">High</span>
              </div>
            </div>
          </div>

          {/* Atmospheric Hover Info */}
          {hoveredSlot && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-right"
            >
              <div className="text-xs text-neutral-500 dark:text-neutral-400/80 font-extralight tracking-widest luxury-caption">
                {formatTime(hoveredSlot.time)} • {new Date(hoveredSlot.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              {(() => {
                const available = getAvailabilityForSlot(hoveredSlot.date, hoveredSlot.time)
                return (
                  <div className="text-xs text-violet-600 dark:text-violet-300/90 font-light tracking-widest mt-2 luxury-caption">
                    {available.length > 0 ? `${available.length} available` : 'No responses yet'}
                  </div>
                )
              })()}
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}