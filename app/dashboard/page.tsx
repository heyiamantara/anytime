'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/components/ThemeProvider'
import { motion } from 'framer-motion'
import { Plus, Calendar, Users, Clock, Crown, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import Logo from '@/components/Logo'
import CreateEventModal from '@/components/dashboard/CreateEventModal'
import RefinedEventCard from '@/components/dashboard/RefinedEventCard'
import Notification from '@/components/Notification'
import ConfirmationModal from '@/components/ConfirmationModal'
import UpgradeModal from '@/components/UpgradeModal'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'
import { useUsageLimits } from '@/hooks/useUsageLimits'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const { eventsThisWeek, maxEvents, canCreateEvent } = useUsageLimits()
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState<'events' | 'participants'>('events')
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
  })
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning' as 'warning' | 'danger' | 'info'
  })
  const [stats, setStats] = useState({
    activeEvents: 0,
    totalParticipants: 0,
    completedEvents: 0
  })
  const router = useRouter()

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
      return
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user])

  const fetchEvents = async () => {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 12000) // 12 second timeout

      const response = await fetch('/api/events', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache', // Ensure fresh data
        }
      })
      
      clearTimeout(timeoutId)
      const data = await response.json()
      
      if (response.ok) {
        setEvents(data.events)
        calculateStats(data.events)
      } else {
        throw new Error(data.error || 'Failed to fetch events')
      }
    } catch (error: any) {
      console.error('Failed to fetch events:', error)
      
      // Show user-friendly error message
      if (error.name === 'AbortError') {
        setNotification({
          isVisible: true,
          type: 'error',
          title: 'Loading Timeout',
          message: 'Events are taking longer to load. Please check your connection and refresh.'
        })
      } else {
        setNotification({
          isVisible: true,
          type: 'error',
          title: 'Loading Error',
          message: 'Failed to load events. Please refresh the page.'
        })
      }
    } finally {
      setEventsLoading(false)
    }
  }

  const calculateStats = (eventsList: any[]) => {
    const activeEvents = eventsList.filter(e => e.status === 'open').length
    const completedEvents = eventsList.filter(e => e.status === 'locked').length
    
    // Calculate total participants across all events
    const totalParticipants = eventsList.reduce((sum, event) => {
      return sum + (event.participants?.length || 0)
    }, 0)

    setStats({
      activeEvents,
      totalParticipants,
      completedEvents
    })
  }

  const handleEventCreated = (newEvent: any) => {
    // Optimistic update - immediately add the event to the list
    const updatedEvents = [newEvent, ...events]
    setEvents(updatedEvents)
    calculateStats(updatedEvents)
    
    // Show success notification
    setNotification({
      isVisible: true,
      type: 'success',
      title: 'Event Created!',
      message: 'Your event has been created successfully'
    })
    
    // Open analytics page for the newly created event after a short delay
    setTimeout(() => {
      window.open(`/event/${newEvent.id}/analytics`, '_blank')
    }, 500)
  }

  const handleCreateEvent = () => {
    if (!canCreateEvent) {
      setUpgradeReason('events')
      setUpgradeModalOpen(true)
      return
    }
    setCreateModalOpen(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    console.log('Delete event clicked:', eventId)
    setConfirmModal({
      isOpen: true,
      title: 'Delete Event',
      message: 'Are you sure you want to delete this event? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/events/${eventId}`, {
            method: 'DELETE'
          })

          if (response.ok) {
            const updatedEvents = events.filter((e: any) => e.id !== eventId)
            setEvents(updatedEvents)
            calculateStats(updatedEvents)
            
            // If the deleted event was selected, no need to handle selection
            
            setNotification({
              isVisible: true,
              type: 'success',
              title: 'Event Deleted',
              message: 'Event has been successfully deleted'
            })
          } else {
            throw new Error('Failed to delete event')
          }
        } catch (error) {
          console.error('Failed to delete event:', error)
          setNotification({
            isVisible: true,
            type: 'error',
            title: 'Delete Failed',
            message: 'Failed to delete event. Please try again.'
          })
        }
      }
    })
  }

  const handleShareEvent = (eventId: string) => {
    console.log('Share event clicked:', eventId)
    const shareUrl = `${window.location.origin}/event/${eventId}`
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

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }))
  }

  const handleMarkCompleted = async (eventId: string) => {
    console.log('Mark completed clicked:', eventId)
    setConfirmModal({
      isOpen: true,
      title: 'Mark Event as Completed',
      message: 'Are you sure you want to mark this event as completed? This will lock the event and prevent further changes.',
      type: 'warning',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/events/${eventId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'locked'
            }),
          })

          if (response.ok) {
            const updatedEvents = events.map((e: any) => 
              e.id === eventId ? { ...e, status: 'locked' } : e
            )
            setEvents(updatedEvents)
            calculateStats(updatedEvents)
            
            setNotification({
              isVisible: true,
              type: 'success',
              title: 'Event Completed!',
              message: 'Event has been marked as completed'
            })
          } else {
            throw new Error('Failed to mark event as completed')
          }
        } catch (error) {
          console.error('Failed to mark event as completed:', error)
          setNotification({
            isVisible: true,
            type: 'error',
            title: 'Update Failed',
            message: 'Failed to mark event as completed'
          })
        }
      }
    })
  }

  if (loading || eventsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-6 luxury-glow" />
          <p className="text-neutral-600 dark:text-neutral-400/80 font-extralight tracking-widest text-sm luxury-caption">Loading experience...</p>
        </div>
      </div>
    )
  }

  // Show message if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500/15 to-orange-500/15 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-red-500/70 dark:text-red-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extralight text-neutral-900 dark:text-white mb-4 tracking-wide luxury-heading">
            Authentication Required
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400/80 mb-8 font-extralight tracking-wide luxury-body">
            Please sign in to access your dashboard.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-light tracking-widest transition-all duration-500 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 uppercase text-sm"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black">
      {/* Mobile-Responsive Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/90 via-white/60 to-transparent dark:from-black/90 dark:via-black/60 dark:to-transparent backdrop-blur-xl border-b border-neutral-200/60 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            {/* Logo - Always on the left */}
            <div className="flex-shrink-0">
              <Logo size="sm" animated={true} className="sm:hidden" />
              <Logo size="md" animated={true} className="hidden sm:block" />
            </div>
            
            {/* Right side buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="flex items-center space-x-2 sm:space-x-6"
            >
              {/* Theme Switcher - Mobile Responsive */}
              <button
                onClick={() => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark'
                  setTheme(newTheme)
                }}
                className="p-2 sm:p-3 hover:bg-neutral-200/60 dark:hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all duration-500 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
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

              {/* Sign Out - Mobile Responsive */}
              <button
                onClick={async () => {
                  try {
                    console.log('Sign out clicked')
                    await signOut()
                    console.log('Sign out successful, redirecting...')
                    // Small delay to ensure signOut completes
                    setTimeout(() => {
                      window.location.href = '/'
                    }, 100)
                  } catch (error) {
                    console.error('Sign out error:', error)
                    // Still redirect even if there's an error
                    setTimeout(() => {
                      window.location.href = '/'
                    }, 100)
                  }
                }}
                className="p-2 sm:p-3 hover:bg-neutral-200/60 dark:hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all duration-500 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                title="Sign out"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>

              {/* Create Event Button - Mobile Responsive */}
              {canCreateEvent ? (
                <button 
                  onClick={handleCreateEvent}
                  className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 sm:px-8 sm:py-4 rounded-2xl sm:rounded-3xl font-light text-xs sm:text-sm tracking-widest transition-all duration-700 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 luxury-glow uppercase"
                >
                  <span className="hidden sm:inline">Create Event</span>
                  <span className="sm:hidden">Create</span>
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setUpgradeReason('events')
                    setUpgradeModalOpen(true)
                  }}
                  className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 sm:px-8 sm:py-4 rounded-2xl sm:rounded-3xl font-light text-xs sm:text-sm tracking-widest transition-all duration-700 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 luxury-glow uppercase"
                >
                  <span className="hidden sm:inline">Upgrade</span>
                  <span className="sm:hidden">Pro</span>
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Mobile-Responsive Hero Section */}
      <div className="pt-20 sm:pt-32 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12 sm:mb-20"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-neutral-900 dark:text-white mb-6 sm:mb-8 tracking-tighter leading-[0.85] luxury-heading">
              Your Events
            </h1>
            
            <p className="text-lg sm:text-2xl text-neutral-600 dark:text-neutral-300/80 max-w-3xl mx-auto mb-8 sm:mb-16 leading-relaxed font-extralight tracking-wide luxury-body px-4">
              Manage your schedule coordination with elegance
            </p>

            {/* Mobile-Responsive Metadata */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-16 text-neutral-500 dark:text-neutral-400/70 mb-12 sm:mb-20 px-4">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="w-1.5 h-1.5 bg-violet-500/80 dark:bg-violet-400/60 rounded-full"></div>
                <span className="text-xs sm:text-sm tracking-widest font-extralight luxury-caption">
                  {stats.activeEvents} Active
                </span>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="w-1.5 h-1.5 bg-violet-500/80 dark:bg-violet-400/60 rounded-full"></div>
                <span className="text-xs sm:text-sm tracking-widest font-extralight luxury-caption">
                  {stats.totalParticipants} Participants
                </span>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="w-1.5 h-1.5 bg-violet-500/80 dark:bg-violet-400/60 rounded-full"></div>
                <span className="text-xs sm:text-sm tracking-widest font-extralight luxury-caption">
                  {stats.completedEvents} Completed
                </span>
              </div>

              {!canCreateEvent && (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="w-1.5 h-1.5 bg-yellow-500/80 dark:bg-yellow-400/60 rounded-full"></div>
                  <span className="text-xs sm:text-sm tracking-widest font-extralight luxury-caption text-yellow-600 dark:text-yellow-300/80">
                    {eventsThisWeek}/{maxEvents} This Week
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile-Responsive Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {events.length === 0 ? (
            /* Mobile-Responsive Empty State */
            <div className="text-center py-16 sm:py-24 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-violet-500/15 to-indigo-500/15 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-8 sm:mb-12">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-violet-400/70" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extralight text-neutral-900 dark:text-white mb-4 sm:mb-6 tracking-wide luxury-heading">
                No events yet
              </h3>
              <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400/80 max-w-md mx-auto mb-8 sm:mb-12 font-extralight tracking-wide luxury-body">
                Create your first event to start coordinating schedules with elegance
              </p>
              
              {canCreateEvent ? (
                <button 
                  onClick={handleCreateEvent}
                  className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 sm:px-12 sm:py-6 rounded-2xl sm:rounded-3xl font-light text-base sm:text-lg tracking-widest transition-all duration-700 shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/40 luxury-glow uppercase"
                >
                  Create Event
                </button>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <button 
                    onClick={() => {
                      setUpgradeReason('events')
                      setUpgradeModalOpen(true)
                    }}
                    className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 sm:px-12 sm:py-6 rounded-2xl sm:rounded-3xl font-light text-base sm:text-lg tracking-widest transition-all duration-700 shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/40 luxury-glow uppercase"
                  >
                    Upgrade
                  </button>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-500/80 font-extralight tracking-widest luxury-caption">
                    You've reached your limit of {maxEvents} events this week
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Mobile-Responsive Events Layout */
            <div className="space-y-4 sm:space-y-6">
              {events.map((event: any, index: number) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0, delay: 0.6 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => window.open(`/event/${event.id}/analytics`, '_blank')}
                  className="group relative bg-gradient-to-br from-white/98 via-neutral-50/95 to-white/98 dark:from-neutral-900/60 dark:via-neutral-800/40 dark:to-neutral-900/60 backdrop-blur-3xl border border-neutral-300/70 dark:border-white/12 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 hover:bg-gradient-to-br hover:from-white hover:via-neutral-50 hover:to-white dark:hover:from-neutral-900/80 dark:hover:via-neutral-800/60 dark:hover:to-neutral-900/80 transition-all duration-700 cursor-pointer hover:border-neutral-400/90 dark:hover:border-white/20 overflow-hidden shadow-2xl shadow-neutral-300/30 dark:shadow-black/20 hover:shadow-3xl hover:shadow-neutral-400/40 dark:hover:shadow-black/40 hover:-translate-y-1"
                >
                  {/* Enhanced Background Patterns */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/4 to-indigo-500/4 dark:from-violet-500/3 dark:to-indigo-500/3 rounded-2xl sm:rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Subtle Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/10 dark:from-violet-500/8 dark:to-indigo-500/8 rounded-2xl sm:rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
                  
                  <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 lg:pr-8">
                      {/* Mobile-Responsive Header Section */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
                        <div className="flex-1 mb-4 sm:mb-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2 sm:mb-3">
                            <h3 className="text-2xl sm:text-3xl font-extralight text-neutral-900 dark:text-white tracking-wide luxury-heading group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-500 mb-2 sm:mb-0">
                              {event.name}
                            </h3>
                            <div className={`inline-flex px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-light tracking-widest luxury-caption border backdrop-blur-sm ${
                              event.status === 'open' 
                                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/15 dark:to-teal-500/15 text-emerald-700 dark:text-emerald-300/90 border-emerald-500/30 dark:border-emerald-500/25'
                                : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 dark:from-amber-500/15 dark:to-orange-500/15 text-amber-700 dark:text-amber-300/90 border-amber-500/30 dark:border-amber-500/25'
                            }`}>
                              {event.status === 'open' ? 'ACTIVE' : 'COMPLETED'}
                            </div>
                          </div>
                          
                          {/* Event Type Badge */}
                          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 dark:from-violet-500/8 dark:to-indigo-500/8 border border-violet-500/20 dark:border-violet-500/15 text-violet-700 dark:text-violet-300/90 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs font-light tracking-widest luxury-caption mb-3 sm:mb-4">
                            <div className="w-2 h-2 bg-violet-500 dark:bg-violet-400 rounded-full animate-pulse"></div>
                            <span>COORDINATION EVENT</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Description */}
                      {event.description && (
                        <div className="mb-6 sm:mb-8">
                          <p className="text-neutral-700 dark:text-neutral-400/90 font-extralight tracking-wide text-base sm:text-lg leading-relaxed luxury-body">
                            {event.description}
                          </p>
                        </div>
                      )}
                      
                      {/* Mobile-Responsive Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-br from-neutral-100/60 to-neutral-200/60 dark:from-neutral-800/30 dark:to-neutral-900/30 rounded-xl sm:rounded-2xl border border-neutral-300/40 dark:border-white/8 backdrop-blur-sm">
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full shadow-lg shadow-violet-500/30"></div>
                          <div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-500/80 font-extralight tracking-widest luxury-caption mb-1">
                              DURATION
                            </div>
                            <div className="text-xs sm:text-sm font-light text-neutral-900 dark:text-white tracking-wide">
                              {new Date(event.start_date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })} - {new Date(event.end_date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-br from-neutral-100/60 to-neutral-200/60 dark:from-neutral-800/30 dark:to-neutral-900/30 rounded-xl sm:rounded-2xl border border-neutral-300/40 dark:border-white/8 backdrop-blur-sm">
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/30"></div>
                          <div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-500/80 font-extralight tracking-widest luxury-caption mb-1">
                              PARTICIPANTS
                            </div>
                            <div className="text-xs sm:text-sm font-light text-neutral-900 dark:text-white tracking-wide">
                              {event.participants?.length || 0} people
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-br from-neutral-100/60 to-neutral-200/60 dark:from-neutral-800/30 dark:to-neutral-900/30 rounded-xl sm:rounded-2xl border border-neutral-300/40 dark:border-white/8 backdrop-blur-sm">
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/30"></div>
                          <div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-500/80 font-extralight tracking-widest luxury-caption mb-1">
                              TIME SLOTS
                            </div>
                            <div className="text-xs sm:text-sm font-light text-neutral-900 dark:text-white tracking-wide">
                              {event.time_blocks?.length || 0} options
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile-Responsive Action Buttons */}
                    <div className="flex flex-row lg:flex-col items-center justify-center lg:justify-start space-x-2 lg:space-x-0 lg:space-y-3 pt-4 lg:pt-0">
                      {/* Analytics Button - Enhanced */}
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`/event/${event.id}/analytics`, '_blank')
                        }}
                        className="p-3 sm:p-4 bg-gradient-to-br from-violet-500/15 to-indigo-500/15 dark:from-violet-500/10 dark:to-indigo-500/10 hover:from-violet-500/25 hover:to-indigo-500/25 dark:hover:from-violet-500/20 dark:hover:to-indigo-500/20 border border-violet-500/30 dark:border-violet-500/20 hover:border-violet-500/50 dark:hover:border-violet-500/40 rounded-xl sm:rounded-2xl transition-all duration-500 text-violet-700 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 backdrop-blur-sm shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20"
                        title="View analytics"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </motion.button>

                      {/* Share Button - Enhanced */}
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShareEvent(event.id)
                        }}
                        className="p-3 sm:p-4 bg-gradient-to-br from-neutral-200/60 to-neutral-300/60 dark:from-neutral-700/40 dark:to-neutral-800/40 hover:from-neutral-300/80 hover:to-neutral-400/80 dark:hover:from-neutral-600/60 dark:hover:to-neutral-700/60 border border-neutral-300/50 dark:border-neutral-600/30 hover:border-neutral-400/70 dark:hover:border-neutral-500/50 rounded-xl sm:rounded-2xl transition-all duration-500 text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 backdrop-blur-sm shadow-lg shadow-neutral-300/20 dark:shadow-black/20 hover:shadow-neutral-400/30 dark:hover:shadow-black/40"
                        title="Share event"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </motion.button>
                      
                      {/* Mark Complete Button - Enhanced */}
                      {event.status === 'open' && (
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkCompleted(event.id)
                          }}
                          className="p-3 sm:p-4 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 dark:from-emerald-500/10 dark:to-teal-500/10 hover:from-emerald-500/25 hover:to-teal-500/25 dark:hover:from-emerald-500/20 dark:hover:to-teal-500/20 border border-emerald-500/30 dark:border-emerald-500/20 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 rounded-xl sm:rounded-2xl transition-all duration-500 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 backdrop-blur-sm shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
                          title="Mark as completed"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.button>
                      )}
                      
                      {/* Delete Button - Enhanced */}
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteEvent(event.id)
                        }}
                        className="p-3 sm:p-4 bg-gradient-to-br from-red-500/15 to-rose-500/15 dark:from-red-500/10 dark:to-rose-500/10 hover:from-red-500/25 hover:to-rose-500/25 dark:hover:from-red-500/20 dark:hover:to-rose-500/20 border border-red-500/30 dark:border-red-500/20 hover:border-red-500/50 dark:hover:border-red-500/40 rounded-xl sm:rounded-2xl transition-all duration-500 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 backdrop-blur-sm shadow-lg shadow-red-500/10 hover:shadow-red-500/20"
                        title="Delete event"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleEventCreated}
      />

      {/* Notification */}
      <Notification
        isVisible={notification.isVisible}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.type === 'danger' ? 'Delete' : 'Confirm'}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        reason={upgradeReason}
        currentUsage={{
          events: eventsThisWeek,
          participants: 0
        }}
      />
    </div>
  )
}