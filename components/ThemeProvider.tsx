'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    // Check localStorage and system preference
    const savedTheme = localStorage.getItem('anytime-theme') as Theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme
    
    console.log('Initial theme setup:', initialTheme)
    setTheme(initialTheme)
    
    // Apply to both html and body
    document.documentElement.classList.remove('light', 'dark')
    document.body.classList.remove('light', 'dark')
    document.documentElement.classList.add(initialTheme)
    document.body.classList.add(initialTheme)
  }, [])

  const updateTheme = (newTheme: Theme) => {
    console.log('updateTheme called with:', newTheme)
    setTheme(newTheme)
    localStorage.setItem('anytime-theme', newTheme)
    
    // Apply to both html and body elements
    const root = document.documentElement
    const body = document.body
    
    console.log('Current html classes before:', root.className)
    console.log('Current body classes before:', body.className)
    
    // Remove from both
    root.classList.remove('light', 'dark')
    body.classList.remove('light', 'dark')
    
    // Add to both
    root.classList.add(newTheme)
    body.classList.add(newTheme)
    
    console.log('Current html classes after:', root.className)
    console.log('Current body classes after:', body.className)
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}