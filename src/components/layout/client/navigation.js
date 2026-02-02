import {
  LayoutDashboard,
  Camera,
  Calendar,
  MessageSquare,
  CreditCard,
  Heart,
  Settings,
  Headset
} from 'lucide-react'

export const clientNavigation = [
  { name: 'Dashboard', href: '/client', icon: LayoutDashboard, label: 'Home' },
  { name: 'Book a Photographer', href: '/client/search', icon: Camera, label: 'Book' },
  { name: 'My Bookings', href: '/client/bookings', icon: Calendar, label: 'Bookings' },
  { name: 'Messages', href: '#', icon: MessageSquare, label: 'Inbox', comingSoon: true },
  { name: 'Payments', href: '#', icon: CreditCard, label: 'Pay', comingSoon: true },

  { name: 'Favorites', href: '/client/favorites', icon: Heart, label: 'Saved' },
  { name: 'Settings', href: '/client/profile', icon: Settings, label: 'Profile' },
  { name: 'Support', href: '#', icon: Headset, label: 'Help', comingSoon: true }

]
