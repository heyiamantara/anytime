'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Clock, Users } from 'lucide-react'

const problems = [
  {
    icon: MessageSquare,
    title: 'Endless group chats',
    description: 'Stop the back and forth that wastes everyone\'s time.'
  },
  {
    icon: Clock,
    title: 'People replying late',
    description: 'Get responses in minutes, not days.'
  },
  {
    icon: Users,
    title: 'No clear overlap',
    description: 'See the perfect time slot instantly.'
  }
]

export default function ProblemSection() {
  return (
    <section className="section bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title max-w-4xl mx-auto leading-tight">
            Skip the scheduling chaos
          </h2>
          <p className="section-subtitle mt-4">
            We solve the three biggest group scheduling headaches
          </p>
        </motion.div>

        {/* Problems grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="mb-6 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors duration-300">
                  <problem.icon className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-neutral-900 dark:text-neutral-100 leading-tight">
                {problem.title}
              </h3>
              
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}