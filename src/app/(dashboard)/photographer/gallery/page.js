'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { theme } from '../../../../lib/theme'
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Video,
  Play,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react'
import { useGalleryData } from '../../../../hooks/useGallery'
import { useToast } from '../../../../components/ui/Toast'

export default function GalleryPage() {
  const { addToast } = useToast()
  const {
    gallery,
    isLoading,
    mutations: { uploadItems, deleteItem, deleteItems }
  } = useGalleryData()

  const [selectedItems, setSelectedItems] = useState([])
  const [uploadProgress, setUploadProgress] = useState(null)

  const handleUploadMedia = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    // Validation
    const maxFileSize = 50 * 1024 * 1024
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']

    for (const file of files) {
      if (!allowedTypes.some(type => file.type.startsWith(type.split('/')[0]))) {
        addToast(`Invalid file type: ${file.name}`, 'error')
        return
      }
      if (file.size > maxFileSize) {
        addToast(`File too large: ${file.name} (Max 50MB)`, 'error')
        return
      }
    }

    try {
      await uploadItems.mutateAsync({
        files,
        onProgress: (progress) => setUploadProgress(progress)
      })
      addToast(`Successfully uploaded ${files.length} item(s)`, 'success')
      setUploadProgress(null)
    } catch (error) {
      console.error('Upload failed:', error)
      addToast(error.message || 'Upload failed. Please try again.', 'error')
      setUploadProgress(null)
    }
  }

  const handleDeleteMedia = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await deleteItem.mutateAsync(itemId)
      addToast('Item removed from gallery', 'success')
      setSelectedItems(prev => prev.filter(id => id !== itemId))
    } catch (error) {
      console.error('Delete failed:', error)
      addToast('Failed to delete item', 'error')
    }
  }

  const handleBatchDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) return

    try {
      await deleteItems.mutateAsync(selectedItems)
      addToast(`Successfully deleted ${selectedItems.length} items`, 'success')
      setSelectedItems([])
    } catch (error) {
      console.error('Batch delete failed:', error)
      addToast('Failed to delete selected items', 'error')
    }
  }

  const toggleMediaSelect = (mediaId) => {
    setSelectedItems(prev =>
      prev.includes(mediaId) ? prev.filter(id => id !== mediaId) : [...prev, mediaId]
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: theme.colors.accent[500] }} />
        <p className="text-gray-500 font-medium">Loading your masterpiece...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-1 sm:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1
            className="text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            Work Gallery
          </h1>
          <p className="text-gray-600 text-lg">Manage your portfolio and showcase your high-end work</p>
        </div>

        <div className="flex items-center gap-3">
          {selectedItems.length > 0 && (
            <button
              onClick={handleBatchDelete}
              disabled={deleteItems.isPending}
              className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {deleteItems.isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              Delete {selectedItems.length}
            </button>
          )}

          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleUploadMedia}
            className="hidden"
            id="gallery-upload"
            disabled={uploadItems.isPending}
          />
          <label
            htmlFor="gallery-upload"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: theme.colors.accent[600],
              opacity: uploadItems.isPending ? 0.7 : 1
            }}
          >
            {uploadItems.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus size={20} />
            )}
            {uploadItems.isPending ? 'Uploading...' : 'Add to Gallery'}
          </label>
        </div>
      </div>

      {/* Upload Progress Overlay */}
      <AnimatePresence>
        {uploadProgress && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 mb-8 flex items-center gap-6"
          >
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-gray-100"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={175.93}
                  strokeDashoffset={175.93 - (175.93 * uploadProgress.percent) / 100}
                  className="text-blue-600 transition-all duration-300"
                  style={{ color: theme.colors.accent[600] }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                {uploadProgress.percent}%
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Uploading your vision...</p>
              <p className="text-sm text-gray-500">
                Processing item {uploadProgress.current} of {uploadProgress.total}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-inner"
            style={{ backgroundColor: theme.colors.accent[50] }}
          >
            <ImageIcon size={40} style={{ color: theme.colors.accent[300] }} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Your gallery is empty</h3>
          <p className="text-gray-500 mb-8 max-w-sm text-center">Showcase your best moments. Add some high-quality photos or videos to attract more clients.</p>
          <label
            htmlFor="gallery-upload"
            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            Upload your first work
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gallery.map((item, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={item.id || item.publicId}
              className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer"
            >
              {item.type === 'video' ? (
                <div className="w-full h-full">
                  <Image
                    fill
                    src={item.thumbnail}
                    alt="Gallery item"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-all border border-white/40 shadow-xl">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                  {item.duration && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                      <Video size={12} />
                      {item.duration}
                    </div>
                  )}
                </div>
              ) : (
                <Image
                  fill
                  src={item.url}
                  alt="Gallery item"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              )}

              {/* Selection Overlay */}
              <div
                className={`absolute inset-0 transition-all duration-300 ${selectedItems.includes(item.id)
                  ? 'bg-blue-600/20 opacity-100'
                  : 'bg-black/0 group-hover:bg-black/20 opacity-0 group-hover:opacity-100'
                  }`}
                onClick={() => toggleMediaSelect(item.id)}
              >
                <div className="absolute top-4 left-4">
                  <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${selectedItems.includes(item.id)
                    ? 'bg-blue-600 border-blue-600 scale-110'
                    : 'border-white/60 bg-black/20'
                    }`}>
                    {selectedItems.includes(item.id) && <CheckCircle2 size={16} className="text-white" />}
                  </div>
                </div>

                <div className="absolute top-4 right-4 translate-y-2 group-hover:translate-y-0 transition-all opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteMedia(item.id)
                    }}
                    className="p-3 bg-red-500/80 backdrop-blur-md text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
