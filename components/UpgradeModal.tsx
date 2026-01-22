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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-neutral-100">
                  {message.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-8">
              <p className="text-neutral-300 mb-4">
                {message.description}
              </p>
              
              <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Current Usage</span>
                  <span className="text-sm font-medium text-neutral-200">{message.current}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Zap className="w-6 h-6 text-primary-400" />
                  <h3 className="text-lg font-semibold text-neutral-100">Upgrade to Pro</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-neutral-300">Unlimited events per week</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-neutral-300">Up to 50 participants per event</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-neutral-300">Advanced analytics & insights</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-neutral-300">Priority support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-neutral-300">Custom branding</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-neutral-100">$9.99</div>
                    <div className="text-sm text-neutral-400">per month</div>
                  </div>
                  <button
                    onClick={handleUpgrade}
                    className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Upgrade Now</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-700">
              <button
                onClick={onClose}
                className="text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                Maybe later
              </button>
              <div className="text-xs text-neutral-500">
                Cancel anytime • 30-day money-back guarantee
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}