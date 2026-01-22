'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, Plus } from 'lucide-react'

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (event: any) => void
}

export default function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    time_blocks: [] as string[],
    is_24_7: false
  })

  // Available time slots to choose from
  const availableTimeSlots = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate time slots (unless 24/7 is selected)
    if (!formData.is_24_7 && formData.time_blocks.length === 0) {
      setError('Please select at least one time slot or enable 24/7 availability')
      setLoading(false)
      return
    }

    try {
      const submitData = {
        ...formData,
        time_blocks: formData.is_24_7 ? availableTimeSlots : formData.time_blocks
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      onSuccess(data.event)
      onClose()
      resetForm()
    } catch (err: any) {
      console.error('Event creation error:', err)
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error: Unable to connect to server. Please check your connection and try again.')
      } else {
        setError(err.message || 'Failed to create event. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      time_blocks: [],
      is_24_7: false
    })
    setError('')
  }

  const toggleTimeSlot = (timeSlot: string) => {
    if (formData.is_24_7) return // Don't allow manual selection when 24/7 is enabled
    
    setFormData(prev => ({
      ...prev,
      time_blocks: prev.time_blocks.includes(timeSlot)
        ? prev.time_blocks.filter(slot => slot !== timeSlot)
        : [...prev.time_blocks, timeSlot].sort()
    }))
  }

  const toggle24_7 = () => {
    setFormData(prev => ({
      ...prev,
      is_24_7: !prev.is_24_7,
      time_blocks: !prev.is_24_7 ? [] : prev.time_blocks // Clear manual selections when enabling 24/7
    }))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="card p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Create New Event
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Team Planning Session"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  rows={3}
                  placeholder="Brief description of the event..."
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    End Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Available Time Slots *
                  </label>
                  <div className="flex items-center space-x-4">
                    {/* 24/7 Toggle */}
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_24_7}
                        onChange={toggle24_7}
                        className="w-4 h-4 text-primary-600 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 rounded focus:ring-primary-500 focus:ring-2"
                      />
                      <span className="text-sm font-medium text-primary-600">24/7 Available</span>
                    </label>
                  </div>
                </div>

                {formData.is_24_7 ? (
                  /* 24/7 Mode */
                  <div className="p-6 bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-xl text-center">
                    <Clock className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">
                      24/7 Availability Enabled
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      Participants can select any hour of the day (00:00 - 23:00)
                    </p>
                  </div>
                ) : (
                  /* Manual Selection Mode */
                  <>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                      Choose the time slots when participants can be available
                    </p>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                      {availableTimeSlots.map((timeSlot) => {
                        const isSelected = formData.time_blocks.includes(timeSlot)
                        return (
                          <button
                            key={timeSlot}
                            type="button"
                            onClick={() => toggleTimeSlot(timeSlot)}
                            className={`flex items-center justify-center px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-700 text-neutral-700 dark:text-neutral-300'
                            }`}
                          >
                            <span className="font-medium">
                              {new Date(`2000-01-01T${timeSlot}`).toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {formData.time_blocks.length === 0 && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                        Please select at least one time slot or enable 24/7 availability
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl"
                >
                  <p className="text-sm text-orange-700 dark:text-orange-300">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Create Event</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}