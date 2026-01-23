'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info'
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-600',
          iconBg: 'bg-red-100 dark:bg-red-900/30',
          confirmBtn: 'bg-red-600 hover:bg-red-700 text-white'
        }
      case 'info':
        return {
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white'
        }
      default: // warning
        return {
          icon: 'text-orange-600',
          iconBg: 'bg-orange-100 dark:bg-orange-900/30',
          confirmBtn: 'bg-orange-600 hover:bg-orange-700 text-white'
        }
    }
  }

  const styles = getTypeStyles()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md"
        >
          <div className="card p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${styles.iconBg}`}>
                <AlertTriangle className={`w-5 h-5 sm:w-6 sm:h-6 ${styles.icon}`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {title}
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                  {message}
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={onClose}
                className="btn-secondary w-full sm:w-auto order-2 sm:order-1"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 w-full sm:w-auto order-1 sm:order-2 ${styles.confirmBtn}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}