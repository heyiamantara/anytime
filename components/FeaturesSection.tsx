'use client'

import { motion } from 'framer-motion'
import { Grid3X3, UserPlus, RefreshCw, Smartphone, Eye, Moon } from 'lucide-react'

const features = [
  {
    icon: Grid3X3,
    title: 'Visual availability grid',
    description: 'See everyone\'s availability at a glance with an intuitive color coded grid.'
  },
  {
    icon: UserPlus,
    title: 'No signup for participants',
    description: 'Participants join quickly with just their name. Event creators need accounts for security.'
  },
  {
    icon: RefreshCw,
    title: 'Real time updates',
    description: 'Watch availability update instantly as participants mark their times.'
  },
  {
    icon: Eye,
    title: 'Smart overlap detection',
    description: 'Automatically highlights the best slot with the most participants.'
  },
  {
    icon: Smartphone,
    title: 'Works on mobile',
    description: 'Fully responsive design that works perfectly on any device.'
  },
  {
    icon: Moon,
    title: 'Dark mode built in',
    description: 'Beautiful dark theme that\'s easy on the eyes, day or night.'
  }
]

export default function FeaturesSection() {
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
          <h2 className="section-title">Everything you need</h2>
          <p className="section-subtitle">
            Powerful features designed to make group scheduling effortless
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-6 sm:p-8 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3 sm:mb-4">
                {feature.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}