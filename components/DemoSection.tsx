'use client'

import { motion } from 'framer-motion'
import { Users, Calendar, Clock, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const timeSlots = ['10:00 AM', '2:00 PM', '4:00 PM', '10:00 PM']
const days = [
  { day: 'Mon', date: 'Jan 23' },
  { day: 'Tue', date: 'Jan 24' },
  { day: 'Wed', date: 'Jan 25' },
  { day: 'Thu', date: 'Jan 26' },
  { day: 'Fri', date: 'Jan 27' }
]

const participants = [
  { name: 'Alex Chen', color: 'bg-blue-500', availability: [[false, true, true, false, true], [true, false, true, true, false], [true, true, true, true, true], [false, false, true, false, false]] },
  { name: 'Sam Johnson', color: 'bg-green-500', availability: [[true, false, true, true, false], [false, true, true, false, true], [true, true, true, true, true], [true, false, false, false, true]] },
  { name: 'Jordan Lee', color: 'bg-purple-500', availability: [[false, true, true, true, false], [true, true, true, false, true], [true, true, true, true, true], [false, true, true, true, false]] }
]

export default function DemoSection() {
  const [hoveredSlot, setHoveredSlot] = useState<{row: number, col: number} | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{row: number, col: number}>({row: 2, col: 2})

  const getSlotAvailability = (timeIndex: number, dayIndex: number) => {
    return participants.filter(p => p.availability[timeIndex][dayIndex]).length
  }

  const getSlotIntensity = (timeIndex: number, dayIndex: number) => {
    const available = getSlotAvailability(timeIndex, dayIndex)
    if (available === 3) return 'bg-gradient-to-br from-violet-500/40 to-indigo-500/40 border border-violet-400/50 text-violet-100 dark:text-violet-200 shadow-xl shadow-violet-500/20'
    if (available === 2) return 'bg-gradient-to-br from-violet-500/25 to-indigo-500/25 border border-violet-400/35 text-violet-200 dark:text-violet-300'
    if (available === 1) return 'bg-gradient-to-br from-violet-500/15 to-indigo-500/15 border border-violet-500/25 text-violet-300 dark:text-violet-400'
    return 'bg-neutral-200/50 dark:bg-neutral-800/20 border border-neutral-300/30 dark:border-neutral-700/20 text-neutral-500'
  }

  const isOptimalSlot = (timeIndex: number, dayIndex: number) => {
    return getSlotAvailability(timeIndex, dayIndex) === 3
  }

  return (
    <section id="demo" className="py-16 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Editorial Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-24"
        >
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-neutral-900 dark:text-white mb-4 sm:mb-8 tracking-tighter leading-[0.85] luxury-heading">
            See it in action
          </h2>
          <p className="text-base sm:text-xl md:text-2xl text-neutral-600 dark:text-neutral-300/80 max-w-3xl mx-auto leading-relaxed font-extralight tracking-wide luxury-body">
            Interactive demo showing real scheduling in action
          </p>
        </motion.div>

        {/* Immersive Demo Container */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white/80 via-neutral-50/60 to-white/80 dark:from-neutral-900/40 dark:via-neutral-800/20 dark:to-neutral-900/40 backdrop-blur-2xl border border-neutral-200/50 dark:border-white/8 rounded-xl sm:rounded-[2rem] p-6 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/3 to-indigo-500/3 rounded-xl sm:rounded-[2rem]"></div>
          
          <div className="relative">
            {/* Demo Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-12 space-y-4 sm:space-y-6 lg:space-y-0">
              <div>
                <h3 className="text-lg sm:text-2xl font-extralight text-neutral-900 dark:text-white mb-2 sm:mb-4 tracking-wide luxury-heading">
                  Team Planning Session
                </h3>
                <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-400/80 font-extralight tracking-wide luxury-body">
                  Interactive preview • hover over cells to explore
                </p>
              </div>
              <div className="flex items-center space-x-4 sm:space-x-8 text-neutral-500 dark:text-neutral-400/70">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-violet-500/80 dark:bg-violet-400/60 rounded-full"></div>
                  <span className="text-xs sm:text-sm tracking-widest font-extralight luxury-caption">3 participants</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-violet-500/80 dark:bg-violet-400/60 rounded-full"></div>
                  <span className="text-xs sm:text-sm tracking-widest font-extralight luxury-caption">Jan 23-27</span>
                </div>
              </div>
            </div>

            {/* Luxury Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[500px] sm:min-w-[700px]">
                {/* Days Header */}
                <div className="grid grid-cols-6 gap-2 sm:gap-4 mb-4 sm:mb-8">
                  <div></div>
                  {days.map((item, index) => (
                    <div key={index} className="text-center p-2 sm:p-4">
                      <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400/80 mb-1 sm:mb-2 font-extralight tracking-widest luxury-caption">{item.day}</div>
                      <div className="font-light text-neutral-900 dark:text-white tracking-wide luxury-body text-xs sm:text-base">{item.date}</div>
                    </div>
                  ))}
                </div>

                {/* Time Slots Grid */}
                <div className="space-y-2 sm:space-y-4">
                  {timeSlots.map((time, timeIndex) => (
                    <div key={timeIndex} className="grid grid-cols-6 gap-2 sm:gap-4 items-center">
                      <div className="text-xs sm:text-sm font-extralight text-neutral-700 dark:text-neutral-300/90 text-right pr-2 sm:pr-6 tracking-widest luxury-caption">
                        {time}
                      </div>
                      {days.map((_, dayIndex) => {
                        const available = getSlotAvailability(timeIndex, dayIndex)
                        const isHovered = hoveredSlot?.row === timeIndex && hoveredSlot?.col === dayIndex
                        const isSelected = selectedSlot.row === timeIndex && selectedSlot.col === dayIndex
                        const isOptimal = isOptimalSlot(timeIndex, dayIndex)
                        
                        return (
                          <motion.div
                            key={dayIndex}
                            whileHover={{ scale: 1.08, y: -3 }}
                            whileTap={{ scale: 0.92 }}
                            onMouseEnter={() => setHoveredSlot({row: timeIndex, col: dayIndex})}
                            onMouseLeave={() => setHoveredSlot(null)}
                            onClick={() => setSelectedSlot({row: timeIndex, col: dayIndex})}
                            className={`h-10 sm:h-16 rounded-xl sm:rounded-3xl cursor-pointer transition-all duration-700 flex items-center justify-center relative backdrop-blur-sm ${
                              getSlotIntensity(timeIndex, dayIndex)
                            } ${
                              isHovered ? 'shadow-2xl shadow-violet-500/30 border-violet-400/60 scale-105' : ''
                            } ${
                              isSelected ? 'ring-2 ring-violet-400/50 shadow-xl shadow-violet-500/25' : ''
                            }`}
                          >
                            {/* Availability count */}
                            <span className="text-xs sm:text-sm font-extralight tracking-widest">
                              {available > 0 ? `${available}/3` : ''}
                            </span>
                            
                            {/* Optimal indicator */}
                            {isOptimal && (
                              <div className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-xl shadow-yellow-500/50 animate-pulse"></div>
                            )}

                            {/* Hover Atmosphere Effect */}
                            {isHovered && (
                              <div className="absolute inset-0 bg-gradient-to-br from-violet-400/15 to-indigo-400/15 rounded-xl sm:rounded-3xl"></div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  ))}
                </div>

                {/* Refined Participants Legend */}
                <div className="mt-6 sm:mt-12 pt-4 sm:pt-8 border-t border-neutral-200/50 dark:border-white/8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 sm:space-y-6 lg:space-y-0">
                    <div>
                      <div className="text-xs sm:text-sm font-extralight text-neutral-700 dark:text-neutral-300/90 mb-3 sm:mb-6 tracking-widest luxury-caption">
                        PARTICIPANTS:
                      </div>
                      <div className="space-y-2 sm:space-y-4">
                        {participants.map((participant, index) => (
                          <div key={index} className="flex items-center space-x-2 sm:space-x-4">
                            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-xl sm:rounded-2xl ${participant.color} shadow-lg`}></div>
                            <span className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300/90 font-extralight tracking-wide luxury-body">
                              {participant.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Atmospheric Status Display */}
                    <div className="text-left lg:text-right">
                      {hoveredSlot ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400/80 mb-1 sm:mb-2 font-extralight tracking-widest luxury-caption">
                            {timeSlots[hoveredSlot.row]} on {days[hoveredSlot.col].day}
                          </div>
                          <div className="flex items-center justify-start lg:justify-end space-x-2 sm:space-x-3">
                            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full shadow-lg ${
                              getSlotAvailability(hoveredSlot.row, hoveredSlot.col) === 3 ? 'bg-gradient-to-br from-emerald-400 to-teal-400' :
                              getSlotAvailability(hoveredSlot.row, hoveredSlot.col) >= 2 ? 'bg-gradient-to-br from-yellow-400 to-orange-400' : 'bg-gradient-to-br from-red-400 to-pink-400'
                            }`}></div>
                            <span className="text-xs sm:text-sm font-light text-neutral-900 dark:text-white tracking-wide luxury-body">
                              {getSlotAvailability(hoveredSlot.row, hoveredSlot.col)} available
                            </span>
                          </div>
                        </motion.div>
                      ) : (
                        <div>
                          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400/80 mb-1 sm:mb-2 font-extralight tracking-widest luxury-caption">BEST MATCH</div>
                          <div className="flex items-center justify-start lg:justify-end space-x-2 sm:space-x-3">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-violet-400 to-indigo-400 rounded-full shadow-xl shadow-violet-500/50 animate-pulse"></div>
                            <span className="text-violet-600 dark:text-violet-300 font-light tracking-wide luxury-body text-xs sm:text-base">4:00 PM Wed • Perfect!</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Exclusive CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16"
        >
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 sm:px-12 sm:py-6 rounded-lg sm:rounded-3xl font-light text-xs sm:text-lg tracking-widest transition-all duration-700 shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/40 luxury-glow uppercase"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-indigo-400/20 rounded-lg sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <span className="relative flex items-center space-x-1 sm:space-x-4">
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3 sm:w-6 sm:h-6 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}