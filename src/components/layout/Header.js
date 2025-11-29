import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              PhotoConnect
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/search" className="text-gray-700 hover:text-gray-900">
              Find Photographers
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/login" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover">
              Sign In
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}