'use client'

import { motion } from 'framer-motion'
import { Shield, ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight"
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
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-400 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            Find the perfect time for your group in seconds. Zero group chats, zero logins, zero confusion.
          </motion.p>

          {/* Security note */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex items-center justify-center space-x-2 text-neutral-500 dark:text-neutral-500 mb-8 sm:mb-12 text-sm sm:text-base"
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>No signup required for participants</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <button className="btn-primary flex items-center space-x-2 w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
              <span>Start for free</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="btn-secondary w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
              See how it works
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex items-center justify-center space-x-2 mb-12"
          >
            <Shield className="w-4 h-4 text-primary-600" />
            <span className="text-sm text-neutral-500 dark:text-neutral-500">
              Secure platform • Account required for event creators
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20"
          >
            <button className="btn-primary text-lg px-8 py-4">
              Get Started
            </button>
            <button className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2">
              <span>See Demo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Interactive Demo Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.4 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="card p-8">
              {/* Calendar Header */}
              <div className="grid grid-cols-5 gap-4 mb-8">
                {[
                  { day: 'Mon', date: 'Jan 23' },
                  { day: 'Tue', date: 'Jan 24' },
                  { day: 'Wed', date: 'Jan 25', selected: true },
                  { day: 'Thu', date: 'Jan 26' },
                  { day: 'Fri', date: 'Jan 27' }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className={`text-center p-4 rounded-xl transition-all ${
                      item.selected 
                        ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-300 dark:border-primary-700' 
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className={`text-sm mb-2 ${
                      item.selected ? 'text-primary-600' : 'text-neutral-500'
                    }`}>
                      {item.day}
                    </div>
                    <div className={`font-semibold ${
                      item.selected ? 'text-primary-700 dark:text-primary-400' : 'text-neutral-900 dark:text-neutral-100'
                    }`}>
                      {item.date}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Time Slots */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {['10:00 AM', '2:00 PM', '4:00 PM', '10:00 AM'].map((time, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg text-center font-medium transition-all ${
                      index === 2 
                        ? 'bg-primary-600 text-white shadow-lg' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {time}
                  </div>
                ))}
              </div>
              
              {/* Status */}
              <div className="text-center">
                <div className="text-sm text-neutral-500 dark:text-neutral-500 mb-2">
                  Best time appears instantly
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse-slow"></div>
                  <span className="text-primary-600 font-medium">4:00 PM selected</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}