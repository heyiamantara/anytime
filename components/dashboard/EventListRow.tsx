'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Clock, MoreVertical, Eye } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface EventListRowProps {
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
  onEdit: (eventId: string) => void
  onDelete: (eventId: string) => void
  onShare: (eventId: string) => void
  onMarkCompleted: (eventId: string) => void
}

export default function EventListRow({ 
  event, 
  onSelect, 
  isSelected, 
  onEdit,
  onDelete, 
  onShare, 
  onMarkCompleted 
}: EventListRowProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMenuAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)
    
    switch (action) {
      case 'edit':
        onEdit(event.id)
        break
      case 'share':
        onShare(event.id)
        break
      case 'analytics':
        window.open(`/event/${event.id}/analytics`, '_blank')
        break
      case 'complete':
        onMarkCompleted(event.id)
        break
      case 'delete':
        onDelete(event.id)
        break
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(event)}
      className={`
        relative px-4 py-3 cursor-pointer transition-all duration-200 border-b border-neutral-800
        ${isSelected 
          ? 'bg-primary-500/10 border-l-2 border-l-primary-500' 
          : 'hover:bg-neutral-800/50'
        }
      `}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Event info */}
        <div className="flex-1 min-w-0">
          {/* Status and Name */}
          <div className="flex items-center space-x-3 mb-1">
            <div className={`
              px-2 py-0.5 rounded-full text-xs font-medium
              ${event.status === 'open' 
                ? 'bg-green-900/30 text-green-400' 
                : 'bg-orange-900/30 text-orange-400'
              }
            `}>
              {event.status === 'open' ? 'Active' : 'Completed'}
            </div>
            <h3 className="font-medium text-neutral-100 truncate">
              {event.name}
            </h3>
          </div>

          {/* Date */}
          <div className="flex items-center text-sm text-neutral-400 mb-2">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formatDateRange(event.start_date, event.end_date)}</span>
          </div>

          {/* Metrics */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-xs text-neutral-400">
              <Users className="w-3 h-3" />
              <span>{participantCount}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-neutral-400">
              <Clock className="w-3 h-3" />
              <span>{responseCount}</span>
              {responseCount > 0 && (
                <div className="w-1 h-1 bg-primary-500 rounded-full ml-1" />
              )}
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {/* Primary View Action */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect(event)
            }}
            className="px-3 py-1 text-xs font-medium text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded transition-colors"
          >
            <Eye className="w-3 h-3 mr-1 inline" />
            View
          </button>

          {/* Three-dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="p-1 hover:bg-neutral-700 rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-neutral-400" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.1 }}
                className="absolute right-0 top-full mt-1 w-32 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10"
              >
                <button
                  onClick={(e) => handleMenuAction('edit', e)}
                  className="w-full px-3 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700 rounded-t-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleMenuAction('share', e)}
                  className="w-full px-3 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700 transition-colors"
                >
                  Share
                </button>
                <button
                  onClick={(e) => handleMenuAction('analytics', e)}
                  className="w-full px-3 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700 transition-colors"
                >
                  Analytics
                </button>
                {event.status === 'open' && (
                  <button
                    onClick={(e) => handleMenuAction('complete', e)}
                    className="w-full px-3 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700 transition-colors"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={(e) => handleMenuAction('delete', e)}
                  className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 rounded-b-lg transition-colors"
                >
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}