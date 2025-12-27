'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { theme } from '../../../../lib/theme'
import { DollarSign, Clock, Wallet, Download, TrendingUp, Calendar, User, ArrowUpRight } from 'lucide-react'

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('transactions')

  const transactions = [
    { id: 1, date: '2024-12-10', client: 'Sarah Johnson', amount: 250000, status: 'completed', booking: 'Wedding Photography' },
    { id: 2, date: '2024-12-08', client: 'Mike Chen', amount: 30000, status: 'completed', booking: 'Portrait Session' },
    { id: 3, date: '2024-12-05', client: 'Emma Davis', amount: 150000, status: 'completed', booking: 'Event Photography' },
    { id: 4, date: '2024-12-01', client: 'John Smith', amount: 300000, status: 'pending', booking: 'Wedding Photography' },
    { id: 5, date: '2024-11-28', client: 'Lisa Anderson', amount: 80000, status: 'completed', booking: 'Corporate Event' }
  ]

  const payouts = [
    { id: 1, date: '2024-12-01', amount: 500000, status: 'completed', method: 'Bank Transfer' },
    { id: 2, date: '2024-11-01', amount: 420000, status: 'completed', method: 'Bank Transfer' }
  ]

  const invoices = [
    { id: 1, date: '2024-12-10', client: 'Sarah Johnson', amount: 250000, status: 'paid' },
    { id: 2, date: '2024-12-08', client: 'Mike Chen', amount: 30000, status: 'paid' },
    { id: 3, date: '2024-12-05', client: 'Emma Davis', amount: 150000, status: 'paid' }
  ]

  const stats = [
    {
      title: 'Total Earnings',
      value: '1,245,000',
      subtitle: 'All time',
      icon: DollarSign,
      gradient: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})`,
      bgColor: theme.colors.accent[50]
    },
    {
      title: 'Pending Payouts',
      value: '380,000',
      subtitle: 'Processing',
      icon: Clock,
      gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
      bgColor: '#FEF3C7'
    },
    {
      title: 'Available Balance',
      value: '865,000',
      subtitle: 'Ready to withdraw',
      icon: Wallet,
      gradient: 'linear-gradient(135deg, #10B981, #059669)',
      bgColor: '#D1FAE5',
      action: true
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 
          className="text-4xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
        >
          Payments & Earnings
        </h1>
        <p className="text-gray-600 text-lg">Track your income and manage payouts</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group overflow-hidden"
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity"
                style={{ background: stat.gradient }}
              />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.gradient.match(/#[0-9A-F]{6}/i)?.[0] }} />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                
                <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
                
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-gray-900">₦</span>
                  <p 
                    className="text-4xl font-bold text-gray-900"
                    style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
                  >
                    {stat.value}
                  </p>
                </div>
                
                <p className="text-xs text-gray-500 font-medium">{stat.subtitle}</p>
                
                {stat.action && (
                  <button 
                    className="mt-4 w-full py-3 rounded-xl text-white font-semibold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                    style={{ background: stat.gradient }}
                  >
                    <Wallet className="w-5 h-5" />
                    Withdraw Funds
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 rounded-xl bg-gray-100">
        {['transactions', 'payouts', 'invoices'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 px-6 py-3 font-semibold text-sm transition-all rounded-lg capitalize"
            style={{
              backgroundColor: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? theme.colors.accent[600] : '#6B7280',
              boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Client
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Booking</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{tx.client}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold" style={{ color: theme.colors.accent[600] }}>₦</span>
                        <span className="text-sm font-bold" style={{ color: theme.colors.accent[600] }}>
                          {tx.amount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: tx.status === 'completed' ? '#D1FAE5' : '#FEF3C7',
                          color: tx.status === 'completed' ? '#059669' : '#D97706'
                        }}
                      >
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        className="text-sm font-medium hover:underline flex items-center gap-1"
                        style={{ color: theme.colors.accent[600] }}
                      >
                        {tx.booking}
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Method</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout, i) => (
                  <tr key={payout.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{payout.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold" style={{ color: theme.colors.accent[600] }}>₦</span>
                        <span className="text-lg font-bold" style={{ color: theme.colors.accent[600] }}>
                          {payout.amount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"
                      >
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payout.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, i) => (
                  <tr key={invoice.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{invoice.client}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold" style={{ color: theme.colors.accent[600] }}>₦</span>
                        <span className="text-sm font-bold" style={{ color: theme.colors.accent[600] }}>
                          {invoice.amount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105"
                        style={{ backgroundColor: theme.colors.accent[50], color: theme.colors.accent[600] }}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}
