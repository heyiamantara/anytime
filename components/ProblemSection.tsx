'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Clock, Users } from 'lucide-react'

const problems = [
  {
    icon: MessageSquare,
    title: 'Endless group chats',
    description: 'Back and forth messages that never end'
  },
  {
    icon: Clock,
    title: 'People replying late',
    description: 'Waiting days for everyone to respond'
  },
  {
    icon: Users,
    title: 'No clear overlap',
    description: 'Confusion about when everyone is free'
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
            Group scheduling shouldn't be this hard
          </h2>
        </motion.div>

        {/* Problems grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                  <problem.icon className="w-8 h-8 text-red-500" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
                {problem.title}
              </h3>
              
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}