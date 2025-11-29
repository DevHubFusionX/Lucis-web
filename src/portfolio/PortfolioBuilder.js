'use client'
import { useState, useCallback } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import PortfolioPreview from './PortfolioPreview'
import PortfolioEditor, { SectionConfig } from './PortfolioEditor'

const SECTION_TYPES = {
  HERO: 'hero',
  GALLERY: 'gallery',
  ABOUT: 'about',
  SERVICES: 'services',
  TESTIMONIALS: 'testimonials',
  CONTACT: 'contact'
}

const DEFAULT_SECTIONS = [
  { id: '1', type: SECTION_TYPES.HERO, order: 0, visible: true, config: {} },
  { id: '2', type: SECTION_TYPES.GALLERY, order: 1, visible: true, config: {} },
  { id: '3', type: SECTION_TYPES.ABOUT, order: 2, visible: true, config: {} },
  { id: '4', type: SECTION_TYPES.CONTACT, order: 3, visible: true, config: {} }
]

export default function PortfolioBuilder({ professional, onSave }) {
  const [sections, setSections] = useState(DEFAULT_SECTIONS)
  const [selectedSection, setSelectedSection] = useState(null)
  const [theme, setTheme] = useState('minimal')
  const [globalSettings, setGlobalSettings] = useState({
    primaryColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    buttonStyle: 'rounded',
    typography: 'modern',
    spacing: 'default',
    socialLinks: {
      instagram: '',
      tiktok: '',
      youtube: '',
      website: '',
      phone: '',
      whatsapp: ''
    }
  })
  const [previewMode, setPreviewMode] = useState(false)
  const [editingModal, setEditingModal] = useState(null)

  const moveSection = useCallback((dragIndex, hoverIndex) => {
    setSections(prev => {
      const newSections = [...prev]
      const draggedSection = newSections[dragIndex]
      newSections.splice(dragIndex, 1)
      newSections.splice(hoverIndex, 0, draggedSection)
      return newSections.map((section, index) => ({ ...section, order: index }))
    })
  }, [])

  const updateSection = useCallback((sectionId, updates) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    ))
  }, [])

  const handleSectionClick = useCallback((section) => {
    setSelectedSection(section)
    setEditingModal(section)
  }, [])

  const closeModal = useCallback(() => {
    setEditingModal(null)
  }, [])

  const addSection = useCallback((type) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      order: sections.length,
      visible: true,
      config: {}
    }
    setSections(prev => [...prev, newSection])
  }, [sections.length])

  const removeSection = useCallback((sectionId) => {
    setSections(prev => prev.filter(section => section.id !== sectionId))
  }, [])

  const handleSave = async () => {
    const portfolioData = {
      sections: sections.filter(s => s.visible),
      theme,
      globalSettings,
      professionalId: professional.id
    }
    await onSave(portfolioData)
  }

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setPreviewMode(false)}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Exit Preview
          </button>
        </div>
        <PortfolioPreview 
          sections={sections.filter(s => s.visible)} 
          theme={theme}
          professional={professional}
        />
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">Portfolio Builder</h1>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600">{professional?.firstName} {professional?.lastName}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(true)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Preview
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Publish
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Sidebar - Settings */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Settings</h2>
            </div>
            
            <PortfolioEditor
              sections={sections}
              selectedSection={selectedSection}
              theme={theme}
              globalSettings={globalSettings}
              onSectionSelect={setSelectedSection}
              onSectionUpdate={updateSection}
              onSectionAdd={addSection}
              onSectionRemove={removeSection}
              onThemeChange={setTheme}
              onGlobalSettingsChange={setGlobalSettings}
              onSectionMove={moveSection}
            />
          </div>

          {/* Center - Live Preview */}
          <div className="flex-1 overflow-auto bg-gray-100">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <PortfolioPreview 
                  sections={sections.filter(s => s.visible)} 
                  theme={theme}
                  globalSettings={globalSettings}
                  professional={professional}
                  isEditing={true}
                  selectedSection={selectedSection}
                  onSectionSelect={handleSectionClick}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Edit Modal */}
        {editingModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  Edit {editingModal.type} Section
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <SectionConfig
                  section={editingModal}
                  onUpdate={updateSection}
                  globalSettings={globalSettings}
                  updateGlobalSetting={setGlobalSettings}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  )
}