'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, ArrowRight, Crown, AlertTriangle } from 'lucide-react'

interface ParticipantFormProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  onSuccess: (participant: any) => void
  currentParticipantCount?: number
  onUpgrade?: () => void
}

export default function ParticipantForm({ isOpen, onClose, eventId, onSuccess, currentParticipantCount = 0, onUpgrade }: ParticipantFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: ''
  })

  const MAX_PARTICIPANTS = 7
  const isAtLimit = currentParticipantCount >= MAX_PARTICIPANTS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isAtLimit) {
      setError('This event has reached the maximum of 7 participants. Upgrade to Pro for up to 50 participants per event.')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          name: formData.name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join event')
      }

      onSuccess(data.participant)
      resetForm()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '' })
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
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
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md mx-4"
        >
          <div className="card p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Join Event
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Participant Limit Warning */}
              {currentParticipantCount >= MAX_PARTICIPANTS * 0.8 && (
                <div className={`p-3 sm:p-4 rounded-lg border ${
                  isAtLimit 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : 'bg-yellow-500/10 border-yellow-500/20'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      isAtLimit ? 'text-red-400' : 'text-yellow-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      isAtLimit ? 'text-red-300' : 'text-yellow-300'
                    }`}>
                      {isAtLimit ? 'Participant Limit Reached' : 'Approaching Limit'}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    isAtLimit ? 'text-red-200' : 'text-yellow-200'
                  }`}>
                    {isAtLimit 
                      ? `This event has reached the maximum of ${MAX_PARTICIPANTS} participants on the free plan.`
                      : `This event has ${currentParticipantCount}/${MAX_PARTICIPANTS} participants.`
                    }
                  </p>
                  {isAtLimit && (
                    <div className="mt-3 flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-300">
                        Upgrade to Pro for up to 50 participants per event
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="Enter your name"
                    required
                    disabled={isAtLimit}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </button>
                
                {isAtLimit ? (
                  <button
                    type="button"
                    onClick={() => {
                      onUpgrade?.()
                      handleClose()
                    }}
                    className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 w-full sm:w-auto order-1 sm:order-2"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Upgrade</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto order-1 sm:order-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Join Event</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}