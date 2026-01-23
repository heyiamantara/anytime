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
        className="w-full"
      >
        {/* Success State - Compact */}
        <div className="bg-gradient-to-br from-neutral-900/60 via-neutral-800/40 to-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-xl p-6 text-center relative overflow-hidden">
          {/* Atmospheric Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-xl" />
          
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-emerald-400/80" />
            </div>
            <h2 className="text-xl font-extralight text-white mb-3 tracking-tight luxury-heading">
              Check your email
            </h2>
            <p className="text-neutral-400/80 font-extralight text-sm tracking-wide mb-6 luxury-body">
              We've sent you a confirmation link at <span className="text-white font-light break-all">{email}</span>
            </p>
            <button
              onClick={onSwitchToLogin}
              className="bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 hover:from-neutral-600/60 hover:to-neutral-500/60 text-white px-6 py-2 rounded-lg font-light tracking-widest transition-all duration-500 border border-white/10 hover:border-white/20 uppercase text-sm"
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
      className="w-full"
    >
      {/* Compact Dialog Container */}
      <div className="bg-gradient-to-br from-neutral-900/60 via-neutral-800/40 to-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-xl p-6 relative overflow-hidden">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 rounded-xl" />
        
        <div className="relative">
          {/* Compact Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-extralight text-white mb-2 tracking-tight luxury-heading">
              Create your account
            </h2>
            <p className="text-neutral-400/80 font-extralight text-sm tracking-wide luxury-body">
              Start scheduling meetings with elegance
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-extralight text-neutral-300/90 mb-2 tracking-widest luxury-caption">
                EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500/70" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-white/10 rounded-lg text-white placeholder-neutral-500/70 focus:outline-none focus:border-violet-500/50 focus:bg-gradient-to-r focus:from-neutral-900/70 focus:to-neutral-800/70 transition-all duration-500 font-extralight tracking-wide text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-extralight text-neutral-300/90 mb-2 tracking-widest luxury-caption">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500/70" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-white/10 rounded-lg text-white placeholder-neutral-500/70 focus:outline-none focus:border-violet-500/50 focus:bg-gradient-to-r focus:from-neutral-900/70 focus:to-neutral-800/70 transition-all duration-500 font-extralight tracking-wide text-sm"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500/70 hover:text-neutral-300 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-neutral-500/70 mt-1 font-extralight tracking-widest luxury-caption">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-extralight text-neutral-300/90 mb-2 tracking-widest luxury-caption">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500/70" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-white/10 rounded-lg text-white placeholder-neutral-500/70 focus:outline-none focus:border-violet-500/50 focus:bg-gradient-to-r focus:from-neutral-900/70 focus:to-neutral-800/70 transition-all duration-500 font-extralight tracking-wide text-sm"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500/70 hover:text-neutral-300 transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg"
              >
                <p className="text-red-300/90 font-extralight tracking-wide luxury-body text-sm">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white py-3 rounded-lg font-light tracking-widest transition-all duration-700 shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed luxury-glow flex items-center justify-center space-x-2 text-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="uppercase">Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-4 text-center">
            <p className="text-neutral-400/80 font-extralight tracking-wide luxury-body text-sm">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-violet-400/90 hover:text-violet-300 font-light transition-colors duration-300 tracking-wide"
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