'use client'

import { motion } from 'framer-motion'
import { Twitter, Github, Linkedin } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Product', href: '#product' },
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
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-primary-50/50 dark:bg-neutral-900/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* First divider - top of footer */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 mb-8 sm:mb-12"></div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Anytime
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
              Find the perfect time for your group without the chaos.
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              © 2026 Anytime. All rights reserved.
            </p>
          </div>

          {/* Product column */}
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Second divider - middle */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mb-6 sm:mb-8">
          {/* Left side */}
          <div className="text-neutral-500 dark:text-neutral-500 text-sm text-center sm:text-left">
            Made for teams, friends, and communities worldwide
          </div>

          {/* Right side - Social icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
                aria-label={social.name}
              >
                <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Third divider - bottom */}
        <div className="border-t border-neutral-200 dark:border-neutral-700"></div>
      </div>
    </motion.footer>
  )
}