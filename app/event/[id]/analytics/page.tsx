'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, Clock, Star, ArrowLeft, Share2, TrendingUp, BarChart3, Activity } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import Notification from '@/components/Notification'
import Header from '@/components/Header'

export default function EventAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
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
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-6 luxury-glow" />
          <p className="text-neutral-600 dark:text-neutral-400/80 font-extralight tracking-widest text-sm luxury-caption">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
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
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-light tracking-widest transition-all duration-500 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 uppercase text-sm"
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
  const responseRate = totalParticipants > 0 ? (event.availability?.filter((a: any) => a.available).length || 0) / (totalParticipants * event.time_blocks?.length * dates.length) * 100 : 0
  const respondedParticipants = new Set(event.availability?.map((a: any) => a.participant_id) || []).size
  const participationRate = totalParticipants > 0 ? (respondedParticipants / totalParticipants) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black">
      {/* Invisible Navigation Integration */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/90 via-white/60 to-transparent dark:from-black/90 dark:via-black/60 dark:to-transparent backdrop-blur-xl border-b border-neutral-200/60 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="text-xl font-extralight text-neutral-900 dark:text-white tracking-wider"
            >
              Anytime
            </motion.div>
            
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

              {/* Back Button */}
              <button
                onClick={() => router.push('/dashboard')}
                className="p-3 hover:bg-neutral-200/60 dark:hover:bg-white/10 rounded-2xl transition-all duration-500 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                title="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

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
            className="text-center mb-20"
          >
            <div className="w-full overflow-hidden">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight text-neutral-900 dark:text-white mb-8 tracking-tighter leading-[0.85] luxury-heading break-words hyphens-none">
                {event.name}
              </h1>
            </div>
            
            {event.description && (
              <p className="text-2xl text-neutral-600 dark:text-neutral-300/80 max-w-3xl mx-auto mb-16 leading-relaxed font-extralight tracking-wide luxury-body">
                {event.description}
              </p>
            )}

            {/* Refined Metadata */}
            <div className="flex flex-wrap items-center justify-center gap-16 text-neutral-500 dark:text-neutral-400/70 mb-20">
              <div className="flex items-center space-x-4">
                <div className="w-1.5 h-1.5 bg-violet-500/80 dark:bg-violet-400/60 rounded-full"></div>
                <span className="text-sm tracking-widest font-extralight luxury-caption">
                  {totalParticipants} Participants
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-1.5 h-1.5 bg-violet-500/80 dark:bg-violet-400/60 rounded-full"></div>
                <span className="text-sm tracking-widest font-extralight luxury-caption">
                  {dates.length} Days
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-1.5 h-1.5 bg-violet-500/80 dark:bg-violet-400/60 rounded-full"></div>
                <span className="text-sm tracking-widest font-extralight luxury-caption">
                  {event.time_blocks?.length || 0} Time Slots
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-1.5 h-1.5 bg-violet-500/80 dark:bg-violet-400/60 rounded-full"></div>
                <span className="text-sm tracking-widest font-extralight luxury-caption">
                  {Math.round(participationRate)}% Participation
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full-Bleed Analytics Content */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        
        {/* Key Metrics - Atmospheric Panel */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-br from-white/95 via-neutral-50/80 to-white/95 dark:from-neutral-900/40 dark:via-neutral-800/20 dark:to-neutral-900/40 backdrop-blur-2xl border border-neutral-300/60 dark:border-white/8 rounded-[2rem] p-12 shadow-xl shadow-neutral-200/50 dark:shadow-2xl mb-12 relative overflow-hidden"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/4 to-indigo-500/4 dark:from-violet-500/3 dark:to-indigo-500/3 rounded-[2rem]"></div>
          
          <div className="relative">
            <h2 className="text-3xl font-extralight text-neutral-900 dark:text-white mb-12 tracking-wide luxury-heading text-center">
              Key Insights
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Total Participants */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/15 dark:to-cyan-500/15 border border-blue-500/30 dark:border-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400/90" />
                </div>
                <div className="text-4xl font-extralight text-neutral-900 dark:text-white mb-2 tracking-wide">
                  {totalParticipants}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400/80 font-extralight tracking-widest luxury-caption">
                  TOTAL PARTICIPANTS
                </div>
              </div>

              {/* Participation Rate */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/15 dark:to-teal-500/15 border border-emerald-500/30 dark:border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400/90" />
                </div>
                <div className="text-4xl font-extralight text-neutral-900 dark:text-white mb-2 tracking-wide">
                  {Math.round(participationRate)}%
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400/80 font-extralight tracking-widest luxury-caption">
                  PARTICIPATION RATE
                </div>
                <div className="w-full bg-neutral-300/50 dark:bg-neutral-800/50 rounded-full h-1 mt-3">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${participationRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Active Responses */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 dark:from-violet-500/15 dark:to-indigo-500/15 border border-violet-500/30 dark:border-violet-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-8 h-8 text-violet-600 dark:text-violet-400/90" />
                </div>
                <div className="text-4xl font-extralight text-neutral-900 dark:text-white mb-2 tracking-wide">
                  {respondedParticipants}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400/80 font-extralight tracking-widest luxury-caption">
                  ACTIVE RESPONSES
                </div>
              </div>

              {/* Best Match Score */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 dark:from-yellow-500/15 dark:to-orange-500/15 border border-yellow-500/30 dark:border-yellow-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-yellow-600 dark:text-yellow-400/90" />
                </div>
                <div className="text-4xl font-extralight text-neutral-900 dark:text-white mb-2 tracking-wide">
                  {bestMatches.length > 0 ? Math.round(bestMatches[0].percentage) : 0}%
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400/80 font-extralight tracking-widest luxury-caption">
                  BEST MATCH SCORE
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Availability Heatmap - Atmospheric Panel */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-br from-white/90 via-neutral-50/70 to-white/90 dark:from-neutral-900/30 dark:via-neutral-800/15 dark:to-neutral-900/30 backdrop-blur-2xl border border-neutral-300/50 dark:border-white/8 rounded-[2rem] p-12 shadow-xl shadow-neutral-200/40 dark:shadow-xl mb-12 relative overflow-hidden"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/3 to-indigo-500/3 dark:from-violet-500/2 dark:to-indigo-500/2 rounded-[2rem]"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-extralight text-neutral-900 dark:text-white mb-4 tracking-wide luxury-heading">
                  Availability Heatmap
                </h2>
                <p className="text-neutral-700 dark:text-neutral-400/80 font-extralight tracking-wide text-lg luxury-body">
                  Interactive overview of participant availability
                </p>
              </div>
              
              <div className="flex items-center space-x-8 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-neutral-300/60 dark:bg-neutral-800/50 border border-neutral-400/40 dark:border-neutral-700/30 rounded-lg"></div>
                  <span className="text-neutral-600 dark:text-neutral-500/80 font-extralight tracking-widest luxury-caption">No responses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gradient-to-br from-violet-500/40 to-indigo-500/40 dark:from-violet-500/30 dark:to-indigo-500/30 border border-violet-500/50 dark:border-violet-500/40 rounded-lg"></div>
                  <span className="text-neutral-600 dark:text-neutral-500/80 font-extralight tracking-widest luxury-caption">Available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400/80 fill-current" />
                  <span className="text-neutral-600 dark:text-neutral-500/80 font-extralight tracking-widest luxury-caption">Best match</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Header Row */}
                <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: `140px repeat(${dates.length}, 1fr)` }}>
                  <div></div>
                  {dates.map((date, index) => {
                    const formatted = formatDate(date.toISOString().split('T')[0])
                    return (
                      <div key={index} className="text-center">
                        <div className="text-xs font-extralight text-neutral-600 dark:text-neutral-400/80 mb-1 tracking-widest luxury-caption">
                          {formatted.day}
                        </div>
                        <div className="text-sm font-light text-neutral-900 dark:text-white tracking-wide">
                          {formatted.date}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Time Rows */}
                {event.time_blocks.map((timeBlock, timeIndex) => (
                  <div key={timeIndex} className="grid gap-3 mb-3" style={{ gridTemplateColumns: `140px repeat(${dates.length}, 1fr)` }}>
                    {/* Time Label */}
                    <div className="flex items-center justify-end pr-6">
                      <span className="text-sm font-extralight text-neutral-700 dark:text-neutral-300/90 tracking-widest luxury-caption">
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
                            relative h-14 rounded-3xl flex items-center justify-center text-sm font-extralight
                            transition-all duration-700 cursor-pointer hover:scale-105 hover:shadow-xl
                            ${slot.count === 0 
                              ? 'bg-neutral-300/60 dark:bg-neutral-800/20 border border-neutral-400/40 dark:border-neutral-700/20 hover:bg-neutral-400/70 dark:hover:bg-neutral-700/30' 
                              : slot.count === 1
                                ? 'bg-gradient-to-br from-violet-500/20 to-indigo-500/20 dark:from-violet-500/15 dark:to-indigo-500/15 border border-violet-500/35 dark:border-violet-500/25 shadow-lg shadow-violet-500/15 dark:shadow-violet-500/10'
                                : slot.count === 2
                                  ? 'bg-gradient-to-br from-violet-500/30 to-indigo-500/30 dark:from-violet-500/25 dark:to-indigo-500/25 border border-violet-400/45 dark:border-violet-400/35 shadow-lg shadow-violet-500/20 dark:shadow-violet-500/15'
                                  : 'bg-gradient-to-br from-violet-500/40 to-indigo-500/40 dark:from-violet-500/35 dark:to-indigo-500/35 border border-violet-400/55 dark:border-violet-400/45 shadow-xl shadow-violet-500/25 dark:shadow-violet-500/20'
                            }
                            ${isHighlight ? 'ring-2 ring-yellow-500/70 dark:ring-yellow-400/60 shadow-2xl shadow-yellow-500/30 dark:shadow-yellow-500/20' : ''}
                          `}
                          title={`${slot.count}/${totalParticipants} available${slot.participants.length > 0 ? '\n' + slot.participants.map((p: any) => p.name).join(', ') : ''}`}
                        >
                          {slot.count > 0 && (
                            <>
                              <span className="text-violet-700 dark:text-violet-200/90 tracking-widest">{slot.count}/{totalParticipants}</span>
                              {isHighlight && (
                                <Star className="w-3 h-3 absolute -top-1 -right-1 text-yellow-600 dark:text-yellow-400 fill-current" />
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

        {/* Best Matches - Atmospheric Panel */}
        {bestMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gradient-to-br from-white/90 via-neutral-50/70 to-white/90 dark:from-neutral-900/30 dark:via-neutral-800/15 dark:to-neutral-900/30 backdrop-blur-2xl border border-neutral-300/50 dark:border-white/8 rounded-[2rem] p-12 shadow-xl shadow-neutral-200/40 dark:shadow-xl mb-12 relative overflow-hidden"
          >
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/3 to-orange-500/3 dark:from-yellow-500/2 dark:to-orange-500/2 rounded-[2rem]"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-4 mb-12">
                <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400/90" />
                <h2 className="text-3xl font-extralight text-neutral-900 dark:text-white tracking-wide luxury-heading">
                  Optimal Time Matches
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bestMatches.map((match, index) => {
                  const formatted = formatDate(match.date)
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-gradient-to-br from-yellow-500/15 to-orange-500/15 dark:from-yellow-500/10 dark:to-orange-500/10 border border-yellow-500/25 dark:border-yellow-500/20 rounded-3xl p-8 hover:bg-gradient-to-br hover:from-yellow-500/20 hover:to-orange-500/20 dark:hover:from-yellow-500/15 dark:hover:to-orange-500/15 transition-all duration-700"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/25 to-orange-500/25 dark:from-yellow-500/20 dark:to-orange-500/20 border border-yellow-500/35 dark:border-yellow-500/30 rounded-2xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400/90" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-extralight text-yellow-700 dark:text-yellow-300/90 tracking-wide">
                            {match.count}/{totalParticipants}
                          </div>
                          <div className="text-xs text-yellow-600 dark:text-yellow-400/80 font-extralight tracking-widest luxury-caption">
                            {Math.round(match.percentage)}% AVAILABLE
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="font-light text-neutral-900 dark:text-white text-lg tracking-wide luxury-body">
                          {formatted.day}
                        </div>
                        <div className="text-sm text-neutral-700 dark:text-neutral-400/80 font-extralight tracking-wide luxury-body">
                          {formatted.date} at {formatTime(match.timeBlock)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-extralight text-neutral-700 dark:text-neutral-300/90 mb-2 tracking-widest luxury-caption">
                          AVAILABLE PARTICIPANTS:
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400/80 font-extralight tracking-wide luxury-body">
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

        {/* Participants - Atmospheric Panel */}
        {event.participants && event.participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gradient-to-br from-white/90 via-neutral-50/70 to-white/90 dark:from-neutral-900/30 dark:via-neutral-800/15 dark:to-neutral-900/30 backdrop-blur-2xl border border-neutral-300/50 dark:border-white/8 rounded-[2rem] p-12 shadow-xl shadow-neutral-200/40 dark:shadow-xl relative overflow-hidden"
          >
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/3 to-indigo-500/3 dark:from-violet-500/2 dark:to-indigo-500/2 rounded-[2rem]"></div>
            
            <div className="relative">
              <h2 className="text-3xl font-extralight text-neutral-900 dark:text-white mb-12 tracking-wide luxury-heading">
                Participants ({totalParticipants})
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {event.participants.map((participant: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 1.1 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center space-x-4 p-4 rounded-3xl hover:bg-white/3 transition-all duration-700 group"
                  >
                    <div
                      className="w-12 h-12 rounded-3xl flex items-center justify-center text-white font-light shadow-xl group-hover:scale-105 transition-transform duration-500"
                      style={{ 
                        background: `linear-gradient(135deg, ${participant.color || '#8b5cf6'}cc, ${participant.color || '#8b5cf6'}88)`,
                        boxShadow: `0 8px 32px ${participant.color || '#8b5cf6'}30`
                      }}
                    >
                      {participant.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-light text-neutral-900 dark:text-white tracking-wide luxury-body truncate">
                        {participant.name || 'Unknown'}
                      </p>
                    </div>
                  </motion.div>
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