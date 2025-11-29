'use client'
import { useState } from 'react'

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('transactions')

  const transactions = [
    { id: 1, date: '2024-12-10', client: 'Sarah Johnson', amount: 2500, status: 'completed', booking: 'Wedding Photography' },
    { id: 2, date: '2024-12-08', client: 'Mike Chen', amount: 300, status: 'completed', booking: 'Portrait Session' },
    { id: 3, date: '2024-12-05', client: 'Emma Davis', amount: 1500, status: 'completed', booking: 'Event Photography' },
    { id: 4, date: '2024-12-01', client: 'John Smith', amount: 3000, status: 'pending', booking: 'Wedding Photography' },
    { id: 5, date: '2024-11-28', client: 'Lisa Anderson', amount: 800, status: 'completed', booking: 'Corporate Event' }
  ]

  const payouts = [
    { id: 1, date: '2024-12-01', amount: 5000, status: 'completed', method: 'Bank Transfer' },
    { id: 2, date: '2024-11-01', amount: 4200, status: 'completed', method: 'Bank Transfer' }
  ]

  const invoices = [
    { id: 1, date: '2024-12-10', client: 'Sarah Johnson', amount: 2500, status: 'paid' },
    { id: 2, date: '2024-12-08', client: 'Mike Chen', amount: 300, status: 'paid' },
    { id: 3, date: '2024-12-05', client: 'Emma Davis', amount: 1500, status: 'paid' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{color: '#111827'}}>Payments</h1>
        <p className="mt-1" style={{color: '#6B7280'}}>Manage your earnings and payouts</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <p className="text-sm font-semibold" style={{color: '#6B7280'}}>Total Earnings</p>
          </div>
          <p className="text-4xl font-bold" style={{color: '#1E3A8A'}}>$12,450</p>
          <p className="text-xs mt-2 font-medium" style={{color: '#9CA3AF'}}>All time</p>
        </div>
        <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#F59E0B'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-semibold" style={{color: '#6B7280'}}>Pending Payouts</p>
          </div>
          <p className="text-4xl font-bold" style={{color: '#F59E0B'}}>$3,800</p>
          <p className="text-xs mt-2 font-medium" style={{color: '#9CA3AF'}}>Processing</p>
        </div>
        <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#10B981'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-sm font-semibold" style={{color: '#6B7280'}}>Withdrawable Balance</p>
          </div>
          <p className="text-4xl font-bold" style={{color: '#10B981'}}>$8,650</p>
          <button className="mt-4 w-full px-4 py-3 rounded-xl text-sm font-medium text-white shadow-sm hover:shadow-md transition-all" style={{backgroundColor: '#1E3A8A'}}>
            💰 Withdraw Funds
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl" style={{backgroundColor: '#F3F4F6'}}>
        {['transactions', 'payouts', 'invoices'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 px-4 py-2.5 font-medium text-sm transition-all rounded-lg"
            style={{
              backgroundColor: activeTab === tab ? '#FFFFFF' : 'transparent',
              color: activeTab === tab ? '#1E3A8A' : '#6B7280',
              boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB'}}>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Client</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Booking</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={tx.id} style={{borderBottom: i < transactions.length - 1 ? '1px solid #E5E7EB' : 'none'}}>
                    <td className="px-6 py-4 text-sm" style={{color: '#6B7280'}}>{tx.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{color: '#111827'}}>{tx.client}</td>
                    <td className="px-6 py-4 text-sm font-bold" style={{color: '#1E3A8A'}}>${tx.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{
                        backgroundColor: tx.status === 'completed' ? '#D1FAE5' : '#FEF3C7',
                        color: tx.status === 'completed' ? '#10B981' : '#F59E0B'
                      }}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{color: '#6B7280'}}>
                      <button className="hover:underline" style={{color: '#1E3A8A'}}>{tx.booking}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div className="rounded-2xl overflow-hidden" style={{backgroundColor: '#FFFFFF', border: '1px solid #E1E6EB'}}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB'}}>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Method</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout, i) => (
                  <tr key={payout.id} style={{borderBottom: i < payouts.length - 1 ? '1px solid #E5E7EB' : 'none'}}>
                    <td className="px-6 py-4 text-sm" style={{color: '#6B7280'}}>{payout.date}</td>
                    <td className="px-6 py-4 text-sm font-bold" style={{color: '#1E3A8A'}}>${payout.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{
                        backgroundColor: '#D1FAE5',
                        color: '#10B981'
                      }}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{color: '#6B7280'}}>{payout.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="rounded-2xl overflow-hidden" style={{backgroundColor: '#FFFFFF', border: '1px solid #E1E6EB'}}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB'}}>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Client</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{color: '#6B7280'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, i) => (
                  <tr key={invoice.id} style={{borderBottom: i < invoices.length - 1 ? '1px solid #E5E7EB' : 'none'}}>
                    <td className="px-6 py-4 text-sm" style={{color: '#6B7280'}}>{invoice.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{color: '#111827'}}>{invoice.client}</td>
                    <td className="px-6 py-4 text-sm font-bold" style={{color: '#1E3A8A'}}>${invoice.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{
                        backgroundColor: '#D1FAE5',
                        color: '#10B981'
                      }}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="hover:underline font-medium" style={{color: '#1E3A8A'}}>📥 Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}