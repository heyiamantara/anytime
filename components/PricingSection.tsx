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
    <section id="pricing" className="py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Editorial Section Header - Mobile Responsive */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-24"
        >
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-neutral-900 dark:text-white mb-4 sm:mb-8 tracking-tighter leading-[0.85] luxury-heading">
            Simple, transparent pricing
          </h2>
          <p className="text-base sm:text-xl md:text-2xl text-neutral-600 dark:text-neutral-300/80 max-w-3xl mx-auto leading-relaxed font-extralight tracking-wide luxury-body">
            Choose the plan that works best for your team
          </p>
        </motion.div>

        {/* Mobile-Responsive Pricing Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto pt-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className={`relative group bg-white/90 dark:bg-neutral-900/60 backdrop-blur-xl border rounded-2xl p-8 sm:p-10 hover:bg-white dark:hover:bg-neutral-900/80 transition-all duration-500 hover:shadow-2xl ${
                plan.popular 
                  ? 'border-violet-500/30 shadow-xl shadow-violet-500/10 dark:shadow-violet-500/5 mt-0' 
                  : 'border-neutral-200/60 dark:border-neutral-700/50 shadow-lg mt-6'
              }`}
            >
              {/* Subtle Background Pattern */}
              <div className={`absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-violet-500/5 to-indigo-500/5'
                  : 'bg-gradient-to-br from-violet-500/2 to-indigo-500/2'
              }`}></div>

              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-violet-600/90 to-indigo-600/90 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-extralight flex items-center space-x-1.5 shadow-lg shadow-violet-500/25 border border-violet-400/20">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="tracking-wider uppercase">Popular</span>
                  </div>
                </div>
              )}

              <div className="relative">
                {/* Plan header */}
                <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extralight text-neutral-900 dark:text-white mb-2 sm:mb-3 lg:mb-4 tracking-wide luxury-heading">
                    {plan.name}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400/80 mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base lg:text-lg font-extralight tracking-wide luxury-body">
                    {plan.description}
                  </p>
                  <div className="mb-4 sm:mb-6 lg:mb-8">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-neutral-900 dark:text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-sm sm:text-base lg:text-lg text-neutral-500 dark:text-neutral-500/80 ml-2 sm:ml-3 font-extralight tracking-wide luxury-body">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 sm:space-y-4 lg:space-y-6 mb-6 sm:mb-8 lg:mb-12">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-violet-500/15 to-indigo-500/15 border border-violet-500/20 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 text-violet-500 dark:text-violet-400/90" />
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300/90 font-extralight tracking-wide luxury-body text-sm sm:text-base">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button 
                  onClick={() => handleButtonClick(plan.action)}
                  className={`w-full py-2 sm:py-4 lg:py-6 px-3 sm:px-6 lg:px-8 rounded-lg sm:rounded-2xl lg:rounded-3xl font-light transition-all duration-700 tracking-widest uppercase text-xs sm:text-sm luxury-caption touch-target ${
                    plan.popular
                      ? 'bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 luxury-glow'
                      : 'border-2 border-violet-500/50 dark:border-violet-500/30 text-violet-600 dark:text-violet-300/90 hover:bg-violet-500/10 hover:border-violet-400/70 dark:hover:border-violet-400/50'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 px-4"
        >
          <p className="text-neutral-500 dark:text-neutral-500/80 font-extralight tracking-wide luxury-body text-sm sm:text-base">
            Pro plan includes unlimited events and participants. No hidden fees.
          </p>
        </motion.div>
      </div>
    </section>
  )
}