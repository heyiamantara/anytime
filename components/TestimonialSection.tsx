'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager',
    company: 'TechFlow',
    avatar: 'SC',
    content: 'Anytime saved us hours every week. No more endless group chats trying to find a meeting time that works for everyone.',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Team Lead',
    company: 'StartupCo',
    avatar: 'MR',
    content: 'The visual grid makes it so easy to see when everyone is available. Our team planning sessions are now effortless.',
    rating: 5
  },
  {
    name: 'Emily Watson',
    role: 'Freelancer',
    company: 'Independent',
    avatar: 'EW',
    content: 'Perfect for coordinating with clients. They love how simple it is to mark their availability without creating accounts.',
    rating: 5
  }
]

export default function TestimonialSection() {
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
          <h2 className="section-title">Loved by teams everywhere</h2>
          <p className="section-subtitle">
            See what our users are saying about Anytime
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="card p-8 group hover:scale-105"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="w-8 h-8 text-primary-600 opacity-60" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-500">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">1,000+</div>
            <div className="text-neutral-600 dark:text-neutral-400">Happy Teams</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">50K+</div>
            <div className="text-neutral-600 dark:text-neutral-400">Events Created</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">99.9%</div>
            <div className="text-neutral-600 dark:text-neutral-400">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">4.9/5</div>
            <div className="text-neutral-600 dark:text-neutral-400">User Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}