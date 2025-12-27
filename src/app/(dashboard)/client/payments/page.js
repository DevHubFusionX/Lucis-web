'use client'
import { useState, useEffect } from 'react'
import { theme } from '../../../../lib/theme'
import { 
  CreditCard, 
  History, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Download,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Calendar,
  DollarSign
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import paymentService from '../../../../services/client/paymentService'

// Mock Data (will be replaced by service calls)
const MOCK_CARDS = [
  { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true, color: '#1a1a1a' },
  { id: 2, type: 'Mastercard', last4: '8888', expiry: '09/24', isDefault: false, color: '#4338ca' },
]

const MOCK_TRANSACTIONS = [
  { 
    id: 'TXN-9021', 
    date: '2025-12-24', 
    photographer: 'Sarah Mitchell', 
    service: 'Wedding Photography',
    amount: 150000, 
    status: 'completed'
  },
  { 
    id: 'TXN-8842', 
    date: '2025-12-15', 
    photographer: 'David Chen', 
    service: 'Lifestyle Shoot',
    amount: 75000, 
    status: 'completed'
  },
  { 
    id: 'TXN-7731', 
    date: '2025-12-05', 
    photographer: 'Elena Rodriguez', 
    service: 'Professional Headshots',
    amount: 120000, 
    status: 'failed'
  },
]

export default function PaymentsPage() {
  const [cards, setCards] = useState(MOCK_CARDS)
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-primary-600 mb-4 bg-primary-50 w-fit px-4 py-1.5 rounded-full" style={{ color: theme.colors.primary[600], backgroundColor: theme.colors.primary[50] }}>
             <ShieldCheck size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest">Secure Payments</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 tracking-tight mb-4" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
            Payments & Billing
          </h1>
          <p className="text-gray-500 max-w-2xl font-medium text-lg leading-relaxed">
            Manage your payment methods, view transaction history, and download invoices for your photography sessions.
          </p>
        </div>

        {/* Financial Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Spent', value: '₦345,000', icon: Wallet, color: 'indigo' },
            { label: 'Pending Bookings', value: '2', icon: Calendar, color: 'orange' },
            { label: 'Saved Methods', value: cards.length, icon: CreditCard, color: 'emerald' },
          ].map((stat, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={stat.label}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000`}></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
                   <h3 className="text-3xl font-black text-gray-900 tracking-tighter" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                     {stat.value}
                   </h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500 shadow-sm`}>
                   <stat.icon size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Payment Methods Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-8">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <CreditCard size={20} className="text-accent-500" style={{ color: theme.colors.accent[500] }} />
                    Cards
                  </h3>
                  <button className="p-2 bg-gray-900 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg" style={{ backgroundColor: theme.colors.primary[900] }}>
                    <Plus size={18} />
                  </button>
               </div>

               <div className="space-y-4">
                  {cards.map((card) => (
                    <div 
                      key={card.id}
                      className="p-6 rounded-3xl border border-gray-100 relative group overflow-hidden transition-all hover:border-accent-100 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-black text-[10px]" style={{ backgroundColor: card.color }}>
                              {card.type}
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-900 tracking-wider">•••• {card.last4}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Expires {card.expiry}</p>
                           </div>
                        </div>
                        {card.isDefault && (
                          <span className="text-[8px] font-black uppercase tracking-widest text-accent-600 bg-accent-50 px-2.5 py-1 rounded-full border border-accent-100" style={{ color: theme.colors.accent[600], borderColor: theme.colors.accent[100] }}>
                            Default
                          </span>
                        )}
                      </div>
                      <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 text-red-400 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-[10px] font-bold text-gray-500 text-center leading-relaxed">
                    All payment processing is handled securely via industry-standard encryption protocols.
                  </p>
               </div>
            </div>
          </div>

          {/* Transaction History Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <History size={20} className="text-accent-500" style={{ color: theme.colors.accent[500] }} />
                    Transactions
                  </h3>
                  <div className="flex items-center gap-4">
                     <button className="text-xs font-black text-gray-400 hover:text-gray-900 transition-colors">Filter</button>
                     <div className="w-px h-4 bg-gray-100"></div>
                     <button className="text-xs font-black text-gray-400 hover:text-gray-900 transition-colors">Export</button>
                  </div>
               </div>

               <div className="overflow-x-auto hidden sm:block">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-gray-50/50">
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction Details</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                          <th className="px-8 py-5"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {transactions.map((txn) => (
                         <tr key={txn.id} className="hover:bg-gray-50/30 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                    <DollarSign size={20} />
                                 </div>
                                 <div className="min-w-0">
                                    <p className="text-sm font-black text-gray-900 truncate">{txn.photographer}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{txn.service}</span>
                                       <span className="text-[10px] font-medium text-gray-300">•</span>
                                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{txn.date}</span>
                                    </div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                txn.status === 'completed' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                  : 'bg-red-50 text-red-600 border-red-100'
                              }`}>
                                {txn.status}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <p className="text-sm font-black text-gray-900 tracking-tight">₦{txn.amount.toLocaleString()}</p>
                              <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-tighter">ID: {txn.id}</p>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors opacity-0 group-hover:opacity-100">
                                 <Download size={18} />
                              </button>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>

               {/* Mobile Transactions List */}
               <div className="sm:hidden divide-y divide-gray-50">
                  {transactions.map((txn) => (
                    <div key={txn.id} className="p-6">
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                <DollarSign size={20} />
                             </div>
                             <div>
                                <p className="text-sm font-black text-gray-900">{txn.photographer}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{txn.date}</p>
                             </div>
                          </div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                            txn.status === 'completed' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            {txn.status}
                          </span>
                       </div>
                       <div className="flex items-center justify-between">
                          <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">{txn.service}</p>
                             <p className="text-lg font-black text-gray-900">₦{txn.amount.toLocaleString()}</p>
                          </div>
                          <button className="p-3 bg-gray-50 rounded-xl text-gray-400">
                             <Download size={18} />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="p-8 bg-gray-50/30 border-t border-gray-100 text-center">
                  <button className="text-sm font-black text-primary-600 hover:text-primary-800 transition-colors flex items-center gap-2 mx-auto" style={{ color: theme.colors.primary[600] }}>
                    View Full History
                    <ChevronRight size={16} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
