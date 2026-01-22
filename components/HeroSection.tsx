'use client'

import { motion } from 'framer-motion'
import { Shield, ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  onSignUp?: () => void
}

export default function HeroSection({ onSignUp }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24">
      <div className="max-w-5xl mx-auto text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="badge mb-6 sm:mb-8"
          >
            <span className="text-sm sm:text-base">Trusted by 1,000+ groups</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight text-center"
          >
            <span className="text-neutral-900 dark:text-neutral-100">Stop scheduling.</span>
            <br />
            <span className="text-primary-600">Start meeting.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-400 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed text-center"
          >
            Find the perfect time for your group in seconds. Zero group chats, zero logins, zero confusion.
          </motion.p>

          {/* Security note */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex items-center justify-center space-x-2 text-neutral-500 dark:text-neutral-500 mb-8 sm:mb-12 text-sm sm:text-base text-center"
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>No signup required for participants</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4 sm:px-0"
          >
            <button 
              onClick={onSignUp}
              className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-w-[200px] sm:min-w-0"
            >
              <span>Start for free</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="btn-secondary w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-w-[200px] sm:min-w-0">
              See how it works
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}