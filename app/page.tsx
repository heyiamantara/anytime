'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/components/ThemeProvider'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'
import HeroSection from '@/components/HeroSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import FeaturesSection from '@/components/FeaturesSection'
import DemoSection from '@/components/DemoSection'
import TestimonialsColumnSection from '@/components/TestimonialsColumnSection'
import PricingSection from '@/components/PricingSection'
import Footer from '@/components/Footer'
import AuthModal from '@/components/auth/AuthModal'
import UpgradeModal from '@/components/UpgradeModal'

export default function Home() {
  const { user, loading } = useAuth()
  const { theme, setTheme } = useTheme()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup')
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-6 luxury-glow" />
          <p className="text-neutral-400/80 font-extralight tracking-widest text-sm luxury-caption">Loading experience...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, show a simple redirect message instead of automatic redirect
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-emerald-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extralight text-white mb-4 tracking-wide luxury-heading">
            Welcome back!
          </h1>
          <p className="text-neutral-400/80 mb-8 font-extralight tracking-wide luxury-body">
            You're already signed in. Go to your dashboard to manage events.
          </p>
          <a 
            href="/dashboard"
            className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-light tracking-widest transition-all duration-500 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 inline-flex items-center space-x-3"
          >
            <span className="uppercase text-sm">Go to Dashboard</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    )
  }

  const handleSignUp = () => {
    setAuthModalMode('signup')
    setAuthModalOpen(true)
  }

  const handleSignIn = () => {
    setAuthModalMode('login')
    setAuthModalOpen(true)
  }

  const handleUpgrade = () => {
    setUpgradeModalOpen(true)
  }

  // Show landing page for non-authenticated users
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black">
      {/* Mobile-Responsive Navigation Integration */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/90 via-white/60 to-transparent dark:from-black/90 dark:via-black/60 dark:to-transparent backdrop-blur-xl border-b border-neutral-200/60 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <Logo size="md" animated={true} />
            
            {/* Desktop Navigation Menu - Absolutely positioned for true centering */}
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2"
            >
              <a 
                href="#features" 
                className="text-neutral-700 dark:text-neutral-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-500 font-extralight tracking-widest text-sm luxury-caption"
              >
                PRODUCT
              </a>
              <a 
                href="#demo" 
                className="text-neutral-700 dark:text-neutral-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-500 font-extralight tracking-widest text-sm luxury-caption"
              >
                DEMO
              </a>
              <a 
                href="#pricing" 
                className="text-neutral-700 dark:text-neutral-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-500 font-extralight tracking-widest text-sm luxury-caption"
              >
                PRICING
              </a>
              <a 
                href="#how-it-works" 
                className="text-neutral-700 dark:text-neutral-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-500 font-extralight tracking-widest text-sm luxury-caption"
              >
                HOW IT WORKS
              </a>
            </motion.nav>
            
            {/* Desktop Right Side */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="hidden sm:flex items-center space-x-4 sm:space-x-6"
            >
              {/* Theme Switcher */}
              <button
                onClick={() => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark'
                  setTheme(newTheme)
                }}
                className="p-2 sm:p-3 hover:bg-neutral-200/60 dark:hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all duration-500 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white touch-target"
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <button 
                onClick={handleSignIn}
                className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all duration-500 px-3 sm:px-4 py-2 rounded-xl hover:bg-neutral-200/60 dark:hover:bg-white/10 font-extralight tracking-widest text-xs sm:text-sm luxury-caption touch-target"
              >
                SIGN IN
              </button>
              <button 
                onClick={handleSignUp}
                className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-2xl sm:rounded-3xl font-light text-xs sm:text-sm tracking-widest transition-all duration-700 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 luxury-glow uppercase touch-target"
              >
                Sign Up
              </button>
            </motion.div>

            {/* Mobile Right Side */}
            <div className="flex sm:hidden items-center space-x-2">
              {/* Theme Switcher */}
              <button
                onClick={() => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark'
                  setTheme(newTheme)
                }}
                className="p-2 hover:bg-neutral-200/60 dark:hover:bg-white/10 rounded-xl transition-all duration-500 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white touch-target"
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Mobile Auth Buttons */}
              <button 
                onClick={handleSignIn}
                className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all duration-500 px-3 py-2 rounded-lg hover:bg-neutral-200/60 dark:hover:bg-white/10 font-extralight tracking-widest text-xs luxury-caption touch-target"
              >
                SIGN IN
              </button>
              <button 
                onClick={handleSignUp}
                className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl font-light text-xs tracking-widest transition-all duration-700 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 luxury-glow uppercase touch-target"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <HeroSection onSignUp={handleSignUp} />
      <HowItWorksSection />
      <FeaturesSection />
      <DemoSection />
      <TestimonialsColumnSection />
      <PricingSection onSignUp={handleSignUp} onUpgrade={handleUpgrade} />
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        reason="events"
        currentUsage={{ events: 0 }}
      />
    </main>
  )
}