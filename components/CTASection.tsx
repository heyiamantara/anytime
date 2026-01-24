'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'

interface CTASectionProps {
  onSignUp?: () => void
}

export default function CTASection({ onSignUp }: CTASectionProps) {
  return (
    <section className="section bg-gradient-to-br from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Icon */}
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Ready to skip the scheduling chaos?
          </h2>

          {/* Supporting text */}
          <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of teams who've already ditched the endless group chats and found their perfect event times in seconds.
          </p>

          {/* CTA Button */}
          <motion.button
            onClick={onSignUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary-600 hover:bg-neutral-50 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:shadow-lg hover:shadow-black/20 flex items-center space-x-3 mx-auto"
          >
            <span>Start scheduling smarter</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* Trust signal */}
          <p className="text-white/70 text-sm mt-6">
            Free forever • No credit card required • Setup in 30 seconds
          </p>
        </motion.div>
      </div>
    </section>
  )
}