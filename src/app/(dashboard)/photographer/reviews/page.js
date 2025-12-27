'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { theme } from '../../../../lib/theme'
import reviewService from '../../../../services/professional/reviewService'
import Notification from '../../../../components/ui/Notification'
import { Star, Flag, User, Loader2, TrendingUp, Award } from 'lucide-react'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [reviewDetails, setReviewDetails] = useState({ averageRating: 0, totalReviews: 0 })
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [flagging, setFlagging] = useState(null)

  const addNotification = (type, title, message) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, type, title, message }])
    setTimeout(() => removeNotification(id), 5000)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getReviews()
        console.log('🔍 DEBUG: Reviews data:', data)
        setReviews(data.records || [])
        setReviewDetails(data.details || { averageRating: 0, totalReviews: 0 })
      } catch (error) {
        console.error('❌ Failed to fetch reviews:', error)
        addNotification('error', 'Error', 'Failed to load reviews. Please try again.')
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

  const handleFlag = async (id) => {
    setFlagging(id)
    setTimeout(() => {
      addNotification('info', 'Review Flagged', 'This review has been flagged for moderation.')
      setFlagging(null)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div 
          className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: theme.colors.accent[500], borderTopColor: 'transparent' }}
        />
        <p className="text-gray-500 font-medium animate-pulse">Loading reviews...</p>
      </div>
    )
  }

  return (
    <>
      <Notification notifications={notifications} onClose={removeNotification} />
      <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 
          className="text-4xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
        >
          Reviews
        </h1>
        <p className="text-gray-600 text-lg">Manage your social proof and client feedback</p>
      </motion.div>

      {/* Rating Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-8 rounded-2xl shadow-lg border border-gray-100 bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl relative overflow-hidden" style={{ backgroundColor: theme.colors.accent[50] }}>
            <div 
              className="absolute inset-0 opacity-5"
              style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <Award className="w-12 h-12 mb-4" style={{ color: theme.colors.accent[600] }} />
              <div className="text-7xl font-bold mb-3" style={{ color: theme.colors.accent[600], fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                {avgRating}
              </div>
              <div className="flex gap-1 mb-4">
                {Array.from({length: 5}, (_, i) => (
                  <Star 
                    key={i} 
                    className="w-7 h-7" 
                    fill={i < Math.round(avgRating) ? '#F59E0B' : 'none'}
                    stroke={i < Math.round(avgRating) ? '#F59E0B' : '#D1D5DB'}
                    strokeWidth={2}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-600">Based on {reviewDetails.totalReviews || reviews.length} reviews</p>
            </div>
          </div>

          {/* Star Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5" style={{ color: theme.colors.accent[600] }} />
              <h3 className="font-bold text-gray-900 text-lg">Rating Distribution</h3>
            </div>
            {[5, 4, 3, 2, 1].map(stars => (
              <motion.div 
                key={stars} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (5 - stars) * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-bold text-gray-700">{stars}</span>
                  <Star className="w-4 h-4" fill="#F59E0B" stroke="#F59E0B" />
                </div>
                <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${reviews.length > 0 ? (ratingCounts[stars] / reviews.length) * 100 : 0}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + (5 - stars) * 0.05 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
                  />
                </div>
                <span className="text-sm font-bold w-10 text-right text-gray-600">{ratingCounts[stars]}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50"
          >
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: theme.colors.accent[50] }}
            >
              <Star className="w-10 h-10" style={{ color: theme.colors.accent[500] }} />
            </div>
            <h3 
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              No reviews yet
            </h3>
            <p className="text-gray-600">Your reviews will appear here once clients start leaving feedback</p>
          </motion.div>
        ) : (
          reviews.map((review, index) => (
          <motion.div 
            key={review.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className="p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all bg-white border border-gray-100"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                    style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
                  >
                    {review.user?.firstName?.[0] || <User className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{review.user?.firstName} {review.user?.lastName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                        {Array.from({length: 5}, (_, i) => (
                          <Star 
                            key={i} 
                            className="w-4 h-4" 
                            fill={i < review.rating ? '#F59E0B' : 'none'}
                            stroke={i < review.rating ? '#F59E0B' : '#D1D5DB'}
                            strokeWidth={2}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>

              {/* Flag Button */}
              <motion.button 
                onClick={() => handleFlag(review.id)}
                disabled={flagging === review.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Report this review"
              >
                {flagging === review.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Flag className="w-5 h-5" />}
              </motion.button>
            </div>
          </motion.div>
          ))
        )}
      </div>
    </div>
    </>
  )
}