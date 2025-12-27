'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { theme } from '../../../../lib/theme'
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  ChevronLeft, 
  Image as ImageIcon, 
  Paperclip, 
  Smile,
  Circle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Mock Data
const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Wedding Photographer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    lastMessage: "I've uploaded the samples from our session. Let me know what you think!",
    time: '12:45 PM',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'David Chen',
    role: 'Editorial & Fashion',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    lastMessage: "The venue looks perfect for the golden hour shoot.",
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'Portrait Specialist',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    lastMessage: "Are we still on for Saturday afternoon?",
    time: 'Wed',
    unread: 0,
    online: true,
  },
]

const MOCK_MESSAGES = {
  1: [
    { id: 1, sender: 'them', text: "Hi there! I've finished processing the first batch from your event.", time: '10:00 AM' },
    { id: 2, sender: 'me', text: "That's great news! How do they look?", time: '10:05 AM' },
    { id: 3, sender: 'them', text: "They turned out beautifully. The lighting at the park was just magical.", time: '10:10 AM' },
    { id: 4, sender: 'them', text: "I've uploaded the samples from our session. Let me know what you think!", time: '12:45 PM' },
  ]
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const scrollRef = useRef(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [selectedChat])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    // Logic to update local state (simulated)
    setMessage('')
  }

  const activeChatData = conversations.find(c => c.id === selectedChat)
  const messages = selectedChat ? (MOCK_MESSAGES[selectedChat] || []) : []

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 mb-20 md:mb-0">
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar: Conversation List */}
        <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-100 bg-gray-50/30 transition-all duration-500 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-gray-100 bg-white">
            <h1 className="text-2xl font-black text-gray-900 mb-4" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
              Messages
            </h1>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-100 transition-all outline-none font-medium"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 scrollbar-hide py-2">
            {conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 transition-all relative group ${
                  selectedChat === chat.id ? 'bg-white shadow-sm z-10' : 'hover:bg-gray-100/50'
                }`}
              >
                {selectedChat === chat.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full"
                    style={{ backgroundColor: theme.colors.accent[500] }}
                  />
                )}
                <div className="relative shrink-0">
                  <img src={chat.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-white" />
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-bold text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-2 uppercase tracking-tighter">
                      {chat.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate font-medium pr-6">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 flex flex-col bg-white transition-all duration-500 ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <div className="relative">
                    <img src={activeChatData?.avatar} alt="" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover" />
                    {activeChatData?.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 leading-none mb-1 text-sm sm:text-base">{activeChatData?.name}</h2>
                    <div className="flex items-center gap-1.5">
                      <Circle size={8} fill={activeChatData?.online ? "#22c55e" : "#94a3b8"} className={activeChatData?.online ? "text-green-500" : "text-gray-400"} />
                      <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {activeChatData?.online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2">
                  <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-primary-600 transition-all">
                    <Phone size={20} />
                  </button>
                  <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-primary-600 transition-all">
                    <Video size={20} />
                  </button>
                  <button className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 transition-all">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Message Feed */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 scroll-smooth"
              >
                <div className="flex justify-center mb-8">
                  <span className="px-4 py-1.5 rounded-full bg-white border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">
                    Today
                  </span>
                </div>
                
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] sm:max-w-[70%] ${msg.sender === 'me' ? 'order-1' : 'order-2'}`}>
                      <div className={`px-5 py-3.5 rounded-3xl text-sm font-medium shadow-sm transition-all hover:shadow-md ${
                        msg.sender === 'me' 
                          ? 'bg-gray-900 text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <p className={`text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-tighter ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
                <form 
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-3 sm:gap-4 bg-gray-50 p-2 sm:p-3 rounded-[2rem] border-2 border-transparent focus-within:border-primary-100 focus-within:bg-white transition-all shadow-inner"
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button type="button" className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
                      <Paperclip size={20} />
                    </button>
                    <button type="button" className="hidden sm:block p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
                      <ImageIcon size={20} />
                    </button>
                  </div>
                  
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
                  />
                  
                  <div className="flex items-center gap-2">
                    <button type="button" className="hidden sm:block p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
                      <Smile size={20} />
                    </button>
                    <button 
                      type="submit"
                      disabled={!message.trim()}
                      className="p-3 sm:p-4 rounded-full bg-gray-900 text-white shadow-lg hover:shadow-primary-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                      style={{ backgroundColor: theme.colors.primary[900] }}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-gray-50/30">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 bg-blue-500/5 rounded-full animate-ping" />
                 <Send size={40} className="text-gray-900 ml-1" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                Your Inbox
              </h3>
              <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
                Connect with professional photographers to discuss your creative vision, booking details, and more.
              </p>
              <button className="mt-8 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
                New Conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
