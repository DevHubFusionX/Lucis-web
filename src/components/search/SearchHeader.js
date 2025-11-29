'use client'
import { theme } from '../../lib/theme'

export default function SearchHeader({ query, setQuery, toggleFilters }) {
  return (
    <div className="p-6 rounded-2xl shadow-md" style={{backgroundColor: theme.colors.white, border: `1px solid ${theme.colors.gray[200]}`}}>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: theme.colors.gray[400]}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search for exceptional photographers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border text-base focus:outline-none focus:ring-2 transition-all"
            style={{borderColor: theme.colors.gray[200], color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}
          />
        </div>
        <button 
          onClick={toggleFilters}
          className="lg:hidden px-4 py-3 rounded-xl font-semibold shadow-sm transition-all"
          style={{backgroundColor: theme.colors.primary[800], color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ')}}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
