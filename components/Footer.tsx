'use client'

import { motion } from 'framer-motion'
import { Twitter, Github, Linkedin } from 'lucide-react'
import Logo from './Logo'

const footerLinks = {
  product: [
    { name: 'Product', href: '#product' },
    { name: 'Demo', href: '#demo' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'How it Works', href: '#how-it-works' }
  ],
  company: [
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Blog', href: '#blog' },
    { name: 'Careers', href: '#careers' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' }
  ]
}

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#twitter' },
  { name: 'GitHub', icon: Github, href: '#github' },
  { name: 'LinkedIn', icon: Linkedin, href: '#linkedin' }
]

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-neutral-50/80 via-white/60 to-neutral-100/80 dark:from-neutral-950/80 dark:via-neutral-900/60 dark:to-black/80 backdrop-blur-xl relative"
    >
      {/* Atmospheric top border */}
      <div className="w-screen border-t border-neutral-300/40 dark:border-white/8 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Main footer content - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="mb-6 sm:mb-8">
              <Logo size="lg" animated={false} />
            </div>
            <p className="text-neutral-700 dark:text-neutral-400/80 mb-6 sm:mb-8 leading-relaxed font-extralight tracking-wide luxury-body text-base sm:text-lg">
              Find the perfect time for your group without the chaos.
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-500/80 font-extralight tracking-widest luxury-caption">
              © 2026 Anytime. All rights reserved.
            </p>
          </div>

          {/* Product column */}
          <div>
            <h3 className="font-light text-neutral-900 dark:text-white mb-6 sm:mb-8 text-base sm:text-lg tracking-wide luxury-heading">
              Product
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-neutral-700 dark:text-neutral-400/80 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-500 font-extralight tracking-wide luxury-body text-sm sm:text-base touch-target"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="font-light text-neutral-900 dark:text-white mb-8 text-lg tracking-wide luxury-heading">
              Company
            </h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-neutral-700 dark:text-neutral-400/80 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-500 font-extralight tracking-wide luxury-body"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 className="font-light text-neutral-900 dark:text-white mb-8 text-lg tracking-wide luxury-heading">
              Legal
            </h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-neutral-700 dark:text-neutral-400/80 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-500 font-extralight tracking-wide luxury-body"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Atmospheric middle border */}
      <div className="w-screen border-t border-neutral-300/30 dark:border-white/6 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"></div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-8 sm:space-y-0 mb-12">
          {/* Left side */}
          <div className="text-neutral-600 dark:text-neutral-500/80 text-lg text-center sm:text-left font-extralight tracking-wide luxury-body">
            Made for teams, friends, and communities worldwide
          </div>

          {/* Right side - Social icons */}
          <div className="flex items-center space-x-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-gradient-to-br from-neutral-200/60 to-neutral-300/60 dark:from-neutral-800/40 dark:to-neutral-900/40 backdrop-blur-sm rounded-2xl flex items-center justify-center text-neutral-700 dark:text-neutral-400/80 hover:bg-gradient-to-br hover:from-violet-500/15 hover:to-indigo-500/15 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-700 border border-neutral-300/40 dark:border-white/8 hover:border-violet-500/30 dark:hover:border-violet-500/20 shadow-lg shadow-neutral-200/50 dark:shadow-none"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Atmospheric bottom border */}
      <div className="w-screen border-t border-neutral-300/30 dark:border-white/6 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"></div>
    </motion.footer>
  )
}