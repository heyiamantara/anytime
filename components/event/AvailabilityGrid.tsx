'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

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
  const gridRef = useRef<HTMLDivElement>(null)

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
    
    // Immediate visual feedback - update state first
    setUserAvailability(prev => ({
      ...prev,
      [slotKey]: newValue
    }))

    // Debounced API call to avoid too many requests
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participant_id: currentParticipant.id,
          event_id: event.id,
          date: date,
          time_block: time,
          available: newValue
        }),
      })

      if (response.ok) {
        onAvailabilityUpdate()
        // Only refresh if needed
        setTimeout(() => fetchAvailability(), 500)
      } else {
        // Revert on error
        setUserAvailability(prev => ({
          ...prev,
          [slotKey]: !newValue
        }))
      }
    } catch (error) {
      console.error('Failed to update availability:', error)
      // Revert the change on error
      setUserAvailability(prev => ({
        ...prev,
        [slotKey]: !newValue
      }))
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
  
  // Responsive cell dimensions
  const CELL_WIDTH_MOBILE = 60 // Smaller for mobile
  const CELL_HEIGHT_MOBILE = 56 // Smaller for mobile
  const CELL_WIDTH_DESKTOP = 88 // Original desktop size
  const CELL_HEIGHT_DESKTOP = 72 // Original desktop size
  const TIME_LABEL_WIDTH_MOBILE = 80 // Smaller for mobile
  const TIME_LABEL_WIDTH_DESKTOP = 140 // Original desktop size

  return (
    <div className="w-full">
      {/* Availability Canvas - Enhanced Mobile Responsive Container */}
      <div className="relative w-full border border-neutral-300/60 dark:border-neutral-700/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-gradient-to-br from-white/80 via-neutral-50/40 to-white/60 dark:from-neutral-900/10 dark:via-transparent dark:to-neutral-900/5 shadow-lg shadow-neutral-200/30 dark:shadow-none">
        {/* Floating Date Headers - Mobile Responsive */}
        <div className="relative z-20 mb-6 sm:mb-8">
          <div className="flex">
            {/* Time Label Spacer - Responsive */}
            <div className="flex-shrink-0 w-20 sm:w-[140px]" />
            
            {/* Adaptive Date Headers Container */}
            <div className="flex-1 overflow-x-auto scrollbar-none">
              <div className="flex gap-2 sm:gap-4" style={{ minWidth: '100%' }}>
                {dates.map((date, index) => {
                  const formatted = formatDate(date)
                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="text-center py-3 sm:py-6 flex-1 min-w-[60px] sm:min-w-[88px]"
                    >
                      <div className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-white mb-2 sm:mb-3 tracking-wider luxury-caption">
                        {formatted.day}
                      </div>
                      <div className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400/70 font-medium tracking-widest luxury-caption">
                        {formatted.date}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Availability Canvas Body - Mobile Responsive */}
        <div className="relative">
          {/* Vertical Scroll Container */}
          <div className="max-h-[50vh] sm:max-h-[65vh] overflow-y-auto scrollbar-none">
            <div className="space-y-3 sm:space-y-6">
              {timeSlots.map((time: string, timeIndex: number) => (
                <motion.div 
                  key={timeIndex} 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + timeIndex * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center"
                >
                  {/* Floating Time Label - Responsive */}
                  <div className="flex-shrink-0 flex items-center justify-end pr-3 sm:pr-8 w-20 sm:w-[140px] h-14 sm:h-[72px]">
                    <div className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-300/90 tracking-wider luxury-caption">
                      {formatTime(time)}
                    </div>
                  </div>

                  {/* Adaptive Availability Tiles Container */}
                  <div className="flex-1 overflow-x-auto scrollbar-none">
                    <div className="flex gap-2 sm:gap-4" style={{ minWidth: '100%' }}>
                      {dates.map((date, dateIndex) => {
                        const dateStr = date.toISOString().split('T')[0]
                        const slotKey = getSlotKey(dateStr, time)
                        const availableUsers = getAvailabilityForSlot(dateStr, time)
                        const isUserAvailable = userAvailability[slotKey]
                        const isHovered = hoveredSlot?.date === dateStr && hoveredSlot?.time === time
                        const canInteract = currentParticipant && event.status === 'open'

                        return (
                          <div 
                            key={dateIndex} 
                            className="flex items-center justify-center flex-1 min-w-[60px] sm:min-w-[88px] h-14 sm:h-[72px]"
                          >
                            <motion.div
                              whileHover={canInteract ? { scale: 1.05, y: -2 } : {}}
                              whileTap={canInteract ? { scale: 0.95 } : {}}
                              onMouseEnter={() => setHoveredSlot({ date: dateStr, time })}
                              onMouseLeave={() => setHoveredSlot(null)}
                              onClick={() => toggleAvailability(dateStr, time)}
                              className={`
                                w-full h-full rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center relative overflow-hidden touch-target
                                ${canInteract ? 'cursor-pointer' : 'cursor-default'}
                                ${isUserAvailable 
                                  ? 'bg-gradient-to-br from-emerald-500/40 via-emerald-400/35 to-teal-500/40 dark:from-emerald-500/25 dark:via-emerald-400/20 dark:to-teal-500/25 border-2 border-emerald-500/70 dark:border-emerald-400/50 shadow-xl shadow-emerald-500/35'
                                  : availableUsers.length === 0 
                                    ? 'bg-neutral-200/50 dark:bg-neutral-800/20 border border-neutral-300/50 dark:border-neutral-700/30 hover:bg-neutral-300/60 dark:hover:bg-neutral-700/30 hover:border-neutral-400/60 dark:hover:border-neutral-600/40' 
                                    : availableUsers.length === 1
                                      ? 'bg-gradient-to-br from-blue-500/35 via-blue-400/30 to-cyan-500/35 dark:from-blue-500/20 dark:via-blue-400/15 dark:to-cyan-500/20 border border-blue-500/50 dark:border-blue-400/30 shadow-lg shadow-blue-500/25'
                                      : availableUsers.length === 2
                                        ? 'bg-gradient-to-br from-violet-500/40 via-violet-400/35 to-indigo-500/40 dark:from-violet-500/25 dark:via-violet-400/20 dark:to-indigo-500/25 border border-violet-500/60 dark:border-violet-400/40 shadow-lg shadow-violet-500/30'
                                        : 'bg-gradient-to-br from-orange-500/40 via-yellow-400/35 to-amber-500/40 dark:from-orange-500/25 dark:via-yellow-400/20 dark:to-amber-500/25 border border-orange-500/60 dark:border-orange-400/40 shadow-xl shadow-orange-500/30'
                                }
                                ${isHovered ? 'shadow-2xl transform scale-105' : ''}
                              `}
                            >
                              {/* Soft Atmospheric Glow */}
                              {(availableUsers.length > 0 || isUserAvailable) && (
                                <div className={`
                                  absolute inset-0 rounded-xl sm:rounded-2xl
                                  ${isUserAvailable 
                                    ? 'bg-gradient-to-br from-emerald-400/10 via-transparent to-teal-400/10 dark:from-emerald-400/8 dark:to-teal-400/8'
                                    : availableUsers.length === 1
                                      ? 'bg-gradient-to-br from-blue-400/8 via-transparent to-cyan-400/8 dark:from-blue-400/6 dark:to-cyan-400/6'
                                      : availableUsers.length === 2
                                        ? 'bg-gradient-to-br from-violet-400/8 via-transparent to-indigo-400/8 dark:from-violet-400/6 dark:to-indigo-400/6'
                                        : 'bg-gradient-to-br from-orange-400/8 via-transparent to-amber-400/8 dark:from-orange-400/6 dark:to-amber-400/6'
                                  }
                                `}></div>
                              )}

                              {/* Availability Count or User Selection */}
                              {isUserAvailable ? (
                                <div className="relative flex items-center justify-center">
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                </div>
                              ) : availableUsers.length > 0 ? (
                                <span className={`
                                  relative text-sm sm:text-lg font-medium tracking-wide
                                  ${availableUsers.length === 1 
                                    ? 'text-blue-700 dark:text-blue-300/90'
                                    : availableUsers.length === 2
                                      ? 'text-violet-700 dark:text-violet-300/90'
                                      : 'text-orange-700 dark:text-orange-300/90'
                                  }
                                `}>
                                  {availableUsers.length}
                                </span>
                              ) : null}

                              {/* Hover Atmosphere */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/10 dark:from-white/10 dark:to-white/5 rounded-xl sm:rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            </motion.div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Legend - Mobile Responsive */}
      <div className="mt-8 sm:mt-16 pt-6 sm:pt-8">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
              <div className="text-sm font-medium text-neutral-700 dark:text-neutral-400/80 tracking-wider luxury-caption">
                Availability
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-10">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-neutral-200/50 dark:bg-neutral-800/20 border border-neutral-300/50 dark:border-neutral-700/30 rounded-lg sm:rounded-xl"></div>
                  <span className="text-xs sm:text-xs text-neutral-600 dark:text-neutral-500/80 font-medium tracking-wider luxury-caption">None</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500/35 to-cyan-500/35 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-500/50 dark:border-blue-400/30 rounded-lg sm:rounded-xl"></div>
                  <span className="text-xs sm:text-xs text-neutral-600 dark:text-neutral-500/80 font-medium tracking-wider luxury-caption">Low (1)</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-violet-500/40 to-indigo-500/40 dark:from-violet-500/25 dark:to-indigo-500/25 border border-violet-500/60 dark:border-violet-400/40 rounded-lg sm:rounded-xl"></div>
                  <span className="text-xs sm:text-xs text-neutral-600 dark:text-neutral-500/80 font-medium tracking-wider luxury-caption">Medium (2)</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-orange-500/40 to-amber-500/40 dark:from-orange-500/25 dark:to-amber-500/25 border border-orange-500/60 dark:border-orange-400/40 rounded-lg sm:rounded-xl"></div>
                  <span className="text-xs sm:text-xs text-neutral-600 dark:text-neutral-500/80 font-medium tracking-wider luxury-caption">High (3+)</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-emerald-500/40 to-teal-500/40 dark:from-emerald-500/25 dark:to-teal-500/25 border-2 border-emerald-500/70 dark:border-emerald-400/50 rounded-lg sm:rounded-xl shadow-lg shadow-emerald-500/30"></div>
                  <span className="text-xs sm:text-xs text-neutral-600 dark:text-neutral-500/80 font-medium tracking-wider luxury-caption">Your selection</span>
                </div>
              </div>
            </div>

            {/* Floating Hover Context */}
            {hoveredSlot && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center sm:text-right"
              >
                <div className="text-xs text-neutral-500 dark:text-neutral-400/80 font-extralight tracking-wider luxury-caption">
                  {formatTime(hoveredSlot.time)} • {new Date(hoveredSlot.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                {(() => {
                  const available = getAvailabilityForSlot(hoveredSlot.date, hoveredSlot.time)
                  return (
                    <div className="text-xs text-violet-600 dark:text-violet-300/90 font-light tracking-wider mt-2 luxury-caption">
                      {available.length > 0 ? `${available.length} available` : 'No responses yet'}
                    </div>
                  )
                })()}
              </motion.div>
            )}
          </div>

          {/* Canvas Navigation Hint */}
          <div className="text-center">
            <p className="text-xs text-neutral-500 dark:text-neutral-500/70 font-extralight tracking-wider luxury-caption">
              Navigate the availability canvas • {dates.length} days • {timeSlots.length} time slots
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Hide scrollbars completely for clean aesthetic */
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        
        /* Smooth, premium scrolling */
        .overflow-x-auto,
        .overflow-y-auto {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  )
}