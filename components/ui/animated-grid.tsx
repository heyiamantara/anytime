'use client'

import React from 'react'

export default function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 animate-grid-move"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Animated Lines */}
      <div className="absolute inset-0">
        {/* Horizontal moving lines */}
        <div 
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-60 animate-slide-right"
          style={{ top: '20%' }}
        />
        <div 
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-40"
          style={{ 
            top: '60%',
            animation: 'slideRight 12s linear infinite reverse'
          }}
        />
        
        {/* Vertical moving lines */}
        <div 
          className="absolute h-full w-px bg-gradient-to-b from-transparent via-primary-500 to-transparent opacity-60 animate-slide-down"
          style={{ left: '30%' }}
        />
        <div 
          className="absolute h-full w-px bg-gradient-to-b from-transparent via-primary-400 to-transparent opacity-40"
          style={{ 
            left: '70%',
            animation: 'slideDown 15s linear infinite reverse'
          }}
        />
      </div>
      
      {/* Pulsing dots */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-2 h-2 bg-primary-500 rounded-full animate-pulse"
          style={{ top: '25%', left: '20%' }}
        />
        <div 
          className="absolute w-1 h-1 bg-primary-400 rounded-full animate-pulse"
          style={{ top: '70%', left: '80%' }}
        />
        <div 
          className="absolute w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse"
          style={{ top: '40%', left: '60%' }}
        />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white dark:from-neutral-900 dark:via-transparent dark:to-neutral-900 opacity-80" />
    </div>
  )
}