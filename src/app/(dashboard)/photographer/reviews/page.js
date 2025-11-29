'use client'
import { useState, useEffect } from 'react'
import professionalService from '../../../../services/professionalService'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [reviewDetails, setReviewDetails] = useState({ averageRating: 0, totalReviews: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await professionalService.getReviews()
        console.log('🔍 DEBUG: Reviews data:', data)
        setReviews(data.records || [])
        setReviewDetails(data.details || { averageRating: 0, totalReviews: 0 })
      } catch (error) {
        console.error('❌ Failed to fetch reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  }

  const avgRating = reviewDetails.averageRating || (reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0)

  const handleFlag = (id) => {
    alert('Review flagged for review')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{color: '#111827'}}>Reviews</h1>
        <p className="mt-1" style={{color: '#6B7280'}}>Manage your social proof and client feedback</p>
      </div>

      {/* Rating Summary */}
      <div className="p-8 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl" style={{backgroundColor: '#F9FAFB'}}>
            <div className="text-6xl font-bold mb-2" style={{color: '#1E3A8A'}}>{avgRating}</div>
            <div className="flex gap-1 mb-3">
              {Array.from({length: 5}, (_, i) => (
                <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" style={{color: i < Math.round(avgRating) ? '#F59E0B' : '#D1D5DB'}}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm font-medium" style={{color: '#6B7280'}}>Based on {reviewDetails.totalReviews || reviews.length} reviews</p>
          </div>

          {/* Star Breakdown */}
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-semibold" style={{color: '#374151'}}>{stars}</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: '#F59E0B'}}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex-1 h-3 rounded-full" style={{backgroundColor: '#E5E7EB'}}>
                  <div 
                    className="h-full rounded-full transition-all" 
                    style={{
                      width: `${(ratingCounts[stars] / reviews.length) * 100}%`,
                      backgroundColor: '#1E3A8A'
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold w-10 text-right" style={{color: '#6B7280'}}>{ratingCounts[stars]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed" style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#DBEAFE'}}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{color: '#111827'}}>No reviews yet</h3>
            <p style={{color: '#6B7280'}}>Your reviews will appear here once clients start leaving feedback</p>
          </div>
        ) : (
          reviews.map(review => (
          <div key={review.id} className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-all" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#1E3A8A'}}>
                    <span className="text-white font-bold">{review.user?.firstName?.[0] || 'U'}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold" style={{color: '#111827'}}>{review.user?.firstName} {review.user?.lastName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                        {Array.from({length: 5}, (_, i) => (
                          <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: i < review.rating ? '#F59E0B' : '#D1D5DB'}}>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs" style={{color: '#9CA3AF'}}>•</span>
                      <p className="text-xs" style={{color: '#6B7280'}}>{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <p className="leading-relaxed" style={{color: '#374151'}}>{review.text}</p>
              </div>

              {/* Flag Button */}
              <button 
                onClick={() => handleFlag(review.id)}
                className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{backgroundColor: '#F3F4F6', color: '#6B7280'}}
                title="Report this review"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  )
}