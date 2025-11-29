'use client'
import { useDrag, useDrop } from 'react-dnd'

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const EyeSlashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
)

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const SECTION_TYPES = {
  HERO: 'hero',
  GALLERY: 'gallery',
  ABOUT: 'about',
  SERVICES: 'services',
  PACKAGES: 'packages',
  TESTIMONIALS: 'testimonials',
  REVIEWS: 'reviews',
  CONTACT: 'contact'
}

const THEMES = [
  { id: 'minimal', name: 'Minimal', preview: 'bg-white' },
  { id: 'dark', name: 'Dark', preview: 'bg-gray-900' },
  { id: 'elegant', name: 'Elegant', preview: 'bg-gradient-to-br from-gray-50 to-gray-100' },
  { id: 'bold', name: 'Bold', preview: 'bg-gradient-to-br from-blue-600 to-purple-600' }
]

function SectionItem({ section, index, onSelect, onUpdate, onRemove, onMove, isSelected }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'section',
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  })

  const [, drop] = useDrop({
    accept: 'section',
    hover: (item) => {
      if (item.index !== index) {
        onMove(item.index, index)
        item.index = index
      }
    }
  })

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`p-3 border rounded-lg cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onSelect(section)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm font-medium capitalize">{section.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUpdate(section.id, { visible: !section.visible })
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {section.visible ? (
              <EyeIcon className="w-4 h-4 text-gray-600" />
            ) : (
              <EyeSlashIcon className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove(section.id)
            }}
            className="p-1 hover:bg-red-100 rounded"
          >
            <TrashIcon className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function SectionConfig({ section, onUpdate, globalSettings, updateGlobalSetting }) {
  if (!section) return null

  const updateConfig = (key, value) => {
    onUpdate(section.id, {
      config: { ...section.config, [key]: value }
    })
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium text-gray-900 capitalize">{section.type} Settings</h3>
      
      {section.type === 'hero' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Header Style</label>
            <select
              value={section.config.headerStyle || 'hero'}
              onChange={(e) => updateConfig('headerStyle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="simple">Simple Header</option>
              <option value="hero">Hero Banner Style</option>
              <option value="card">Profile Card Overlay</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => updateConfig('coverPhoto', e.target.files[0])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={section.config.name || ''}
              onChange={(e) => updateConfig('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input
              type="text"
              value={section.config.tagline || ''}
              onChange={(e) => updateConfig('tagline', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Wedding & Event Photographer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
            <select
              value={section.config.alignment || 'center'}
              onChange={(e) => updateConfig('alignment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={section.config.location || ''}
              onChange={(e) => updateConfig('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="City, State"
            />
          </div>
        </>
      )}

      {section.type === 'gallery' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
            <select
              value={section.config.layout || 'masonry'}
              onChange={(e) => updateConfig('layout', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="grid">Simple Grid</option>
              <option value="masonry">Masonry Layout</option>
              <option value="slider">Full-width Slider</option>
              <option value="carousel">Carousel with Thumbnails</option>
            </select>
          </div>
          {(section.config.layout === 'grid' || section.config.layout === 'masonry') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
              <select
                value={section.config.columns || '3'}
                onChange={(e) => updateConfig('columns', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Spacing</label>
            <select
              value={section.config.spacing || 'normal'}
              onChange={(e) => updateConfig('spacing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="tight">Tight</option>
              <option value="normal">Normal</option>
              <option value="wide">Wide</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={section.config.showCaptions !== false}
                onChange={(e) => updateConfig('showCaptions', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Show Image Captions</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categories (one per line)</label>
            <textarea
              value={section.config.categories?.join('\n') || ''}
              onChange={(e) => updateConfig('categories', e.target.value.split('\n').filter(s => s.trim()))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="weddings\nevents\nportraits"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo Management</label>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100">
                Upload Photos
              </button>
              <button className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                Reorder Photos
              </button>
            </div>
          </div>
        </>
      )}

      {section.type === 'about' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              value={section.config.sectionTitle || ''}
              onChange={(e) => updateConfig('sectionTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="About Me"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={section.config.bio || ''}
              onChange={(e) => updateConfig('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Tell your story..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
            <input
              type="text"
              value={section.config.yearsExperience || ''}
              onChange={(e) => updateConfig('yearsExperience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="5+"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (₦)</label>
            <input
              type="text"
              value={section.config.startingPrice || ''}
              onChange={(e) => updateConfig('startingPrice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="50,000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Services (one per line)</label>
            <textarea
              value={section.config.services?.join('\n') || ''}
              onChange={(e) => updateConfig('services', e.target.value.split('\n').filter(s => s.trim()))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Wedding Photography\nPortrait Sessions\nEvent Coverage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Alignment</label>
            <select
              value={section.config.textAlignment || 'left'}
              onChange={(e) => updateConfig('textAlignment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Bullet Points (one per line)</label>
            <textarea
              value={section.config.bulletPoints?.join('\n') || ''}
              onChange={(e) => updateConfig('bulletPoints', e.target.value.split('\n').filter(s => s.trim()))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Award-winning photographer\n500+ happy clients\nFeatured in magazines"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={section.config.backgroundColor || '#ffffff'}
                onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => updateConfig('backgroundColor', 'transparent')}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Transparent
              </button>
            </div>
          </div>
        </>
      )}

      {section.type === 'packages' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              value={section.config.sectionTitle || ''}
              onChange={(e) => updateConfig('sectionTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Packages"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Design</label>
            <select
              value={section.config.cardDesign || 'shadow'}
              onChange={(e) => updateConfig('cardDesign', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="border">Border</option>
              <option value="shadow">Shadow</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Style</label>
            <select
              value={section.config.cardStyle || 'light'}
              onChange={(e) => updateConfig('cardStyle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={section.config.showPricing !== false}
                onChange={(e) => updateConfig('showPricing', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Show Pricing</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price Note</label>
            <input
              type="text"
              value={section.config.startingPriceNote || ''}
              onChange={(e) => updateConfig('startingPriceNote', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Prices starting from..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Package Management</label>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100">
                Add Package
              </button>
              <button className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100">
                Edit Packages
              </button>
              <button className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100">
                Sort Packages
              </button>
            </div>
          </div>
        </>
      )}

      {section.type === 'reviews' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              value={section.config.sectionTitle || ''}
              onChange={(e) => updateConfig('sectionTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Client Reviews"
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={section.config.showProfilePics !== false}
                onChange={(e) => updateConfig('showProfilePics', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Show Profile Pictures</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={section.config.showAverageRating !== false}
                onChange={(e) => updateConfig('showAverageRating', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Show Average Rating</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <select
              value={section.config.sortOrder || 'newest'}
              onChange={(e) => updateConfig('sortOrder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </>
      )}

      {/* Social Links Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Social Links</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Instagram</label>
            <input
              type="url"
              value={globalSettings.socialLinks?.instagram || ''}
              onChange={(e) => updateGlobalSetting('socialLinks', {...(globalSettings.socialLinks || {}), instagram: e.target.value})}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="https://instagram.com/username"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">TikTok</label>
            <input
              type="url"
              value={globalSettings.socialLinks?.tiktok || ''}
              onChange={(e) => updateGlobalSetting('socialLinks', {...(globalSettings.socialLinks || {}), tiktok: e.target.value})}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="https://tiktok.com/@username"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">YouTube</label>
            <input
              type="url"
              value={globalSettings.socialLinks?.youtube || ''}
              onChange={(e) => updateGlobalSetting('socialLinks', {...(globalSettings.socialLinks || {}), youtube: e.target.value})}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="https://youtube.com/channel/..."
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={globalSettings.socialLinks?.website || ''}
              onChange={(e) => updateGlobalSetting('socialLinks', {...(globalSettings.socialLinks || {}), website: e.target.value})}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="https://yourwebsite.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={globalSettings.socialLinks?.phone || ''}
              onChange={(e) => updateGlobalSetting('socialLinks', {...(globalSettings.socialLinks || {}), phone: e.target.value})}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="+234 xxx xxx xxxx"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp</label>
            <input
              type="tel"
              value={globalSettings.socialLinks?.whatsapp || ''}
              onChange={(e) => updateGlobalSetting('socialLinks', {...(globalSettings.socialLinks || {}), whatsapp: e.target.value})}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="+234 xxx xxx xxxx"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PortfolioEditor({
  sections,
  selectedSection,
  theme,
  globalSettings,
  onSectionSelect,
  onSectionUpdate,
  onSectionAdd,
  onSectionRemove,
  onThemeChange,
  onGlobalSettingsChange,
  onSectionMove
}) {
  const updateGlobalSetting = (key, value) => {
    onGlobalSettingsChange(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Global Theme Settings */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Global Settings</h3>
        
        {/* Primary Color */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">Primary Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={globalSettings.primaryColor}
              onChange={(e) => updateGlobalSetting('primaryColor', e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={globalSettings.primaryColor}
              onChange={(e) => updateGlobalSetting('primaryColor', e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">Background Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={globalSettings.backgroundColor}
              onChange={(e) => updateGlobalSetting('backgroundColor', e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={globalSettings.backgroundColor}
              onChange={(e) => updateGlobalSetting('backgroundColor', e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Text Color */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">Text Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={globalSettings.textColor}
              onChange={(e) => updateGlobalSetting('textColor', e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={globalSettings.textColor}
              onChange={(e) => updateGlobalSetting('textColor', e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Button Style */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">Button Style</label>
          <select
            value={globalSettings.buttonStyle}
            onChange={(e) => updateGlobalSetting('buttonStyle', e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
          >
            <option value="rounded">Rounded</option>
            <option value="square">Square</option>
            <option value="soft">Soft</option>
          </select>
        </div>

        {/* Typography Style */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">Typography</label>
          <select
            value={globalSettings.typography}
            onChange={(e) => updateGlobalSetting('typography', e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
          >
            <option value="modern">Modern</option>
            <option value="elegant">Elegant</option>
            <option value="bold">Bold</option>
          </select>
        </div>

        {/* Spacing */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">Spacing</label>
          <select
            value={globalSettings.spacing}
            onChange={(e) => updateGlobalSetting('spacing', e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
          >
            <option value="compact">Compact</option>
            <option value="default">Default</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>
      </div>

      {/* Theme Presets */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Theme Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => onThemeChange(themeOption.id)}
              className={`p-2 rounded-lg border text-xs ${
                theme === themeOption.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className={`w-full h-8 rounded mb-1 ${themeOption.preview}`}></div>
              {themeOption.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Sections</h3>
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onSectionAdd(e.target.value)
                  e.target.value = ''
                }
              }}
              className="text-xs px-2 py-1 border border-gray-300 rounded"
            >
              <option value="">Add Section</option>
              {Object.values(SECTION_TYPES).map(type => (
                <option key={type} value={type} className="capitalize">{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          {sections.map((section, index) => (
            <SectionItem
              key={section.id}
              section={section}
              index={index}
              isSelected={selectedSection?.id === section.id}
              onSelect={onSectionSelect}
              onUpdate={onSectionUpdate}
              onRemove={onSectionRemove}
              onMove={onSectionMove}
            />
          ))}
        </div>
      </div>

      {/* Section Configuration */}
      <div className="flex-1 overflow-auto">
        <SectionConfig
          section={selectedSection}
          onUpdate={onSectionUpdate}
          globalSettings={globalSettings}
          updateGlobalSetting={updateGlobalSetting}
        />
      </div>
    </div>
  )
}