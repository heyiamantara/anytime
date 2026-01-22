'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Clock, Share2, Trash2, CheckCircle, BarChart3 } from 'lucide-react'

interface RefinedEventCardProps {
  event: {
    id: string
    name: string
    description?: string
    start_date: string
    end_date: string
    status: 'open' | 'locked'
    participants?: any[]
    availability?: any[]
    created_at: string
  }
  onSelect: (event: any) => void
  onDelete: (eventId: string) => void
  onShare: (eventId: string) => void
  onMarkCompleted: (eventId: string) => void
}

export default function RefinedEventCard({ 
  event, 
  onSelect, 
  onDelete, 
  onShare, 
  onMarkCompleted 
}: RefinedEventCardProps) {

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }
    
    return `${start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })} - ${end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })}`
  }

  const participantCount = event.participants?.length || 0
  const responseCount = event.participants?.filter((participant: any) => 
    event.availability?.some((avail: any) => avail.participant_id === participant.id)
  ).length || 0

  const handleAnalytics = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(`/event/${event.id}/analytics`, '_blank')
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    onShare(event.id)
  }

  const handleMarkCompleted = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMarkCompleted(event.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(event.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(event)}
      className="group relative bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:bg-neutral-800/70 hover:border-neutral-600/50 hover:shadow-lg hover:shadow-black/10"
    >
      {/* Status Badge - Top Left */}
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className={`
          inline-flex px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium
          ${event.status === 'open' 
            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
            : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
          }
        `}>
          {event.status === 'open' ? 'Active' : 'Completed'}
        </div>

        {/* Action Icons - Top Right */}
        <div className="flex items-center space-x-0.5 sm:space-x-1">
          <button
            onClick={handleAnalytics}
            className="p-1 sm:p-1.5 hover:bg-neutral-700 rounded-lg transition-colors"
            title="View Analytics"
          >
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400 hover:text-primary-400" />
          </button>
          
          <button
            onClick={handleShare}
            className="p-1 sm:p-1.5 hover:bg-neutral-700 rounded-lg transition-colors"
            title="Share Event"
          >
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400 hover:text-blue-400" />
          </button>

          {event.status === 'open' && (
            <button
              onClick={handleMarkCompleted}
              className="p-1 sm:p-1.5 hover:bg-neutral-700 rounded-lg transition-colors"
              title="Mark as Completed"
            >
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400 hover:text-green-400" />
            </button>
          )}

          <button
            onClick={handleDelete}
            className="p-1 sm:p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete Event"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Event Title */}
      <div className="mb-2">
        <h3 className="font-semibold text-neutral-100 text-sm sm:text-base line-clamp-1 group-hover:text-white transition-colors">
          {event.name}
        </h3>
      </div>

      {/* Event Date */}
      <div className="flex items-center text-xs sm:text-sm text-neutral-400 mb-3 sm:mb-4">
        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
        <span>{formatDateRange(event.start_date, event.end_date)}</span>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-500" />
            <span className="text-xs sm:text-sm font-medium text-neutral-300">{participantCount}</span>
            <span className="text-xs text-neutral-500 hidden sm:inline">participants</span>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-500" />
            <span className="text-xs sm:text-sm font-medium text-neutral-300">{responseCount}</span>
            <span className="text-xs text-neutral-500 hidden sm:inline">responses</span>
            {responseCount > 0 && (
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full animate-pulse" />
            )}
          </div>
        </div>

        {/* Response Rate Indicator */}
        {participantCount > 0 && (
          <div className="text-right">
            <div className="text-xs text-neutral-500 hidden sm:block">Response Rate</div>
            <div className={`text-xs sm:text-sm font-semibold ${
              responseCount === participantCount 
                ? 'text-green-400' 
                : responseCount > 0 
                  ? 'text-yellow-400' 
                  : 'text-neutral-400'
            }`}>
              {Math.round((responseCount / participantCount) * 100)}%
            </div>
          </div>
        )}
      </div>
          <div className="flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-300">{participantCount}</span>
            <span className="text-xs text-neutral-500">participants</span>
          </div>
          
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-300">{responseCount}</span>
            <span className="text-xs text-neutral-500">responses</span>
            {responseCount > 0 && (
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            )}
          </div>
        </div>

        {/* Response Rate Indicator */}
        {participantCount > 0 && (
          <div className="text-right">
            <div className="text-xs text-neutral-500">Response Rate</div>
            <div className={`text-sm font-semibold ${
              responseCount === participantCount 
                ? 'text-green-400' 
                : responseCount > 0 
                  ? 'text-yellow-400' 
                  : 'text-neutral-400'
            }`}>
              {Math.round((responseCount / participantCount) * 100)}%
            </div>
          </div>
        )}
      </div>

      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </motion.div>
  )
}