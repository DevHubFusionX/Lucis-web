import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { theme } from '../../../lib/theme'
import { useRouter } from 'next/navigation'

export default function MessagingWidget({ loading }) {
  const router = useRouter()
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-7 bg-gray-100 rounded w-32 mb-8"></div>
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-9 bg-gray-200 rounded-xl w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div variants={fadeIn} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
       <h2 className="text-xl font-black text-gray-900 tracking-tight mb-8" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>Messages</h2>
       <div className="space-y-6">
          {[
            { name: 'Alex Johnson', msg: 'Sounds great! Looking forward to it...', count: 2 },
            { name: 'Natalie Kim', msg: 'Are we still on for tomorrow?', count: 0 }
          ].map((chat, i) => (
            <div key={i} className="flex items-start gap-4">
               <div className="relative">
                  <img 
                    src={`https://i.pravatar.cc/150?u=${i}`}
                    className="w-12 h-12 rounded-full object-cover"
                    alt="Contact"
                  />
                  {chat.count > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">{chat.count}</span>}
               </div>
               <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm">{chat.name}</h4>
                  <p className="text-xs text-gray-500 truncate mb-3">{chat.msg}</p>
                  <button 
                    onClick={() => router.push('/client/messages')}
                    className="w-full py-2.5 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: theme.colors.accent[500] }}
                  >
                    Open Chat <ArrowRight size={12} />
                  </button>
               </div>
            </div>
          ))}
       </div>
    </motion.div>
  )
}
