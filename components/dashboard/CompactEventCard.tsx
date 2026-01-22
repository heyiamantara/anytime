'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Clock, Share2, Trash2, CheckCircle } from 'lucide-react'

interface CompactEventCardProps {
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
  isSelected: boolean
  onDelete: (eventId: string) => void
  onShare: (eventId: string) => void
  onMarkCompleted: (eventId: string) => void
}

export default function CompactEventCard({ 
  event, 
  onSelect, 
  isSelected, 
  onDelete, 
  onShare, 
  onMarkCompleted 
}: CompactEventCardProps) {

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

  const handleCardClick = () => {
    onSelect(event)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className={`
        relative p-2 rounded-lg cursor-pointer transition-all duration-200 group
        ${isSelected 
          ? 'bg-primary-500/10 border-2 border-primary-500 shadow-lg shadow-primary-500/20' 
          : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-750 hover:shadow-md'
        }
      `}
    >
      {/* Status Badge and Actions */}
      <div className="flex items-center justify-between mb-2">
        <div className={`
          px-1.5 py-0.5 rounded-full text-xs font-medium
          ${event.status === 'open' 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600' 
            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'
          }
        `}>
          {event.status === 'open' ? 'Active' : 'Completed'}
        </div>

        {/* Direct Action Buttons */}
        <div className="flex items-center space-x-0.5">
          <button
            onClick={(e) => {
              console.log('Share button clicked')
              e.stopPropagation()
              onShare(event.id)
            }}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
            title="Share event"
          >
            <Share2 className="w-3 h-3 text-neutral-500" />
          </button>

          {event.status === 'open' && (
            <button
              onClick={(e) => {
                console.log('Mark completed button clicked')
                e.stopPropagation()
                onMarkCompleted(event.id)
              }}
              className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
              title="Mark as completed"
            >
              <CheckCircle className="w-3 h-3 text-neutral-500" />
            </button>
          )}

          <button
            onClick={(e) => {
              console.log('Delete button clicked')
              e.stopPropagation()
              onDelete(event.id)
            }}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
            title="Delete event"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </button>
        </div>
      </div>

      {/* Event Info */}
      <div className="mb-2">
        <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-1 line-clamp-1">
          {event.name}
        </h3>
        <div className="flex items-center text-xs text-neutral-600 dark:text-neutral-400">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{formatDateRange(event.start_date, event.end_date)}</span>
        </div>
      </div>

      {/* Stats and Analytics Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-xs text-neutral-600 dark:text-neutral-400">
            <Users className="w-3 h-3" />
            <span>{participantCount}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-neutral-600 dark:text-neutral-400 relative">
            <Clock className="w-3 h-3" />
            <span>{responseCount}</span>
            {responseCount > 0 && (
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse ml-1" />
            )}
          </div>
        </div>

        {/* Analytics Indicator */}
        {responseCount > 0 && (
          <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">
            Analytics →
          </div>
        )}
      </div>
    </motion.div>
  )
}