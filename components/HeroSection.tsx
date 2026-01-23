'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  onSignUp?: () => void
}

export default function HeroSection({ onSignUp }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-32">
      <div className="relative z-10 max-w-7xl mx-auto text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {/* Exclusive Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center space-x-3 bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-300/90 px-8 py-4 rounded-full text-sm font-light mb-16 backdrop-blur-sm"
          >
            <div className="w-2 h-2 bg-violet-500 dark:bg-violet-400 rounded-full animate-pulse"></div>
            <span className="tracking-widest uppercase text-xs luxury-caption">Trusted by 1,000+ teams</span>
          </motion.div>

          {/* Massive, Editorial Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-extralight mb-12 leading-[0.85] text-center luxury-heading tracking-tighter"
          >
            <span className="text-neutral-900 dark:text-white">
              The best time
            </span>
            <br />
            <span className="text-violet-600 dark:text-violet-400/90 italic">
              for everyone
            </span>
          </motion.h1>

          {/* Refined Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl font-extralight text-neutral-600 dark:text-neutral-300/80 mb-20 max-w-4xl mx-auto leading-relaxed text-center luxury-body tracking-wide"
          >
            Share one link. Everyone marks when they're free. The best time appears instantly.
          </motion.p>

          {/* Exclusive Primary Action */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 flex justify-center"
          >
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSignUp}
              className="group bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-16 py-6 rounded-3xl font-light text-xl tracking-widest transition-all duration-700 shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/40 luxury-glow uppercase"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-indigo-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <span className="relative flex items-center space-x-4">
                <span>Create an event</span>
                <ArrowRight className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </motion.button>
          </motion.div>

          {/* Atmospheric Metadata */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-16 text-neutral-500 dark:text-neutral-500/80"
          >
            <div className="flex items-center space-x-4">
              <div className="w-1.5 h-1.5 bg-violet-500 dark:bg-violet-400/60 rounded-full"></div>
              <span className="text-sm tracking-widest font-extralight luxury-caption">No signup for participants</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-1.5 h-1.5 bg-violet-500 dark:bg-violet-400/60 rounded-full"></div>
              <span className="text-sm tracking-widest font-extralight luxury-caption">Free forever</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-1.5 h-1.5 bg-violet-500 dark:bg-violet-400/60 rounded-full"></div>
              <span className="text-sm tracking-widest font-extralight luxury-caption">Setup in 30 seconds</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}