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
        className="w-full max-w-lg mx-auto"
      >
        {/* Success State - Luxury Glass Container */}
        <div className="bg-gradient-to-br from-neutral-900/60 via-neutral-800/40 to-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 text-center relative overflow-hidden">
          {/* Atmospheric Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-[2rem]" />
          
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Mail className="w-10 h-10 text-emerald-400/80" />
            </div>
            <h2 className="text-4xl font-extralight text-white mb-6 tracking-tight luxury-heading">
              Check your email
            </h2>
            <p className="text-neutral-400/80 font-extralight text-lg tracking-wide mb-10 luxury-body">
              We've sent you a confirmation link at <span className="text-white font-light">{email}</span>
            </p>
            <button
              onClick={onSwitchToLogin}
              className="bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 hover:from-neutral-600/60 hover:to-neutral-500/60 text-white px-10 py-4 rounded-2xl font-light tracking-widest transition-all duration-500 border border-white/10 hover:border-white/20 uppercase"
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
      className="w-full max-w-lg mx-auto"
    >
      {/* Luxury Glass Container */}
      <div className="bg-gradient-to-br from-neutral-900/60 via-neutral-800/40 to-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 relative overflow-hidden">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 rounded-[2rem]" />
        
        <div className="relative">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extralight text-white mb-6 tracking-tight luxury-heading">
              Create your account
            </h2>
            <p className="text-neutral-400/80 font-extralight text-lg tracking-wide luxury-body">
              Start scheduling meetings with elegance
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-extralight text-neutral-300/90 mb-4 tracking-widest luxury-caption">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500/70" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-white/10 rounded-2xl text-white placeholder-neutral-500/70 focus:outline-none focus:border-violet-500/50 focus:bg-gradient-to-r focus:from-neutral-900/70 focus:to-neutral-800/70 transition-all duration-500 font-extralight tracking-wide"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-extralight text-neutral-300/90 mb-4 tracking-widest luxury-caption">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500/70" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-5 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-white/10 rounded-2xl text-white placeholder-neutral-500/70 focus:outline-none focus:border-violet-500/50 focus:bg-gradient-to-r focus:from-neutral-900/70 focus:to-neutral-800/70 transition-all duration-500 font-extralight tracking-wide"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-neutral-500/70 hover:text-neutral-300 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-neutral-500/70 mt-3 font-extralight tracking-widest luxury-caption">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-extralight text-neutral-300/90 mb-4 tracking-widest luxury-caption">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500/70" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-5 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 border border-white/10 rounded-2xl text-white placeholder-neutral-500/70 focus:outline-none focus:border-violet-500/50 focus:bg-gradient-to-r focus:from-neutral-900/70 focus:to-neutral-800/70 transition-all duration-500 font-extralight tracking-wide"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-neutral-500/70 hover:text-neutral-300 transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl"
              >
                <p className="text-red-300/90 font-extralight tracking-wide luxury-body">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white py-6 rounded-2xl font-light tracking-widest transition-all duration-700 shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed luxury-glow flex items-center justify-center space-x-4 text-lg"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="uppercase">Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-10 text-center">
            <p className="text-neutral-400/80 font-extralight tracking-wide luxury-body">
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