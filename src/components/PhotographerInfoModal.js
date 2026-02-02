'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import searchService from '../services/search/searchService'

import { theme } from '../lib/theme'
import {
  MapPin,
  Star,
  Camera,
  Clock,
  Award,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Heart,
  AlertCircle,
  Briefcase,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  User
} from 'lucide-react'
import BaseModal from './BaseModal'

export default function PhotographerInfoModal({ photographer, isOpen, onClose, onBookNow }) {
  const [isFavorited, setIsFavorited] = useState(false)

  // TanStack Query for profile details
  const {
    data: profileDetails,
    isFetching: loading
  } = useQuery({
    queryKey: ['photographer', photographer?.id],
    queryFn: () => searchService.getProfile(photographer.id),
    enabled: isOpen && !!photographer?.id
  })

  if (!isOpen || !photographer) return null

  const displayData = profileDetails || photographer
  const portfolio = displayData?.gallery?.filter(img => img?.url)?.length > 0 ? displayData.gallery.filter(img => img?.url) : []
  const reviews = displayData?.reviews?.filter(r => r) || []
  const skills = displayData?.skills || []
  const schedule = displayData?.schedule?.filter(s => s?.isActive) || []

  // Calculate average rating from reviews
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '5.0'

  const primaryColor = theme.colors.primary[800]
  const accentColor = theme.colors.accent[500]

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={false}
      className="p-0 overflow-hidden h-[90vh] flex flex-col relative"
    >
      {/* Custom Floating Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white backdrop-blur-md rounded-full transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="M6 6 18 18" /></svg>
      </button>

      <div className="flex flex-col md:flex-row h-full">

        {/* LEFT PANEL: Visual & Quick Stats */}
        <div className="md:w-5/12 lg:w-4/12 relative bg-gradient-to-br from-gray-900 to-black text-white shrink-0 overflow-hidden md:h-full h-56">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-40">
            {portfolio[0]?.url ? (
              <Image
                src={portfolio[0].url}
                alt="Cover"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
            {/* Verification Badge */}
            {displayData.isVerified && (
              <div className="self-start">
                <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 px-3 py-1.5 rounded-full">
                  <ShieldCheck size={16} className="text-green-400" />
                  <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Verified</span>
                </div>
              </div>
            )}

            {/* Profile Info */}
            <div>
              <div className="flex gap-4 items-end mb-4">
                <div className="relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
                  <Image
                    src={displayData.profilePicture?.url || `https://ui-avatars.com/api/?name=${displayData.firstName}+${displayData.lastName}&size=200&background=random`}
                    alt={displayData.firstName}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold leading-none mb-2">{displayData.firstName} {displayData.lastName}</h2>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <MapPin size={14} className="text-yellow-500" />
                    {displayData.baseCity || 'Location not set'}
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex gap-6 mt-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-xl md:text-2xl font-bold">{portfolio.length}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest">Photos</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold flex items-center gap-1">
                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                    {avgRating}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest">{reviews.length} Reviews</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold">{skills.length}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest">Skills</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Scrollable Content */}
        <div className="flex-1 bg-white relative flex flex-col h-full overflow-hidden">

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">

            {/* Skills */}
            {skills.length > 0 && (
              <section className="mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Award size={14} /> Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:shadow-md transition-shadow">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* About Section */}
            <section className="mb-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <User size={14} /> About
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {displayData.bio || "This professional prefers to let their work speak for itself."}
              </p>
            </section>

            {/* Contact Info */}
            <section className="mb-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MessageCircle size={14} /> Contact Information
              </h3>
              <div className="grid gap-3">
                {displayData.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail size={18} className="text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Email</div>
                      <div className="text-sm font-bold text-gray-900">{displayData.email}</div>
                    </div>
                  </div>
                )}
                {displayData.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Phone size={18} className="text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Phone</div>
                      <div className="text-sm font-bold text-gray-900">{displayData.phone}</div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Portfolio Grid */}
            {portfolio.length > 0 && (
              <section className="mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Camera size={14} /> Portfolio
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {portfolio.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-zoom-in bg-gray-100 relative group">
                      <Image
                        src={img.url}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={`Portfolio ${i + 1}`}
                        sizes="(max-width: 768px) 50vw, 15vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <section className="mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Star size={14} /> Client Reviews
                </h3>
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((review, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={review.client?.profilePicture?.url || `https://ui-avatars.com/api/?name=${review.client?.firstName}&size=100`}
                              fill
                              className="object-cover"
                              alt={review.client?.firstName}
                              sizes="32px"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900">{review.client?.firstName || 'Anonymous'}</div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, idx) => (
                                <Star
                                  key={idx}
                                  size={12}
                                  className={idx < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Availability Schedule */}
            {schedule.length > 0 && (
              <section className="mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Calendar size={14} /> Weekly Availability
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {schedule.map((slot, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 text-center">
                      <div className="font-bold text-gray-900 mb-1 uppercase text-sm">{slot.dayOfWeek}</div>
                      <div className="text-xs text-gray-600 font-medium">
                        {slot.startTime?.slice(0, 5)} - {slot.endTime?.slice(0, 5)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bottom Spacer for Sticky Footer */}
            <div className="h-24"></div>
          </div>

          {/* Sticky Footer Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-white/95 backdrop-blur-md border-t border-gray-200 flex gap-3 z-20">
            <button className="flex-1 py-4 border-2 border-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              Message
            </button>
            <button
              onClick={onBookNow}
              className="flex-[2] py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              Book Session <ChevronRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </BaseModal>
  )
}
