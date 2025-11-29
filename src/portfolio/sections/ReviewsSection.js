export default function ReviewsSection({ config, professional, theme }) {
  const sectionTitle = config.sectionTitle || 'Client Reviews'
  const showProfilePics = config.showProfilePics !== false
  const sortOrder = config.sortOrder || 'newest'
  const showAverageRating = config.showAverageRating !== false
  
  // Mock reviews data - in real app, this would come from professional reviews
  const reviews = config.reviews || [
    {
      id: 1,
      clientName: 'Sarah Johnson',
      rating: 5,
      text: 'Absolutely amazing work! The photos exceeded all our expectations. Professional, creative, and captured every special moment perfectly.',
      date: '2024-01-15',
      profilePic: '/api/placeholder/60/60'
    },
    {
      id: 2,
      clientName: 'Michael Chen',
      rating: 5,
      text: 'Outstanding photographer! Great communication, arrived on time, and delivered beautiful photos quickly. Highly recommend!',
      date: '2024-01-10',
      profilePic: '/api/placeholder/60/60'
    },
    {
      id: 3,
      clientName: 'Emily Rodriguez',
      rating: 4,
      text: 'Very professional and talented. The portrait session was comfortable and the results were fantastic. Will definitely book again.',
      date: '2024-01-05',
      profilePic: '/api/placeholder/60/60'
    },
    {
      id: 4,
      clientName: 'David Wilson',
      rating: 5,
      text: 'Incredible attention to detail and artistic vision. Our wedding photos are absolutely perfect and we couldn\'t be happier.',
      date: '2023-12-28',
      profilePic: '/api/placeholder/60/60'
    },
    {
      id: 5,
      clientName: 'Lisa Thompson',
      rating: 5,
      text: 'Amazing experience from start to finish. Professional, friendly, and the photos are stunning. Worth every penny!',
      date: '2023-12-20',
      profilePic: '/api/placeholder/60/60'
    },
    {
      id: 6,
      clientName: 'James Miller',
      rating: 4,
      text: 'Great photographer with excellent skills. The corporate headshots came out perfect and were delivered promptly.',
      date: '2023-12-15',
      profilePic: '/api/placeholder/60/60'
    }
  ]

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const totalReviews = reviews.length

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOrder === 'oldest') {
      return new Date(a.date) - new Date(b.date)
    }
    return new Date(b.date) - new Date(a.date)
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <section className={`py-20 px-4 ${theme.background}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${theme.text} mb-6`}>
            {sectionTitle}
          </h2>
          <p className={`text-lg ${theme.text} opacity-80 max-w-2xl mx-auto`}>
            See what our clients have to say about their experience working with us.
          </p>
        </div>

        {/* Average Rating */}
        {showAverageRating && (
          <div className="text-center mb-16">
            <div className={`inline-block p-8 rounded-2xl border ${theme.border} bg-white/50 backdrop-blur-sm`}>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-8 h-8 ${i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className={`text-3xl font-bold ${theme.text}`}>{averageRating.toFixed(1)}</span>
              </div>
              <p className={`${theme.text} opacity-70`}>
                Based on {totalReviews} reviews
              </p>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className={`p-6 rounded-2xl border ${theme.border} bg-white shadow-sm hover:shadow-md transition-shadow`}
            >
              {/* Review Header */}
              <div className="flex items-center gap-4 mb-4">
                {showProfilePics && (
                  <img
                    src={review.profilePic}
                    alt={review.clientName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className={`font-semibold ${theme.text}`}>
                    {review.clientName}
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className={`text-sm ${theme.text} opacity-60`}>
                      {formatDate(review.date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p className={`${theme.text} opacity-80 leading-relaxed text-sm`}>
                "{review.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className={`inline-block p-8 rounded-2xl ${theme.background}`}>
            <h3 className={`text-2xl font-semibold ${theme.text} mb-4`}>
              Ready to Create Amazing Memories?
            </h3>
            <p className={`${theme.text} opacity-70 mb-6 max-w-md`}>
              Join our satisfied clients and let us capture your special moments with the same care and professionalism.
            </p>
            <button className={`px-8 py-4 ${theme.accent} bg-current text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}>
              Book Your Session
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}