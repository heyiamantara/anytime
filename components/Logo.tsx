'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  animated?: boolean
}

export default function Logo({ size = 'md', className = '', animated = true }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }

  const LogoContent = () => (
    <div className={`font-extralight tracking-wider luxury-heading ${sizeClasses[size]} ${className}`}>
      <span className="text-neutral-900 dark:text-white">Any</span>
      <span className="text-violet-600 dark:text-violet-400 font-light italic">time</span>
    </div>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
      >
        <LogoContent />
      </motion.div>
    )
  }

  return <LogoContent />
}

// Alternative logo variations for different contexts
export function LogoMark({ size = 'md', className = '' }: Omit<LogoProps, 'animated'>) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl', 
    lg: 'text-3xl',
    xl: 'text-4xl'
  }

  return (
    <div className={`font-light tracking-widest luxury-heading ${sizeClasses[size]} ${className}`}>
      <span className="text-neutral-900 dark:text-white">A</span>
      <span className="text-violet-600 dark:text-violet-400 italic">T</span>
    </div>
  )
}

// Full brand logo with tagline for special occasions
export function LogoWithTagline({ size = 'lg', className = '' }: Omit<LogoProps, 'animated'>) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl', 
    xl: 'text-3xl'
  }

  const taglineSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm',
    xl: 'text-base'
  }

  return (
    <div className={`${className}`}>
      <div className={`font-extralight tracking-wider luxury-heading ${sizeClasses[size]}`}>
        <span className="text-neutral-900 dark:text-white">Any</span>
        <span className="text-violet-600 dark:text-violet-400 font-light italic">time</span>
      </div>
      <div className={`${taglineSizes[size]} text-neutral-600 dark:text-neutral-400/80 font-extralight tracking-widest luxury-caption mt-1`}>
        THE BEST TIME FOR EVERYONE
      </div>
    </div>
  )
}