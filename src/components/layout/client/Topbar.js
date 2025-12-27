import Link from 'next/link'
import { Bell, Search } from 'lucide-react'
import { theme } from '../../../lib/theme'
import ProfileDropdown from './ProfileDropdown'

export default function Topbar({ user, profile, isDropdownOpen, setIsDropdownOpen, logout }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 z-40 border-b border-gray-800/50" style={{ backgroundColor: theme.colors.neutral.deepGray }}>
       <div className="flex items-center gap-4 flex-1">
         
         {/* Mobile Logo */}
         <div className="md:hidden flex items-center h-full py-2">
            <img 
              src="/Logo/logo.svg" 
              alt="Logo" 
              className="h-40 w-auto"
            />
         </div>

         {/* Search Bar */}
         <div className="flex-1 max-w-2xl hidden md:block">
           <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Search className="h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
             </div>
             <input
               type="text"
               className="block w-full pl-11 pr-4 py-2.5 border border-gray-700/50 rounded-xl leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-gray-600 focus:text-white text-sm transition-all"
               placeholder="Search photographers, locations, events"
             />
           </div>
         </div>
       </div>

       {/* Right Actions */}
       <div className="ml-4 flex items-center gap-4">
         <Link href="/client/notifications" className="relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
           <Bell size={20} />
           <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full ring-2" style={{ backgroundColor: theme.colors.accent[500], ringColor: theme.colors.neutral.deepGray }}></span>
         </Link>
         
         <div className="h-8 w-px bg-gray-700/50 mx-2 hidden sm:block"></div>

         <ProfileDropdown 
           user={user}
           profile={profile}
           isDropdownOpen={isDropdownOpen}
           setIsDropdownOpen={setIsDropdownOpen}
           logout={logout}
         />
       </div>
    </header>
  )
}
