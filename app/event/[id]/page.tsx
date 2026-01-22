'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Clock, Share2, CheckCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AvailabilityGrid from '@/components/event/AvailabilityGrid'
import ParticipantForm from '@/components/event/ParticipantForm'
import Notification from '@/components/Notification'
import UpgradeModal from '@/components/UpgradeModal'
import Header from '@/components/Header'

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
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
    await signOut()
    router.push('/')
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
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Event Not Found
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <Header hideSignOut={true} />
      <div className="pt-16 sm:pt-20 pb-6 sm:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                {event.name}
              </h1>
              {event.description && (
                <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg">
                  {event.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShareEvent}
                className="btn-secondary flex items-center space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Event Info */}
          <div className="flex flex-wrap items-center gap-6 text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDateRange(event.start_date, event.end_date)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{event.participants?.length || 0} participants</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{event.time_blocks?.length || 0} time slots</span>
            </div>

            {event.status === 'locked' && (
              <div className="flex items-center space-x-2 text-orange-600">
                <CheckCircle className="w-5 h-5" />
                <span>Event Locked</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Join Event Section */}
        {!currentParticipant && event.status === 'open' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Join this event
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Add your name to mark your availability
                  </p>
                </div>
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="btn-primary"
                >
                  Join Event
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Availability Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AvailabilityGrid
            event={event}
            currentParticipant={currentParticipant}
            onAvailabilityUpdate={fetchEvent}
          />
        </motion.div>

        {/* Participants List */}
        {event.participants && event.participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Participants ({event.participants.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {event.participants.map((participant: any) => (
                  <div
                    key={participant.id}
                    className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: participant.color }}
                    >
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {participant.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
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