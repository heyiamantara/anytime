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
    if (available === 3) return 'bg-primary-600 text-white shadow-lg'
    if (available === 2) return 'bg-primary-400 text-white'
    if (available === 1) return 'bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200'
    return 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
  }

  const isOptimalSlot = (timeIndex: number, dayIndex: number) => {
    return getSlotAvailability(timeIndex, dayIndex) === 3
  }

  return (
    <section id="demo" className="section bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">See it in action</h2>
          <p className="section-subtitle">
            Interactive demo showing real scheduling in action. Hover over time slots to explore.
          </p>
        </motion.div>

        {/* Demo Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="card p-8 lg:p-12">
            {/* Demo Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  Team Planning Session
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Interactive preview • hover over cells to explore
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-neutral-500">
                  <Users className="w-4 h-4" />
                  <span>3 participants</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-500">
                  <Calendar className="w-4 h-4" />
                  <span>Jan 23-27</span>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Days Header */}
                <div className="grid grid-cols-6 gap-3 mb-6">
                  <div></div> {/* Empty cell for time column */}
                  {days.map((item, index) => (
                    <div key={index} className="text-center p-3">
                      <div className="text-sm text-neutral-500 mb-1">{item.day}</div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">{item.date}</div>
                    </div>
                  ))}
                </div>

                {/* Time Slots Grid */}
                <div className="space-y-3">
                  {timeSlots.map((time, timeIndex) => (
                    <div key={timeIndex} className="grid grid-cols-6 gap-3 items-center">
                      <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 text-right pr-4">
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
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onMouseEnter={() => setHoveredSlot({row: timeIndex, col: dayIndex})}
                            onMouseLeave={() => setHoveredSlot(null)}
                            onClick={() => setSelectedSlot({row: timeIndex, col: dayIndex})}
                            className={`h-14 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center relative ${
                              getSlotIntensity(timeIndex, dayIndex)
                            } ${
                              isHovered ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900' : ''
                            } ${
                              isSelected ? 'ring-2 ring-primary-600 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900' : ''
                            }`}
                          >
                            {/* Availability count */}
                            <span className="text-xs font-medium">
                              {available > 0 ? `${available}/3` : ''}
                            </span>
                            
                            {/* Optimal indicator */}
                            {isOptimal && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse-slow"></div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  ))}
                </div>

                {/* Participants Legend */}
                <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Participants:
                      </div>
                      {participants.map((participant, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${participant.color}`}></div>
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {participant.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Status Display */}
                    <div className="text-right">
                      {hoveredSlot ? (
                        <div>
                          <div className="text-sm text-neutral-500 mb-1">
                            {timeSlots[hoveredSlot.row]} on {days[hoveredSlot.col].day}
                          </div>
                          <div className="flex items-center justify-end space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              getSlotAvailability(hoveredSlot.row, hoveredSlot.col) === 3 ? 'bg-green-500' :
                              getSlotAvailability(hoveredSlot.row, hoveredSlot.col) >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              {getSlotAvailability(hoveredSlot.row, hoveredSlot.col)} available
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm text-neutral-500 mb-1">Best match</div>
                          <div className="flex items-center justify-end space-x-2">
                            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse-slow"></div>
                            <span className="text-primary-600 font-medium">4:00 PM Wed • Perfect!</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}