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

    // Validate date range
    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)
    if (startDate > endDate) {
      setError('End date must be after start date')
      setLoading(false)
      return
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        time_blocks: formData.is_24_7 ? availableTimeSlots : formData.time_blocks,
        is_24_7: formData.is_24_7
      }

      // Use AbortController for request timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Optimistic update - call success immediately
      onSuccess(data.event)
      onClose()
      resetForm()
      
    } catch (err: any) {
      console.error('Event creation error:', err)
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.')
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        {/* Luxury Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gradient-to-br from-black/80 via-neutral-900/90 to-black/80 backdrop-blur-2xl"
        />

        {/* Atmospheric Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Luxury Glass Container */}
          <div className="bg-gradient-to-br from-neutral-900/60 via-neutral-800/40 to-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 relative overflow-hidden">
            {/* Atmospheric Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 rounded-[2rem]" />
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-extralight text-white tracking-tight luxury-heading">
                  Create New Event
                </h2>
                <button
                  onClick={onClose}
                  className="p-4 hover:bg-white/5 rounded-2xl transition-all duration-500 text-neutral-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Event Details Section */}
                <div className="space-y-8">
                  {/* Event Name */}
                  <div>
                    <label className="block text-sm font-extralight text-neutral-300/90 mb-4 tracking-widest luxury-caption">
                      EVENT NAME *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-6 py-5 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-white/10 rounded-2xl text-white placeholder-neutral-500/70 focus:outline-none focus:border-violet-500/50 focus:bg-gradient-to-r focus:from-neutral-900/70 focus:to-neutral-800/70 transition-all duration-500 font-extralight tracking-wide text-lg"
                      placeholder="Team Planning Session"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-extralight text-neutral-300/90 mb-4 tracking-widest luxury-caption">
                      DESCRIPTION
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-6 py-5 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-white/10 rounded-2xl text-white placeholder-neutral-500/70 focus:outline-none focus:border-violet-500/50 focus:bg-gradient-to-r focus:from-neutral-900/70 focus:to-neutral-800/70 transition-all duration-500 font-extralight tracking-wide resize-none"
                      rows={4}
                      placeholder="Brief description of the event..."
                    />
                  </div>
                </div>

                {/* Date Range Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-extralight text-neutral-300/90 mb-4 tracking-widest luxury-caption">
                      START DATE *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500/70" />
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        className="w-full pl-14 pr-6 py-5 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-violet-500/50 focus:bg-gradient-to-r focus:from-neutral-900/70 focus:to-neutral-800/70 transition-all duration-500 font-extralight tracking-wide"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-extralight text-neutral-300/90 mb-4 tracking-widest luxury-caption">
                      END DATE *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500/70" />
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                        className="w-full pl-14 pr-6 py-5 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-violet-500/50 focus:bg-gradient-to-r focus:from-neutral-900/70 focus:to-neutral-800/70 transition-all duration-500 font-extralight tracking-wide"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Time Slots Section */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <label className="block text-sm font-extralight text-neutral-300/90 tracking-widest luxury-caption">
                      AVAILABLE TIME SLOTS *
                    </label>
                    {/* 24/7 Toggle */}
                    <label className="flex items-center space-x-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_24_7}
                        onChange={toggle24_7}
                        className="w-5 h-5 text-violet-600 bg-neutral-900/50 border-white/20 rounded focus:ring-violet-500 focus:ring-2"
                      />
                      <span className="text-sm font-light text-violet-400/90 tracking-widest luxury-caption">24/7 AVAILABLE</span>
                    </label>
                  </div>

                  {formData.is_24_7 ? (
                    /* 24/7 Mode */
                    <div className="p-8 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-3xl text-center">
                      <Clock className="w-12 h-12 text-violet-400/80 mx-auto mb-6" />
                      <h3 className="text-2xl font-extralight text-white mb-4 tracking-wide luxury-heading">
                        24/7 Availability Enabled
                      </h3>
                      <p className="text-neutral-400/80 font-extralight tracking-wide luxury-body">
                        Participants can select any hour of the day (00:00 - 23:00)
                      </p>
                    </div>
                  ) : (
                    /* Manual Selection Mode */
                    <>
                      <p className="text-neutral-500/80 font-extralight tracking-wide mb-8 luxury-body">
                        Choose the time slots when participants can be available
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                        {availableTimeSlots.map((timeSlot) => {
                          const isSelected = formData.time_blocks.includes(timeSlot)
                          return (
                            <button
                              key={timeSlot}
                              type="button"
                              onClick={() => toggleTimeSlot(timeSlot)}
                              className={`flex items-center justify-center px-4 py-4 rounded-2xl border-2 transition-all duration-500 font-extralight tracking-wide ${
                                isSelected
                                  ? 'border-violet-500/60 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-300/90'
                                  : 'border-white/10 hover:border-violet-500/30 hover:bg-gradient-to-br hover:from-violet-500/5 hover:to-indigo-500/5 text-neutral-400/80 hover:text-neutral-300'
                              }`}
                            >
                              <span className="text-sm">
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
                        <p className="text-neutral-500/70 font-extralight tracking-wide text-center luxury-caption">
                          Please select at least one time slot or enable 24/7 availability
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl"
                  >
                    <p className="text-red-300/90 font-extralight tracking-wide luxury-body">{error}</p>
                  </motion.div>
                )}

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 hover:from-neutral-600/60 hover:to-neutral-500/60 text-white px-10 py-4 rounded-2xl font-light tracking-widest transition-all duration-500 border border-white/10 hover:border-white/20 uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-12 py-4 rounded-2xl font-light tracking-widest transition-all duration-700 shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed luxury-glow flex items-center justify-center space-x-4 uppercase"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Event...</span>
                      </>
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
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}