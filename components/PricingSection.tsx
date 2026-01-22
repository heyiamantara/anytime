'use client'

import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for small teams and personal use',
    features: [
      'Up to 10 events per week',
      'Up to 7 participants per event',
      'Basic availability grid',
      'Email notifications',
      'Mobile responsive'
    ],
    cta: 'Get Started Free',
    popular: false,
    action: 'signup'
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    description: 'Advanced features for growing teams',
    features: [
      'Unlimited events',
      'Unlimited participants',
      'Priority support',
      'Custom branding',
      'Analytics dashboard'
    ],
    cta: 'Start Pro Trial',
    popular: true,
    action: 'upgrade'
  }
]

interface PricingSectionProps {
  onSignUp?: () => void
  onUpgrade?: () => void
}

export default function PricingSection({ onSignUp, onUpgrade }: PricingSectionProps) {
  const handleButtonClick = (action: string) => {
    if (action === 'signup' && onSignUp) {
      onSignUp()
    } else if (action === 'upgrade' && onUpgrade) {
      onUpgrade()
    }
  }

  return (
    <section id="pricing" className="section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl">Simple, transparent pricing</h2>
          <p className="section-subtitle text-base sm:text-lg lg:text-xl">
            Choose the plan that works best for your team
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative flex flex-col ${
                plan.popular 
                  ? 'card p-6 sm:p-8 border-2 border-primary-500 shadow-xl shadow-primary-500/20' 
                  : 'card p-6 sm:p-8'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  {plan.name}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4 sm:mb-6 text-sm sm:text-base">
                  {plan.description}
                </p>
                <div className="mb-4 sm:mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-100">
                    {plan.price}
                  </span>
                  <span className="text-neutral-500 ml-2 text-sm sm:text-base">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features - flex-grow to push button to bottom */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-600" />
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA - aligned at bottom */}
              <button 
                onClick={() => handleButtonClick(plan.action)}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-200 mt-auto text-sm sm:text-base ${
                  plan.popular
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12"
        >
          <p className="text-neutral-500 dark:text-neutral-500 text-sm sm:text-base">
            Pro plan includes unlimited events and participants. No hidden fees.
          </p>
        </motion.div>
      </div>
    </section>
  )
}