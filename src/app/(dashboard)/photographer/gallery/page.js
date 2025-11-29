'use client'
import { useState, useEffect } from 'react'
import professionalService from '../../../../services/professionalService'

export default function GalleryPage() {
  const [gallery, setGallery] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const profile = await professionalService.getProfile()
        console.log('🔍 DEBUG: Profile gallery:', profile.gallery)
        setGallery(profile.gallery || [])
      } catch (error) {
        console.error('❌ Failed to fetch gallery:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  const handleUploadMedia = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setUploading(true)
    try {
      const galleryItems = files.map((file, index) => {
        const objectUrl = URL.createObjectURL(file)
        return {
          url: objectUrl,
          publicId: `gallery_${Date.now()}_${index}`,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          thumbnail: objectUrl,
          ...(file.type.startsWith('video/') && { duration: '00:00:30' })
        }
      })

      await professionalService.uploadGalleryItems(galleryItems)
      
      // Refresh gallery
      const profile = await professionalService.getProfile()
      setGallery(profile.gallery || [])
    } catch (error) {
      console.error('Failed to upload media:', error)
      alert('Failed to upload media. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMedia = async (itemId) => {
    try {
      await professionalService.removeGalleryItem(itemId)
      setGallery(gallery.filter(item => item.id !== itemId))
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    } catch (error) {
      console.error('Failed to delete media:', error)
      alert('Failed to delete media. Please try again.')
    }
  }

  const toggleMediaSelect = (mediaId) => {
    setSelectedItems(prev => 
      prev.includes(mediaId) ? prev.filter(id => id !== mediaId) : [...prev, mediaId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{color: '#111827'}}>Gallery</h1>
          <p className="mt-1" style={{color: '#6B7280'}}>Manage your portfolio and showcase your work</p>
        </div>
        <div>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleUploadMedia}
            className="hidden"
            id="gallery-upload"
            disabled={uploading}
          />
          <label
            htmlFor="gallery-upload"
            className="inline-block text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all cursor-pointer"
            style={{backgroundColor: uploading ? '#9CA3AF' : '#1E3A8A'}}
          >
            {uploading ? '⏳ Uploading...' : '📤 Upload Photos/Videos'}
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : gallery.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed" style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#DBEAFE'}}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{color: '#111827'}}>No gallery items yet</h3>
          <p className="mb-6" style={{color: '#6B7280'}}>Upload your first photos or videos to showcase your work</p>
          <label
            htmlFor="gallery-upload"
            className="text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all cursor-pointer"
            style={{backgroundColor: '#1E3A8A'}}
          >
            📤 Upload Media
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map(item => (
            <div 
              key={item.id} 
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-all"
              style={{backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB'}}
            >
              {item.type === 'video' ? (
                <video className="w-full h-full object-cover" poster={item.thumbnail}>
                  <source src={item.url} type="video/mp4" />
                </video>
              ) : (
                <img src={item.url || item.thumbnail} alt="Gallery item" className="w-full h-full object-cover" />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-start justify-between p-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleMediaSelect(item.id)}
                  className="w-5 h-5 rounded cursor-pointer"
                  style={{accentColor: '#1E3A8A'}}
                />
                <button 
                  onClick={() => handleDeleteMedia(item.id)}
                  className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
                  style={{backgroundColor: '#DC2626'}}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Video indicator */}
              {item.type === 'video' && (
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md text-xs font-medium text-white" style={{backgroundColor: 'rgba(0,0,0,0.7)'}}>
                  ▶️ {item.duration || '0:30'}
                </div>
              )}

              {/* Selected Indicator */}
              {selectedItems.includes(item.id) && (
                <div className="absolute top-3 left-3 w-6 h-6 rounded-md flex items-center justify-center shadow-lg" style={{backgroundColor: '#1E3A8A'}}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}