'use client'
import { motion } from 'framer-motion'
import { theme } from '../../lib/theme'

const team = [
  {
    name: 'Alex Rivera',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Sarah Chen',
    role: 'Head of Curation',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Marcus Thorne',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Elena Volkov',
    role: 'Tech Lead',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=600'
  }
]

export default function AboutTeam() {
  return (
    <section className="py-32 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Creators</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The minds behind the magic. We are a diverse team of artists, engineers, and dreamers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-accent-500 text-sm">{member.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
