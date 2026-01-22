'use client'

import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Plus, Calendar, Users, Clock, Crown, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import CreateEventModal from '@/components/dashboard/CreateEventModal'
import RefinedEventCard from '@/components/dashboard/RefinedEventCard'
import Notification from '@/components/Notification'
import ConfirmationModal from '@/components/ConfirmationModal'
import UpgradeModal from '@/components/UpgradeModal'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'
import { useUsageLimits } from '@/hooks/useUsageLimits'

export default function Dashboard() {
  const { user, loading } = useAuth()
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
      const response = await fetch('/api/events')
      const data = await response.json()
      
      if (response.ok) {
        setEvents(data.events)
        calculateStats(data.events)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
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
    const updatedEvents = [newEvent, ...events]
    setEvents(updatedEvents)
    calculateStats(updatedEvents)
    // Open analytics page for the newly created event
    window.open(`/event/${newEvent.id}/analytics`, '_blank')
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
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Show message if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Authentication Required
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Please sign in to access your dashboard.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pt-20 sm:pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-2">
                Welcome back!
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base">
                Manage your events and see what's coming up.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {canCreateEvent ? (
                <button 
                  onClick={handleCreateEvent}
                  className="btn-primary flex items-center space-x-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Create Event</span>
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setUpgradeReason('events')
                      setUpgradeModalOpen(true)
                    }}
                    className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base"
                  >
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Upgrade</span>
                  </button>
                  <div className="text-xs sm:text-sm text-neutral-400">
                    {eventsThisWeek}/{maxEvents} events this week
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 sm:p-5">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-500/10 border border-primary-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-neutral-100">
                  {stats.activeEvents}
                </p>
                <p className="text-xs sm:text-sm text-neutral-400">Active Events</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 sm:p-5">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-neutral-100">
                  {stats.totalParticipants}
                </p>
                <p className="text-xs sm:text-sm text-neutral-400">Total Participants</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 sm:p-5">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-neutral-100">
                  {stats.completedEvents}
                </p>
                <p className="text-xs sm:text-sm text-neutral-400">Completed Events</p>
              </div>
            </div>
          </div>

          {/* Usage Limit Card */}
          <div className={`bg-neutral-800/50 border rounded-xl p-3 sm:p-5 ${
            eventsThisWeek >= maxEvents * 0.8 
              ? 'border-yellow-500/50' 
              : 'border-neutral-700/50'
          }`}>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                eventsThisWeek >= maxEvents 
                  ? 'bg-red-500/10 border border-red-500/20' 
                  : eventsThisWeek >= maxEvents * 0.8
                    ? 'bg-yellow-500/10 border border-yellow-500/20'
                    : 'bg-green-500/10 border border-green-500/20'
              }`}>
                {eventsThisWeek >= maxEvents ? (
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                ) : eventsThisWeek >= maxEvents * 0.8 ? (
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                ) : (
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                )}
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-neutral-100">
                  {eventsThisWeek}/{maxEvents}
                </p>
                <p className="text-xs sm:text-sm text-neutral-400">Events This Week</p>
              </div>
            </div>
            {eventsThisWeek >= maxEvents * 0.8 && (
              <button
                onClick={() => {
                  setUpgradeReason('events')
                  setUpgradeModalOpen(true)
                }}
                className="mt-2 sm:mt-3 text-xs text-yellow-400 hover:text-yellow-300 transition-colors flex items-center space-x-1"
              >
                <Crown className="w-3 h-3" />
                <span>Upgrade for unlimited</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Events Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-4 sm:mb-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-100">
            Your Events
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {events.length} {events.length === 1 ? 'event' : 'events'} total
          </p>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {events.length === 0 ? (
            /* Empty State */
            <div className="bg-neutral-800/30 border border-neutral-700/50 rounded-xl p-8 sm:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-500" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-200 mb-2">
                No events yet
              </h3>
              <p className="text-sm sm:text-base text-neutral-400 mb-6 max-w-sm mx-auto">
                Create your first event to start coordinating schedules with your team
              </p>
              <div className="flex flex-col items-center space-y-4">
                {canCreateEvent ? (
                  <button 
                    onClick={handleCreateEvent}
                    className="btn-primary flex items-center space-x-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Create Event</span>
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        setUpgradeReason('events')
                        setUpgradeModalOpen(true)
                      }}
                      className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base"
                    >
                      <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Upgrade</span>
                    </button>
                    <p className="text-xs sm:text-sm text-neutral-500">
                      You've reached your limit of {maxEvents} events this week
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Events Grid - Responsive */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {events.map((event: any, index: number) => (
                <RefinedEventCard
                  key={event.id}
                  event={event}
                  onSelect={(event) => {
                    // Open analytics page in new tab
                    window.open(`/event/${event.id}/analytics`, '_blank')
                  }}
                  onDelete={handleDeleteEvent}
                  onShare={handleShareEvent}
                  onMarkCompleted={handleMarkCompleted}
                />
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
          participants: 0 // Will be set when needed
        }}
      />
    </div>
  )
}