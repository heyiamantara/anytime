'use client'

import { motion } from "framer-motion";

const testimonials = [
  {
    text: "Anytime saved us hours every week. No more endless group chats trying to find a meeting time that works for everyone.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    name: "Sarah Chen",
    role: "Product Manager",
  },
  {
    text: "The visual grid makes it so easy to see when everyone is available. Our team planning sessions are now effortless.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Marcus Rodriguez",
    role: "Team Lead",
  },
  {
    text: "Perfect for coordinating with clients. They love how simple it is to mark their availability without creating accounts.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Emily Watson",
    role: "Freelancer",
  },
  {
    text: "Finally, a scheduling tool that actually works. The real-time updates and instant best match detection are game changers.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "David Kim",
    role: "Engineering Manager",
  },
  {
    text: "We use Anytime for all our team events. The 24/7 availability feature and mobile responsiveness make it perfect for remote teams.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    name: "Lisa Thompson",
    role: "Operations Director",
  },
  {
    text: "The best scheduling tool we've used. Clean interface, no learning curve, and participants love that they don't need to sign up.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Alex Johnson",
    role: "Project Coordinator",
  },
  {
    text: "Anytime eliminated our scheduling chaos. One link, instant availability, and the best time highlighted automatically.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Rachel Green",
    role: "Event Planner",
  },
  {
    text: "The time zone handling is brilliant. Our global team can finally coordinate meetings without the usual confusion.",
    image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    name: "James Wilson",
    role: "Remote Team Lead",
  },
  {
    text: "Simple, fast, and effective. Anytime turned our biggest pain point into our smoothest process.",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    name: "Maya Patel",
    role: "Startup Founder",
  },
];

// Luxury testimonial card component
function TestimonialCard({ testimonial, delay = 0 }: { testimonial: typeof testimonials[0], delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="bg-gradient-to-br from-white/80 via-neutral-50/60 to-white/80 dark:from-neutral-900/40 dark:via-neutral-800/30 dark:to-neutral-900/40 backdrop-blur-xl border border-neutral-200/50 dark:border-white/5 rounded-3xl p-8 hover:border-neutral-300/70 dark:hover:border-white/10 transition-all duration-700 hover:bg-gradient-to-br hover:from-white/90 hover:via-neutral-50/70 hover:to-white/90 dark:hover:from-neutral-900/60 dark:hover:via-neutral-800/40 dark:hover:to-neutral-900/60 shadow-lg dark:shadow-none">
        {/* Quote */}
        <div className="mb-8">
          <svg className="w-8 h-8 text-violet-500/40 dark:text-violet-400/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
          </svg>
          <p className="text-neutral-800 dark:text-white/90 font-extralight text-lg leading-relaxed tracking-wide luxury-body">
            "{testimonial.text}"
          </p>
        </div>

        {/* Author */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 rounded-2xl object-cover border border-neutral-200/50 dark:border-white/10"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent" />
          </div>
          <div>
            <p className="text-neutral-700 dark:text-white/80 font-light tracking-wide luxury-caption">
              {testimonial.name}
            </p>
            <p className="text-neutral-500 dark:text-neutral-400/70 font-extralight text-sm tracking-wider luxury-caption">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Animated column component
function TestimonialColumn({ testimonials, duration, className = "" }: { 
  testimonials: typeof testimonials, 
  duration: number,
  className?: string 
}) {
  return (
    <div className={`flex flex-col space-y-6 ${className}`}>
      <motion.div
        animate={{ y: [0, -100] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-col space-y-6"
      >
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <div key={index} className="w-80">
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function TestimonialsColumnSection() {
  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Full-bleed atmospheric background - Light/Dark responsive */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.03)_0%,transparent_70%)]" />
      
      {/* Editorial content layout */}
      <div className="relative z-10">
        {/* Header - Editorial style */}
        <div className="max-w-4xl mx-auto px-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-neutral-900 dark:text-white mb-8 tracking-tight luxury-heading">
              Loved by teams
              <span className="block text-violet-600 dark:text-violet-400/80 font-light">everywhere</span>
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400/80 font-extralight text-xl tracking-wide max-w-2xl mx-auto luxury-body">
              See what our customers have to say about their experience with Anytime.
            </p>
          </motion.div>
        </div>

        {/* Testimonials grid - Full-bleed with atmospheric masking */}
        <div className="relative">
          <div className="flex justify-center gap-8 [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)] max-h-[800px] overflow-hidden">
            <TestimonialColumn testimonials={firstColumn} duration={20} />
            <TestimonialColumn 
              testimonials={secondColumn} 
              className="hidden md:flex" 
              duration={25} 
            />
            <TestimonialColumn 
              testimonials={thirdColumn} 
              className="hidden lg:flex" 
              duration={22} 
            />
          </div>
          
          {/* Atmospheric fade edges - Light/Dark responsive */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-neutral-50 dark:from-neutral-950 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 dark:from-neutral-950 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}