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
        {/* Luxury Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        />

        {/* Luxury Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg mx-4"
        >
          <div className="bg-gradient-to-br from-neutral-900/90 via-neutral-800/80 to-neutral-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
            {/* Refined Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-extralight text-white tracking-wide luxury-heading">
                Join Event
              </h2>
              <button
                onClick={handleClose}
                className="p-3 hover:bg-white/5 rounded-2xl transition-all duration-300"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Luxury Participant Limit Warning */}
              {currentParticipantCount >= MAX_PARTICIPANTS * 0.8 && (
                <div className={`p-6 rounded-2xl border backdrop-blur-sm ${
                  isAtLimit 
                    ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20' 
                    : 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20'
                }`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertTriangle className={`w-5 h-5 ${
                      isAtLimit ? 'text-red-400' : 'text-yellow-400'
                    }`} />
                    <span className={`text-sm font-light tracking-widest ${
                      isAtLimit ? 'text-red-300' : 'text-yellow-300'
                    } luxury-caption`}>
                      {isAtLimit ? 'PARTICIPANT LIMIT REACHED' : 'APPROACHING LIMIT'}
                    </span>
                  </div>
                  <p className={`text-sm font-extralight tracking-wide ${
                    isAtLimit ? 'text-red-200/90' : 'text-yellow-200/90'
                  } luxury-body`}>
                    {isAtLimit 
                      ? `This event has reached the maximum of ${MAX_PARTICIPANTS} participants on the free plan.`
                      : `This event has ${currentParticipantCount}/${MAX_PARTICIPANTS} participants.`
                    }
                  </p>
                  {isAtLimit && (
                    <div className="mt-4 flex items-center space-x-3">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-300/90 font-extralight tracking-wide luxury-body">
                        Upgrade to Pro for up to 50 participants per event
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Refined Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-extralight text-neutral-300/90 mb-4 tracking-widest luxury-caption">
                  YOUR NAME *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400/70" />
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-12 pr-4 py-4 border border-white/10 rounded-2xl bg-neutral-800/30 backdrop-blur-sm text-white placeholder-neutral-400/70 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all duration-500 text-base font-extralight tracking-wide"
                    placeholder="Enter your name"
                    required
                    disabled={isAtLimit}
                  />
                </div>
              </div>

              {/* Luxury Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm"
                >
                  <p className="text-sm text-red-300/90 font-extralight tracking-wide luxury-body">{error}</p>
                </motion.div>
              )}

              {/* Refined Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-neutral-400 hover:text-white px-6 py-3 rounded-2xl hover:bg-white/5 transition-all duration-500 font-extralight tracking-widest w-full sm:w-auto order-2 sm:order-1 luxury-caption"
                >
                  CANCEL
                </button>
                
                {isAtLimit ? (
                  <button
                    type="button"
                    onClick={() => {
                      onUpgrade?.()
                      handleClose()
                    }}
                    className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-light transition-all duration-500 flex items-center space-x-3 w-full sm:w-auto order-1 sm:order-2 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 tracking-widest"
                  >
                    <Crown className="w-5 h-5" />
                    <span className="luxury-caption">UPGRADE</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-light transition-all duration-500 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto order-1 sm:order-2 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 tracking-widest"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="luxury-caption">JOIN EVENT</span>
                        <ArrowRight className="w-5 h-5" />
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