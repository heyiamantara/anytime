'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import ProblemSection from '@/components/ProblemSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import FeaturesSection from '@/components/FeaturesSection'
import TestimonialSection from '@/components/TestimonialSection'
import PricingSection from '@/components/PricingSection'
import Footer from '@/components/Footer'
import AuthModal from '@/components/auth/AuthModal'
import UpgradeModal from '@/components/UpgradeModal'

export default function Home() {
  const { user, loading } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, show a simple redirect message instead of automatic redirect
  if (user) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Welcome back!
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            You're already signed in. Go to your dashboard to manage events.
          </p>
          <a 
            href="/dashboard"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Go to Dashboard</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    )
  }

  const handleSignUp = () => {
    setAuthModalOpen(true)
  }

  const handleUpgrade = () => {
    setUpgradeModalOpen(true)
  }

  // Show landing page for non-authenticated users
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900">
      <Header />
      <HeroSection onSignUp={handleSignUp} />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialSection />
      <PricingSection onSignUp={handleSignUp} onUpgrade={handleUpgrade} />
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="signup"
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