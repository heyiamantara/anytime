'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Clock, Share2, Edit, Trash2, CheckCircle } from 'lucide-react'

interface EventCardProps {
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
  onEdit: (event: any) => void
  onDelete: (eventId: string) => void
  onShare: (eventId: string) => void
  onMarkCompleted: (eventId: string) => void
  onSelect: (event: any) => void
  isSelected: boolean
}

export default function EventCard({ event, onEdit, onDelete, onShare, onMarkCompleted, onSelect, isSelected }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    return status === 'open' ? 'text-green-600' : 'text-orange-600'
  }

  const getStatusBg = (status: string) => {
    return status === 'open' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
  }

  const participantCount = event.participants?.length || 0
  // Count unique participants who have submitted availability responses
  const responseCount = event.participants?.filter((participant: any) => 
    event.availability?.some((avail: any) => avail.participant_id === participant.id)
  ).length || 0

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger selection if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    onSelect(event)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className={`
        card p-6 group relative cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' 
          : 'hover:shadow-lg hover:scale-[1.02]'
        }
      `}
    >
      {/* Status Badge */}
      <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(event.status)} ${getStatusColor(event.status)}`}>
        {event.status === 'open' ? 'Active' : 'Locked'}
      </div>

      {/* Event Info */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 pr-16">
          {event.name}
        </h3>
        {event.description && (
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3 line-clamp-2">
            {event.description}
          </p>
        )}
        
        <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {participantCount}
            </p>
            <p className="text-xs text-neutral-500">Participants</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg relative">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {responseCount}
            </p>
            <p className="text-xs text-neutral-500">Responses</p>
          </div>
          {responseCount > 0 && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Selection Indicator */}
      {responseCount > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-primary-700 dark:text-primary-300">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isSelected ? 'Viewing availability summary →' : 'Click to view availability summary'}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="text-xs text-neutral-500">
          Created {formatDate(event.created_at)}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onShare(event.id)
            }}
            className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
            title="Share event"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {event.status === 'open' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkCompleted(event.id)
              }}
              className="p-2 text-neutral-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all"
              title="Mark as completed"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(event)
            }}
            className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
            title="Edit event"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(event.id)
            }}
            className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            title="Delete event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}