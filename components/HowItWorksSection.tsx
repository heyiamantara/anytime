'use client'

import { motion } from 'framer-motion'
import { Calendar, Share2, CheckSquare, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: Calendar,
    title: 'Create event',
    description: 'Set dates and times in 30 seconds.'
  },
  {
    icon: Share2,
    title: 'Share link',
    description: 'Send to everyone. No signups needed.'
  },
  {
    icon: CheckSquare,
    title: 'Get responses',
    description: 'People mark availability with clicks.'
  },
  {
    icon: Sparkles,
    title: 'Find best time',
    description: 'Perfect overlap highlighted automatically.'
  }
]

export default function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Editorial Section Header - Mobile Responsive */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-24"
        >
          <h2 className="text-responsive-hero font-extralight text-neutral-900 dark:text-white mb-6 sm:mb-8 tracking-tighter leading-[0.85] luxury-heading">
            How it works
          </h2>
          <p className="text-responsive-lg text-neutral-600 dark:text-neutral-300/80 max-w-3xl mx-auto leading-relaxed font-extralight tracking-wide luxury-body">
            Simple scheduling in 4 steps
          </p>
        </motion.div>

        {/* Mobile-Responsive Steps Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="group bg-gradient-to-br from-white/80 via-neutral-50/60 to-white/80 dark:from-neutral-900/30 dark:via-neutral-800/15 dark:to-neutral-900/30 backdrop-blur-2xl border border-neutral-200/50 dark:border-white/8 rounded-2xl sm:rounded-[2rem] p-responsive hover:bg-gradient-to-br hover:from-white/90 hover:via-neutral-50/70 hover:to-white/90 dark:hover:from-neutral-900/50 dark:hover:via-neutral-800/30 dark:hover:to-neutral-900/50 transition-all duration-700 hover:border-neutral-300/70 dark:hover:border-white/15 relative overflow-hidden shadow-lg dark:shadow-none"
            >
              {/* Subtle Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/2 to-indigo-500/2 rounded-2xl sm:rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative flex flex-col sm:flex-row items-start space-y-6 sm:space-y-0 sm:space-x-6 lg:space-x-8">
                {/* Step Number */}
                <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start space-x-4 sm:space-x-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-500/15 to-indigo-500/15 border border-violet-500/20 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-violet-500/25 group-hover:to-indigo-500/25 group-hover:border-violet-400/30 transition-all duration-700 mb-0 sm:mb-6">
                    <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-violet-500 dark:text-violet-400/90" />
                  </div>
                  <div className="text-4xl sm:text-6xl font-extralight text-violet-500/40 dark:text-violet-400/30 tracking-tighter luxury-heading">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                
                <div className="flex-1 pt-0 sm:pt-2">
                  <h3 className="text-responsive-xl font-extralight text-neutral-900 dark:text-white mb-4 sm:mb-6 tracking-wide luxury-heading capitalize">
                    {step.title}
                  </h3>
                  
                  <p className="text-responsive-base text-neutral-600 dark:text-neutral-400/80 leading-relaxed font-extralight tracking-wide luxury-body">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}