import { useState } from 'react'

export default function GallerySection({ config, professional, theme, onImageClick }) {
  const [filter, setFilter] = useState('all')
  const layout = config.layout || 'masonry'
  const columns = parseInt(config.columns || '3')
  
  // Mock gallery data - in real app, this would come from professional.gallery
  const galleryItems = professional?.gallery || [
    { id: 1, url: '/api/placeholder/400/600', category: 'portrait', title: 'Portrait Session' },
    { id: 2, url: '/api/placeholder/600/400', category: 'wedding', title: 'Wedding Day' },
    { id: 3, url: '/api/placeholder/400/500', category: 'event', title: 'Corporate Event' },
    { id: 4, url: '/api/placeholder/500/700', category: 'portrait', title: 'Studio Portrait' },
    { id: 5, url: '/api/placeholder/600/500', category: 'wedding', title: 'Reception' },
    { id: 6, url: '/api/placeholder/400/600', category: 'event', title: 'Conference' }
  ]

  const categories = ['all', ...new Set(galleryItems.map(item => item.category))]
  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter)

  const getGridClass = () => {
    const baseClass = `grid gap-4`
    switch (layout) {
      case 'grid':
        return `${baseClass} grid-cols-1 md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns}`
      case 'masonry':
        return `columns-1 md:columns-${Math.min(columns, 3)} lg:columns-${columns} gap-4 space-y-4`
      case 'carousel':
        return 'flex overflow-x-auto gap-4 pb-4'
      default:
        return `${baseClass} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
    }
  }

  return (
    <section className={`py-20 px-4 ${theme.background}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${theme.text} mb-6`}>
            Portfolio
          </h2>
          <p className={`text-lg ${theme.text} opacity-80 max-w-2xl mx-auto`}>
            A curated selection of my finest work, showcasing the artistry and emotion captured in every frame.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all capitalize ${
                filter === category
                  ? `${theme.accent} bg-current/10`
                  : `${theme.text} hover:${theme.accent}`
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className={getGridClass()}>
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`group cursor-pointer ${layout === 'masonry' ? 'break-inside-avoid mb-4' : ''}`}
              onClick={() => onImageClick?.(item.url)}
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-200">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-white">
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm capitalize">{item.category}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className={`px-8 py-4 border-2 ${theme.border} ${theme.text} font-semibold rounded-lg hover:bg-current hover:text-white transition-colors`}>
            Load More Work
          </button>
        </div>
      </div>
    </section>
  )
}