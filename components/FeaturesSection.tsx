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
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-extralight text-neutral-900 dark:text-white mb-8 tracking-tighter leading-[0.85] luxury-heading">
            Everything you need
          </h2>
          <p className="text-2xl text-neutral-600 dark:text-neutral-300/80 max-w-3xl mx-auto leading-relaxed font-extralight tracking-wide luxury-body">
            Built for groups who value their time
          </p>
        </motion.div>

        {/* Full-Bleed Features Layout */}
        <div className="space-y-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="group bg-white/80 dark:bg-neutral-900/30 backdrop-blur-2xl border border-neutral-200/50 dark:border-white/8 rounded-[2rem] p-12 hover:bg-white/90 dark:hover:bg-neutral-900/50 hover:border-neutral-300/50 dark:hover:border-white/15 transition-all duration-700 relative overflow-hidden"
            >
              {/* Subtle Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/2 to-indigo-500/2 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative flex items-center space-x-12">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-violet-500/10 border border-violet-500/20 rounded-3xl flex items-center justify-center group-hover:bg-violet-500/15 group-hover:border-violet-400/30 transition-all duration-700">
                    <feature.icon className="w-10 h-10 text-violet-600 dark:text-violet-400/90" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-3xl font-extralight text-neutral-900 dark:text-white mb-4 tracking-wide luxury-heading">
                    {feature.title}
                  </h3>
                  
                  <p className="text-xl text-neutral-600 dark:text-neutral-400/80 leading-relaxed font-extralight tracking-wide luxury-body">
                    {feature.description}
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