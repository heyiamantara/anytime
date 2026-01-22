'use client'

import { motion } from 'framer-motion'
import { Calendar, Share2, CheckSquare, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: Calendar,
    title: 'Create an event',
    description: 'Set your date range and available time slots.'
  },
  {
    icon: Share2,
    title: 'Share the link',
    description: 'Send one link to everyone. Participants join without accounts.'
  },
  {
    icon: CheckSquare,
    title: 'Everyone marks availability',
    description: 'Participants click to mark when they\'re free.'
  },
  {
    icon: Sparkles,
    title: 'Best time appears instantly',
    description: 'See the optimal time with the most overlap.'
  }
]

export default function HowItWorksSection() {
  return (
    <section className="section">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">
            Simple, fast, and designed for real groups
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold z-10">
                {index + 1}
              </div>

              {/* Card */}
              <div className="card-feature text-center h-full group">
                <div className="mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                    <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-neutral-900 dark:text-neutral-100">
                  {step.title}
                </h3>
                
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}