'use client'

import { Moon, Sun, LogOut, User, Home } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import AuthModal from './auth/AuthModal'
import { useRouter, usePathname } from 'next/navigation'

interface HeaderProps {
  hideSignOut?: boolean
}

export default function Header({ hideSignOut = false }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { user, signOut, loading } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  const goToDashboard = () => {
    router.push('/dashboard')
  }

  const goHome = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  }

  const isOnDashboard = pathname?.startsWith('/dashboard')
  const isOnEventPage = pathname?.startsWith('/event/')

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={goHome}
              className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 hover:text-primary-600 transition-colors"
            >
              Anytime
            </button>

            {/* Navigation - Centered (only show on landing page for non-authenticated users) */}
            {!user && !isOnEventPage && (
              <nav className="hidden lg:flex items-center justify-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
                <a href="#product" className="btn-ghost">
                  Product
                </a>
                <a href="#pricing" className="btn-ghost">
                  Pricing
                </a>
              </nav>
            )}

            {/* Right side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400" />
                )}
              </button>

              {/* Auth buttons */}
              {loading ? (
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              ) : user ? (
                /* Authenticated user menu */
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {!hideSignOut && (
                    <button
                      onClick={handleSignOut}
                      className="btn-ghost flex items-center space-x-1 sm:space-x-2 text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 text-sm sm:text-base"
                    >
                      <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </button>
                  )}
                </div>
              ) : (
                /* Guest user buttons */
                <>
                  <button 
                    onClick={() => openAuthModal('login')}
                    className="btn-ghost text-sm sm:text-base px-2 sm:px-4"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => openAuthModal('signup')}
                    className="btn-primary text-sm sm:text-base px-3 sm:px-4 py-2"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Auth Modal - only show for non-authenticated users */}
      {!user && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode}
        />
      )}
    </>
  )
}