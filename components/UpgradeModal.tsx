'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown, Check, Zap, Users, Calendar } from 'lucide-react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  reason: 'events' | 'participants'
  currentUsage?: {
    events?: number
    participants?: number
  }
}

export default function UpgradeModal({ isOpen, onClose, reason, currentUsage }: UpgradeModalProps) {
  const handleUpgrade = () => {
    // In a real app, this would redirect to payment processing
    alert('Redirecting to payment page... (Demo only)')
    onClose()
  }

  const limitMessages = {
    events: {
      title: 'Event Limit Reached',
      description: 'You\'ve reached your limit of 10 events per week on the free plan.',
      current: `${currentUsage?.events || 0}/10 events this week`
    },
    participants: {
      title: 'Participant Limit Reached', 
      description: 'You\'ve reached your limit of 7 participants per event on the free plan.',
      current: `${currentUsage?.participants || 0}/7 participants for this event`
    }
  }

  const message = limitMessages[reason]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg"
        >
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-100">
                  {message.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-neutral-300 mb-3 sm:mb-4">
                {message.description}
              </p>
              
              <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-neutral-400">Current Usage</span>
                  <span className="text-xs sm:text-sm font-medium text-neutral-200">{message.current}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-100">Upgrade to Pro</h3>
                </div>
                
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    <span className="text-xs sm:text-sm text-neutral-300">Unlimited events per week</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    <span className="text-xs sm:text-sm text-neutral-300">Up to 50 participants per event</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    <span className="text-xs sm:text-sm text-neutral-300">Advanced analytics & insights</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    <span className="text-xs sm:text-sm text-neutral-300">Priority support</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    <span className="text-xs sm:text-sm text-neutral-300">Custom branding</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-neutral-100">$9.99</div>
                    <div className="text-xs sm:text-sm text-neutral-400">per month</div>
                  </div>
                  <button
                    onClick={handleUpgrade}
                    className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 w-full sm:w-auto"
                  >
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Upgrade Now</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-3 sm:pt-4 border-t border-neutral-700 space-y-2 sm:space-y-0">
              <button
                onClick={onClose}
                className="text-xs sm:text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                Maybe later
              </button>
              <div className="text-xs text-neutral-500 text-center sm:text-right">
                Cancel anytime • 30-day money-back guarantee
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}