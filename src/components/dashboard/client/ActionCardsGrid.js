import { Camera, Calendar, Heart, MessageSquare } from 'lucide-react'
import { theme } from '../../../lib/theme'
import ActionCard from './ActionCard'
import { useRouter } from 'next/navigation'

export default function ActionCardsGrid({ data, loading }) {
  const router = useRouter()
  


  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-100 animate-pulse flex flex-col h-full min-h-[160px] space-y-4">
            <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mt-auto"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      <ActionCard 
        icon={Camera}
        label="Book a Photographer"
        subtext="Explore top creative talent"
        buttonText="Find & Book"
        buttonStyle={{ backgroundColor: theme.colors.accent[500] }}
        onClick={() => router.push('/client/search')}
      />
      <ActionCard 
        icon={Calendar}
        label="Upcoming Booking"
        subtext={data.upcomingBookings[0] 
          ? `${new Date(data.upcomingBookings[0].startDateTime).toLocaleDateString()} | ${data.upcomingBookings[0].professional?.firstName || 'Photographer'}`
          : "No active sessions found"
        }
        buttonText="View Details"
        buttonStyle={{ backgroundColor: theme.colors.primary[900] }}
        onClick={() => router.push('/client/bookings')}
      />
      <ActionCard 
        icon={Heart}
        label="Saved Professionals"
        subtext={`${data.stats.favoritesCount || 0} professionals in your list`}
        buttonText="View Favorites"
        buttonStyle={{ backgroundColor: theme.colors.accent[500] }}
        onClick={() => router.push('/client/favorites')}
      />
      <ActionCard 
        icon={MessageSquare}
        label="Messages"
        subtext="Continue your conversations"
        buttonText="Open Chat"
        buttonStyle={{ backgroundColor: theme.colors.gray[200], color: theme.colors.gray[900] }}
        onClick={() => router.push('/client/messages')}
      />
    </div>
  )
}
