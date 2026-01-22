'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, Clock, Star, ArrowLeft, Share2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import Notification from '@/components/Notification'
import Header from '@/components/Header'

export default function EventAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [availabilityData, setAvailabilityData] = useState<any>({})
  const [bestMatches, setBestMatches] = useState<any[]>([])
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

  useEffect(() => {
    if (event?.availability && event?.participants) {
      processAvailabilityData()
    }
  }, [event])

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

  const processAvailabilityData = () => {
    const data: any = {}
    const totalParticipants = event.participants?.length || 0
    
    // Generate date range
    const startDate = new Date(event.start_date)
    const endDate = new Date(event.end_date)
    const dates = []
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }

    // Initialize data structure
    dates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0]
      data[dateStr] = {}
      
      event.time_blocks.forEach(timeBlock => {
        data[dateStr][timeBlock] = {
          count: 0,
          participants: []
        }
      })
    })

    // Process availability data
    event.availability?.forEach(avail => {
      if (avail.available && data[avail.date] && data[avail.date][avail.time_block]) {
        data[avail.date][avail.time_block].count++
        
        // Find participant name
        const participant = event.participants?.find(p => p.id === avail.participant_id)
        if (participant) {
          data[avail.date][avail.time_block].participants.push(participant)
        }
      }
    })

    // Find best matches (highest availability counts) - limit to top 3
    const matches: any[] = []
    Object.keys(data).forEach(date => {
      Object.keys(data[date]).forEach(timeBlock => {
        const slot = data[date][timeBlock]
        if (slot.count > 0) {
          matches.push({
            date,
            timeBlock,
            count: slot.count,
            participants: slot.participants,
            percentage: totalParticipants > 0 ? (slot.count / totalParticipants) * 100 : 0
          })
        }
      })
    })

    // Sort by count (descending) and take top 3 matches only
    const sortedMatches = matches.sort((a, b) => b.count - a.count).slice(0, 3)
    
    setAvailabilityData(data)
    setBestMatches(sortedMatches)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }
  }

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getIntensityColor = (count: number, maxCount: number) => {
    if (count === 0) return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
    
    const intensity = count / maxCount
    if (intensity >= 0.8) return 'bg-primary-600 text-white'
    if (intensity >= 0.6) return 'bg-primary-500 text-white'
    if (intensity >= 0.4) return 'bg-primary-400 text-white'
    if (intensity >= 0.2) return 'bg-primary-300 text-primary-900'
    return 'bg-primary-200 text-primary-800'
  }

  const handleShareEvent = () => {
    const shareUrl = `${window.location.origin}/event/${params.id}`
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !event) {
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
            onClick={() => router.push('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const dates = []
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d))
  }

  const maxCount = Math.max(
    ...Object.values(availabilityData).flatMap((dateData: any) =>
      Object.values(dateData).map((slot: any) => slot.count)
    ),
    1
  )

  const totalParticipants = event.participants?.length || 0

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <Header hideSignOut={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pt-20 sm:pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleShareEvent}
              className="btn-primary flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Event</span>
            </button>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {event.name}
            </h1>
            {event.description && (
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
                {event.description}
              </p>
            )}
            
            <div className="flex items-center justify-center space-x-6 text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="font-medium">{totalParticipants} participants</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{dates.length} days</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{event.time_blocks?.length || 0} time slots</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Availability Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="card p-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Availability Overview
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Interactive preview • hover over cells to explore availability details
            </p>

            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Header Row */}
                <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: `120px repeat(${dates.length}, 1fr)` }}>
                  <div></div> {/* Empty cell for time labels */}
                  {dates.map((date, index) => {
                    const formatted = formatDate(date.toISOString().split('T')[0])
                    return (
                      <div key={index} className="text-center">
                        <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          {formatted.day}
                        </div>
                        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {formatted.date}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Time Rows */}
                {event.time_blocks.map((timeBlock, timeIndex) => (
                  <div key={timeIndex} className="grid gap-2 mb-2" style={{ gridTemplateColumns: `120px repeat(${dates.length}, 1fr)` }}>
                    {/* Time Label */}
                    <div className="flex items-center justify-end pr-4">
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        {formatTime(timeBlock)}
                      </span>
                    </div>

                    {/* Availability Cells */}
                    {dates.map((date, dateIndex) => {
                      const dateStr = date.toISOString().split('T')[0]
                      const slot = availabilityData[dateStr]?.[timeBlock] || { count: 0, participants: [] }
                      const isHighlight = bestMatches.some(match => 
                        match.date === dateStr && match.timeBlock === timeBlock
                      )

                      return (
                        <div
                          key={dateIndex}
                          className={`
                            relative h-12 rounded-lg flex items-center justify-center text-sm font-medium
                            transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-md
                            ${getIntensityColor(slot.count, maxCount)}
                            ${isHighlight ? 'ring-2 ring-yellow-400' : ''}
                          `}
                          title={`${slot.count}/${totalParticipants} available${slot.participants.length > 0 ? '\n' + slot.participants.map((p: any) => p.name).join(', ') : ''}`}
                        >
                          {slot.count > 0 && (
                            <>
                              <span>{slot.count}/{totalParticipants}</span>
                              {isHighlight && (
                                <Star className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400 fill-current" />
                              )}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Best Matches Section */}
        {bestMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Star className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  Best Time Matches
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bestMatches.map((match, index) => {
                  const formatted = formatDate(match.date)
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                            {match.count}/{totalParticipants}
                          </div>
                          <div className="text-xs text-yellow-600 dark:text-yellow-400">
                            {Math.round(match.percentage)}% available
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {formatted.day}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatted.date} at {formatTime(match.timeBlock)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Available participants:
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          {match.participants.map((p: any) => p.name).join(', ')}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Participants Section */}
        {event.participants && event.participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="card p-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                Participants ({totalParticipants})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {event.participants.map((participant: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: participant.color || '#8b5cf6' }}
                    >
                      {participant.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {participant.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

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