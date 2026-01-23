'use client'

import { Moon, Sun, LogOut, User, Home, Menu, X } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Logo from './Logo'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    setMobileMenuOpen(false)
  }

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
    setMobileMenuOpen(false)
  }

  const goToDashboard = () => {
    router.push('/dashboard')
    setMobileMenuOpen(false)
  }

  const goHome = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
    setMobileMenuOpen(false)
  }

  const isOnDashboard = pathname?.startsWith('/dashboard')
  const isOnEventPage = pathname?.startsWith('/event/')
  const showNavigation = !user && !isOnEventPage

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || mobileMenuOpen
            ? 'bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-800/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={goHome}
              className="hover:opacity-80 transition-opacity duration-300 touch-target"
            >
              <Logo size="md" animated={false} />
            </button>

            {/* Desktop Navigation - Centered */}
            {showNavigation && (
              <nav className="hidden lg:flex items-center justify-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
                <a href="#product" className="btn-ghost text-sm">
                  Product
                </a>
                <a href="#demo" className="btn-ghost text-sm">
                  Demo
                </a>
                <a href="#pricing" className="btn-ghost text-sm">
                  Pricing
                </a>
              </nav>
            )}

            {/* Desktop Right side */}
            <div className="hidden sm:flex items-center space-x-3">
              {/* Theme toggle */}
              <button
                onClick={() => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark'
                  setTheme(newTheme)
                }}
                className="p-2 rounded-lg hover:bg-neutral-800/50 transition-colors touch-target"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-neutral-400" />
                ) : (
                  <Moon className="w-5 h-5 text-neutral-400" />
                )}
              </button>

              {/* Auth buttons */}
              {loading ? (
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              ) : user ? (
                /* Authenticated user menu */
                <div className="flex items-center space-x-3">
                  {!hideSignOut && (
                    <button
                      onClick={handleSignOut}
                      className="btn-ghost flex items-center space-x-2 text-neutral-400 hover:text-neutral-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              ) : (
                /* Guest user buttons */
                <>
                  <button 
                    onClick={() => openAuthModal('login')}
                    className="btn-ghost px-4"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => openAuthModal('signup')}
                    className="btn-primary px-4 py-2"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Right side */}
            <div className="flex sm:hidden items-center space-x-2">
              {/* Theme toggle */}
              <button
                onClick={() => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark'
                  setTheme(newTheme)
                }}
                className="p-2 rounded-lg hover:bg-neutral-800/50 transition-colors touch-target"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-neutral-400" />
                ) : (
                  <Moon className="w-5 h-5 text-neutral-400" />
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-neutral-800/50 transition-colors touch-target"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-neutral-400" />
                ) : (
                  <Menu className="w-5 h-5 text-neutral-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="sm:hidden bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800/50"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Navigation Links */}
                {showNavigation && (
                  <div className="space-y-3 pb-4 border-b border-neutral-800/50">
                    <a 
                      href="#product" 
                      className="block py-2 text-neutral-300 hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Product
                    </a>
                    <a 
                      href="#demo" 
                      className="block py-2 text-neutral-300 hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Demo
                    </a>
                    <a 
                      href="#pricing" 
                      className="block py-2 text-neutral-300 hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pricing
                    </a>
                  </div>
                )}

                {/* Auth Section */}
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : user ? (
                  /* Authenticated user menu */
                  <div className="space-y-3">
                    <button
                      onClick={goToDashboard}
                      className="w-full text-left py-3 px-4 bg-neutral-800/50 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors flex items-center space-x-2"
                    >
                      <Home className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                    {!hideSignOut && (
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left py-3 px-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                ) : (
                  /* Guest user buttons */
                  <div className="space-y-3">
                    <button 
                      onClick={() => openAuthModal('login')}
                      className="w-full py-3 px-4 text-neutral-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-colors text-center"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => openAuthModal('signup')}
                      className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-center"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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