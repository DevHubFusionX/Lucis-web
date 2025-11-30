'use client'
import { motion } from 'framer-motion'
import { theme } from '../../lib/theme'
import { Heart, Target, Lightbulb, Users } from 'lucide-react'

const values = [
  {
    title: 'Passion',
    description: 'We believe in the power of visual storytelling to move hearts and minds.',
    icon: Heart,
    offset: 0
  },
  {
    title: 'Excellence',
    description: 'We curate only the finest talent to ensure every project is a masterpiece.',
    icon: Target,
    offset: 20
  },
  {
    title: 'Innovation',
    description: 'Pushing boundaries with technology to create seamless experiences.',
    icon: Lightbulb,
    offset: 0
  },
  {
    title: 'Community',
    description: 'Building a supportive network where creators and clients thrive together.',
    icon: Users,
    offset: 20
  }
]

export default function AboutMission() {
  return (
    <section className="py-32 bg-white text-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Text Content */}
          <div className="lg:w-1/3">
            <h2 
              className="text-5xl md:text-6xl font-bold mb-8"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              Our <span className="text-accent-500">Core</span> <br />
              Beliefs
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              At Lucis, we're not just a platform; we're a movement. We stand for quality, creativity, and the human connection that happens behind the lens.
            </p>
          </div>

          {/* Floating Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`
                    p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow duration-500
                    ${item.offset ? 'sm:translate-y-12' : ''}
                  `}
                >
                  <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mb-6 text-accent-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
