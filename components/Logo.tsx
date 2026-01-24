'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'nav' | 'md' | 'lg' | 'xl'
  className?: string
  animated?: boolean
}

export default function Logo({ size = 'md', className = '', animated = true }: LogoProps) {
  const sizeClasses = {
    sm: { width: 60, height: 16 },
    nav: { width: 120, height: 32 },
    md: { width: 320, height: 84 },
    lg: { width: 400, height: 106 },
    xl: { width: 480, height: 128 }
  }

  const LogoContent = () => (
    <div className={`${className} h-full flex items-center`}>
      <Image
        src="/logo/anytime-logo.png"
        alt="Anytime"
        width={sizeClasses[size].width}
        height={sizeClasses[size].height}
        className="h-full w-auto object-contain dark:brightness-0 dark:invert dark:hue-rotate-180 dark:saturate-50 dark:contrast-125"
        priority
      />
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
    sm: { width: 80, height: 64 },
    nav: { width: 100, height: 80 },
    md: { width: 100, height: 84 }, 
    lg: { width: 120, height: 106 },
    xl: { width: 160, height: 128 }
  }

  return (
    <div className={`${className} h-full flex items-center`}>
      <Image
        src="/logo/anytime-logo.png"
        alt="AT"
        width={sizeClasses[size].width}
        height={sizeClasses[size].height}
        className="h-full w-auto object-contain object-left dark:brightness-0 dark:invert dark:hue-rotate-180 dark:saturate-50 dark:contrast-125"
        style={{ clipPath: 'inset(0 70% 0 0)' }}
        priority
      />
    </div>
  )
}

// Full brand logo with tagline for special occasions
export function LogoWithTagline({ size = 'lg', className = '' }: Omit<LogoProps, 'animated'>) {
  const sizeClasses = {
    sm: { width: 280, height: 74 },
    nav: { width: 320, height: 84 },
    md: { width: 360, height: 96 },
    lg: { width: 440, height: 116 }, 
    xl: { width: 520, height: 138 }
  }

  const taglineSizes = {
    sm: 'text-xs',
    nav: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base'
  }

  return (
    <div className={`${className}`}>
      <Image
        src="/logo/anytime-logo.png"
        alt="Anytime"
        width={sizeClasses[size].width}
        height={sizeClasses[size].height}
        className="object-contain dark:brightness-0 dark:invert dark:hue-rotate-180 dark:saturate-50 dark:contrast-125"
        priority
      />
      <div className={`${taglineSizes[size]} text-neutral-600 dark:text-neutral-400/80 font-mono font-bold tracking-wider mt-2 text-center`}>
        THE BEST TIME FOR EVERYONE
      </div>
    </div>
  )
}