'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface SignupFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export default function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // Note: User will need to confirm email before they can sign in
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm sm:max-w-lg mx-auto"
      >
        {/* Success State - Mobile Responsive */}
        <div className="bg-gradient-to-br from-neutral-900/60 via-neutral-800/40 to-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-[2rem] p-responsive text-center relative overflow-hidden">
          {/* Atmospheric Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl sm:rounded-[2rem]" />
          
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-emerald-500/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400/80" />
            </div>
            <h2 className="text-responsive-2xl font-extralight text-white mb-4 sm:mb-6 tracking-tight luxury-heading">
              Check your email
            </h2>
            <p className="text-neutral-400/80 font-extralight text-responsive-base tracking-wide mb-8 sm:mb-10 luxury-body">
              We've sent you a confirmation link at <span className="text-white font-light break-all">{email}</span>
            </p>
            <button
              onClick={onSwitchToLogin}
              className="bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 hover:from-neutral-600/60 hover:to-neutral-500/60 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-light tracking-widest transition-all duration-500 border border-white/10 hover:border-white/20 uppercase text-sm sm:text-base touch-target"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm sm:max-w-lg mx-auto"
    >
      {/* Luxury Glass Container - Mobile Responsive */}
      <div className="bg-gradient-to-br from-neutral-900/60 via-neutral-800/40 to-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-[2rem] p-responsive relative overflow-hidden">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 rounded-2xl sm:rounded-[2rem]" />
        
        <div className="relative">
          {/* Header - Mobile Responsive */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-responsive-2xl font-extralight text-white mb-4 sm:mb-6 tracking-tight luxury-heading">
              Create your account
            </h2>
            <p className="text-neutral-400/80 font-extralight text-responsive-base tracking-wide luxury-body">
              Start scheduling meetings with elegance
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Email Field - Mobile Responsive */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-extralight text-neutral-300/90 mb-3 sm:mb-4 tracking-widest luxury-caption">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-500/70" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-neutral-500/70 focus:outline-none focus:border-violet-500/50 focus:bg-gradient-to-r focus:from-neutral-900/70 focus:to-neutral-800/70 transition-all duration-500 font-extralight tracking-wide text-sm sm:text-base touch-target"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field - Mobile Responsive */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-extralight text-neutral-300/90 mb-3 sm:mb-4 tracking-widest luxury-caption">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-500/70" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-4 sm:py-5 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-neutral-500/70 focus:outline-none focus:border-violet-500/50 focus:bg-gradient-to-r focus:from-neutral-900/70 focus:to-neutral-800/70 transition-all duration-500 font-extralight tracking-wide text-sm sm:text-base touch-target"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-neutral-500/70 hover:text-neutral-300 transition-colors duration-300 touch-target"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              <p className="text-xs text-neutral-500/70 mt-2 sm:mt-3 font-extralight tracking-widest luxury-caption">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password Field - Mobile Responsive */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-extralight text-neutral-300/90 mb-3 sm:mb-4 tracking-widest luxury-caption">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-500/70" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-4 sm:py-5 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-neutral-500/70 focus:outline-none focus:border-violet-500/50 focus:bg-gradient-to-r focus:from-neutral-900/70 focus:to-neutral-800/70 transition-all duration-500 font-extralight tracking-wide text-sm sm:text-base touch-target"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-neutral-500/70 hover:text-neutral-300 transition-colors duration-300 touch-target"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message - Mobile Responsive */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 sm:p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl"
              >
                <p className="text-red-300/90 font-extralight tracking-wide luxury-body text-sm sm:text-base">{error}</p>
              </motion.div>
            )}

            {/* Submit Button - Mobile Responsive */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white py-4 sm:py-6 rounded-xl sm:rounded-2xl font-light tracking-widest transition-all duration-700 shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed luxury-glow flex items-center justify-center space-x-3 sm:space-x-4 text-base sm:text-lg touch-target-lg"
            >
              {loading ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="uppercase">Create Account</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login - Mobile Responsive */}
          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-neutral-400/80 font-extralight tracking-wide luxury-body text-sm sm:text-base">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-violet-400/90 hover:text-violet-300 font-light transition-colors duration-300 tracking-wide touch-target"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}