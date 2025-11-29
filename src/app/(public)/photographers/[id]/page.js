export default function PhotographerProfile({ params }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Alex Johnson</h1>
              <p className="text-gray-600 mt-2">Wedding & Portrait Photographer</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-gray-600 ml-2">4.9 (127 reviews)</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-4">Starting at $800</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 mt-4">
                Book Now
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}