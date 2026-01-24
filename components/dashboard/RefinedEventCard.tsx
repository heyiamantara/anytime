'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Clock, Share2, Trash2, CheckCircle, BarChart3, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

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
  const [showActions, setShowActions] = useState(false)

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', {
        weekday: 'short',
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

  const responseRate = participantCount > 0 ? Math.round((responseCount / participantCount) * 100) : 0

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

  const handleCardClick = () => {
    onSelect(event)
  }

  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (event.status === 'open') {
      onShare(event.id)
    } else {
      handleAnalytics(e)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:border-neutral-300 dark:hover:border-neutral-700"
    >
      {/* Card Content */}
      <div className="p-6" onClick={handleCardClick}>
        {/* Header: Title + Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-2 leading-tight">
              {event.name}
            </h3>
            <div className="flex items-center gap-2">
              <div className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                ${event.status === 'open' 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' 
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }
              `}>
                {event.status === 'open' ? 'Active' : 'Completed'}
              </div>
              {responseRate === 100 && event.status === 'open' && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400">
                  Ready to finalize
                </div>
              )}
            </div>
          </div>
          
          {/* More Actions Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowActions(!showActions)
            }}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          {/* Date Range */}
          <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
            <Calendar className="w-4 h-4 mr-3 text-neutral-400" />
            <span>{formatDateRange(event.start_date, event.end_date)}</span>
          </div>

          {/* Participants & Responses */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
              <Users className="w-4 h-4 mr-3 text-neutral-400" />
              <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
            </div>
            
            {participantCount > 0 && (
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-neutral-400" />
                <span className="text-neutral-600 dark:text-neutral-400 mr-2">
                  {responseCount}/{participantCount} responded
                </span>
                <div className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${responseRate === 100 
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : responseRate >= 50
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }
                `}>
                  {responseRate}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Primary Action */}
        <button
          onClick={handlePrimaryAction}
          className={`
            w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200
            ${event.status === 'open'
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
              : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
            }
          `}
        >
          {event.status === 'open' ? 'Share availability link' : 'View analytics'}
        </button>
      </div>

      {/* Action Menu Overlay */}
      {showActions && (
        <div className="absolute top-16 right-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg py-2 z-10 min-w-[160px]">
          <button
            onClick={handleAnalytics}
            className="w-full px-4 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center"
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            View analytics
          </button>
          
          <button
            onClick={handleShare}
            className="w-full px-4 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center"
          >
            <Share2 className="w-4 h-4 mr-3" />
            Share event
          </button>

          {event.status === 'open' && (
            <button
              onClick={handleMarkCompleted}
              className="w-full px-4 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-3" />
              Mark completed
            </button>
          )}

          <div className="border-t border-neutral-200 dark:border-neutral-700 my-2" />
          
          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-3" />
            Delete event
          </button>
        </div>
      )}

      {/* Click outside to close actions */}
      {showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActions(false)}
        />
      )}
    </motion.div>
  )
}