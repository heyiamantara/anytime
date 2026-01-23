'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Clock, Share2, CheckCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/components/ThemeProvider'
import Logo from '@/components/Logo'
import AvailabilityGrid from '@/components/event/AvailabilityGrid'
import ParticipantForm from '@/components/event/ParticipantForm'
import Notification from '@/components/Notification'
import UpgradeModal from '@/components/UpgradeModal'
import Header from '@/components/Header'

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentParticipant, setCurrentParticipant] = useState<any>(null)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
  })

  useEffect(() => {
    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setEvent(data.event)
      } else {
        setError(data.error || 'Event not found')
      }
    } catch (err) {
      setError('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const handleParticipantJoined = (participant: any) => {
    setCurrentParticipant(participant)
    setShowJoinForm(false)
    // Refresh event data to get updated participant list
    fetchEvent()
  }

  const handleShareEvent = () => {
    const shareUrl = window.location.href
    navigator.clipboard.writeText(shareUrl).then(() => {
      setNotification({
        isVisible: true,
        type: 'success',
        title: 'Link Copied!',
        message: 'Event link has been copied to your clipboard'
      })
    }).catch(() => {
      setNotification({
        isVisible: true,
        type: 'error',
        title: 'Copy Failed',
        message: 'Failed to copy link to clipboard'
      })
    })
  }

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }))
  }

  const handleSignOut = async () => {
    try {
      console.log('Event page sign out clicked')
      await signOut()
      console.log('Event page sign out successful, redirecting...')
      // Small delay to ensure signOut completes
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    } catch (error) {
      console.error('Event page sign out error:', error)
      // Still redirect even if there's an error
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    }
  }

  const isEventCreator = user && event && event.created_by === user.id

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    return `${start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })} - ${end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-6 luxury-glow" />
          <p className="text-neutral-600 dark:text-neutral-400/80 font-extralight tracking-widest text-sm luxury-caption">Loading experience...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500/15 to-orange-500/15 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Calendar className="w-10 h-10 text-red-500/70 dark:text-red-400/70" />
          </div>
          <h1 className="text-3xl font-extralight text-neutral-900 dark:text-white mb-4 tracking-wide luxury-heading">
            Event Not Found
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400/80 mb-8 font-extralight tracking-wide luxury-body">
            {error}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-light tracking-widest transition-all duration-500 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40"
          >
            <span className="uppercase text-sm">Go Home</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black">
      {/* Luxury Navigation - Invisible Integration */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/90 via-white/60 to-transparent dark:from-black/90 dark:via-black/60 dark:to-transparent backdrop-blur-xl border-b border-neutral-200/60 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Minimal Logo */}
            <Logo size="md" animated={true} />
            
            {/* Minimal Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="flex items-center space-x-6"
            >
              {/* Theme Switcher - Subtle Integration */}
              <button
                onClick={() => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark'
                  setTheme(newTheme)
                }}
                className="p-3 hover:bg-neutral-200/60 dark:hover:bg-white/10 rounded-2xl transition-all duration-500 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
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

              {/* Analytics Button - Subtle Integration */}
              {user && event && event.created_by === user.id && (
                <button
                  onClick={() => window.open(`/event/${event.id}/analytics`, '_blank')}
                  className="p-3 hover:bg-neutral-200/60 dark:hover:bg-white/10 rounded-2xl transition-all duration-500 text-neutral-700 dark:text-neutral-300 hover:text-violet-600 dark:hover:text-violet-400"
                  title="View analytics"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
              )}

              {/* Share Button */}
              <button
                onClick={handleShareEvent}
                className="p-3 hover:bg-neutral-200/60 dark:hover:bg-white/10 rounded-2xl transition-all duration-500 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                title="Share event"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Immersive Hero Section */}
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            {/* Exclusive Badge */}
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-violet-500/8 to-indigo-500/8 dark:from-violet-500/8 dark:to-indigo-500/8 border border-violet-500/15 dark:border-violet-500/15 text-violet-700 dark:text-violet-300/90 px-8 py-4 rounded-full text-sm font-light mb-12 backdrop-blur-sm">
              <div className="w-2 h-2 bg-violet-500 dark:bg-violet-400 rounded-full animate-pulse"></div>
              <span className="tracking-widest uppercase text-xs">Private Event</span>
            </div>
            
            {/* Luxury Event Title */}
            <div className="w-full overflow-hidden">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-neutral-900 dark:text-white mb-8 tracking-tighter leading-[0.85] luxury-heading break-words hyphens-none">
                {event.name}
              </h1>
            </div>
            
            {event.description && (
              <p className="text-2xl text-neutral-700 dark:text-neutral-300/80 max-w-3xl mx-auto mb-16 leading-relaxed font-extralight tracking-wide luxury-body">
                {event.description}
              </p>
            )}

            {/* Refined Metadata */}
            <div className="flex flex-wrap items-center justify-center gap-16 text-neutral-600 dark:text-neutral-400/70 mb-20">
              <div className="flex items-center space-x-4">
                <div className="w-1.5 h-1.5 bg-violet-600 dark:bg-violet-400/60 rounded-full"></div>
                <span className="text-sm tracking-widest font-extralight luxury-caption">
                  {formatDateRange(event.start_date, event.end_date)}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-1.5 h-1.5 bg-violet-600 dark:bg-violet-400/60 rounded-full"></div>
                <span className="text-sm tracking-widest font-extralight luxury-caption">
                  {event.participants?.length || 0} attending
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-1.5 h-1.5 bg-violet-600 dark:bg-violet-400/60 rounded-full"></div>
                <span className="text-sm tracking-widest font-extralight luxury-caption">
                  {event.time_blocks?.length || 0} time options
                </span>
              </div>
            </div>

            {/* Exclusive Primary Action */}
            <div className="flex flex-col items-center space-y-8">
              {!currentParticipant && event.status === 'open' ? (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowJoinForm(true)}
                  className="group relative bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-16 py-6 rounded-3xl font-light text-xl tracking-widest transition-all duration-700 shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/40 luxury-glow"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-indigo-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <span className="relative flex items-center space-x-4">
                    <Users className="w-6 h-6" />
                    <span className="uppercase text-sm">Join this event</span>
                  </span>
                </motion.button>
              ) : currentParticipant ? (
                <div className="flex items-center space-x-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-500/20 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300/90 px-12 py-6 rounded-3xl backdrop-blur-sm">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-light tracking-widest text-lg">Welcome, {currentParticipant.name}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-500/20 dark:border-amber-500/20 text-amber-700 dark:text-amber-300/90 px-12 py-6 rounded-3xl backdrop-blur-sm">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-light tracking-widest text-lg">Event concluded</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Immersive Content Area */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        
        {/* Atmospheric Availability Panel */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-br from-white/95 via-neutral-50/80 to-white/95 dark:from-neutral-900/40 dark:via-neutral-800/20 dark:to-neutral-900/40 backdrop-blur-2xl border border-neutral-300/60 dark:border-white/8 rounded-[2rem] p-12 shadow-xl shadow-neutral-200/50 dark:shadow-2xl mb-12 relative overflow-hidden"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/4 to-indigo-500/4 dark:from-violet-500/3 dark:to-indigo-500/3 rounded-[2rem]"></div>
          
          <div className="relative">
            <div className="mb-12">
              <h2 className="text-3xl font-extralight text-neutral-900 dark:text-white mb-4 tracking-wide luxury-heading">
                Select your availability
              </h2>
              <p className="text-neutral-700 dark:text-neutral-400/80 font-extralight tracking-wide text-lg luxury-body">
                {currentParticipant 
                  ? 'Choose the times that work best for you' 
                  : 'Join the event to mark your availability'
                }
              </p>
            </div>
            
            <AvailabilityGrid
              event={event}
              currentParticipant={currentParticipant}
              onAvailabilityUpdate={fetchEvent}
            />
          </div>
        </motion.div>

        {/* Refined Attendees Panel */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-br from-white/90 via-neutral-50/70 to-white/90 dark:from-neutral-900/30 dark:via-neutral-800/15 dark:to-neutral-900/30 backdrop-blur-2xl border border-neutral-300/50 dark:border-white/8 rounded-[2rem] p-12 shadow-xl shadow-neutral-200/40 dark:shadow-xl relative overflow-hidden"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/3 to-indigo-500/3 dark:from-violet-500/2 dark:to-indigo-500/2 rounded-[2rem]"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-extralight text-neutral-900 dark:text-white tracking-wide luxury-heading">
                Attendees
              </h3>
              <div className="bg-gradient-to-r from-violet-500/20 to-indigo-500/20 dark:from-violet-500/15 dark:to-indigo-500/15 text-violet-800 dark:text-violet-300/90 px-6 py-3 rounded-2xl text-sm font-light border border-violet-500/30 dark:border-violet-500/20 tracking-widest">
                {event.participants?.length || 0}
              </div>
            </div>
            
            {event.participants && event.participants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {event.participants.map((participant: any, index: number) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.0, delay: 0.8 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center space-x-5 p-6 rounded-3xl hover:bg-white/3 transition-all duration-700 group"
                  >
                    <div
                      className="w-14 h-14 rounded-3xl flex items-center justify-center text-white font-light shadow-2xl group-hover:scale-105 transition-transform duration-500 text-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${participant.color}cc, ${participant.color}88)`,
                        boxShadow: `0 12px 40px ${participant.color}30`
                      }}
                    >
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-light text-neutral-900 dark:text-white tracking-wide text-lg luxury-body">
                        {participant.name}
                      </p>
                      {currentParticipant?.id === participant.id && (
                        <p className="text-xs text-violet-600 dark:text-violet-400/80 font-extralight tracking-widest mt-2 uppercase luxury-caption">
                          That's you
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500/15 to-indigo-500/15 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Users className="w-10 h-10 text-violet-400/70" />
                </div>
                <p className="text-neutral-700 dark:text-neutral-300/80 font-extralight tracking-wide mb-3 text-xl luxury-body">
                  Awaiting responses
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-500/80 font-extralight tracking-widest luxury-caption">
                  Be the first to join this exclusive event
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Join Form Modal */}
      <ParticipantForm
        isOpen={showJoinForm}
        onClose={() => setShowJoinForm(false)}
        eventId={event.id}
        onSuccess={handleParticipantJoined}
        currentParticipantCount={event.participants?.length || 0}
        onUpgrade={() => setUpgradeModalOpen(true)}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        reason="participants"
        currentUsage={{
          participants: event.participants?.length || 0
        }}
      />

      {/* Notification */}
      <Notification
        isVisible={notification.isVisible}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  )
}