'use client'
import { useState } from 'react'
import HeroSection from './sections/HeroSection'
import GallerySection from './sections/GallerySection'
import AboutSection from './sections/AboutSection'
import ServicesSection from './sections/ServicesSection'
import PackagesSection from './sections/PackagesSection'
import TestimonialsSection from './sections/TestimonialsSection'
import ReviewsSection from './sections/ReviewsSection'
import ContactSection from './sections/ContactSection'

const SECTION_COMPONENTS = {
  hero: HeroSection,
  gallery: GallerySection,
  about: AboutSection,
  services: ServicesSection,
  packages: PackagesSection,
  testimonials: TestimonialsSection,
  reviews: ReviewsSection,
  contact: ContactSection
}

const THEME_STYLES = {
  minimal: {
    background: 'bg-white',
    text: 'text-gray-900',
    accent: 'text-blue-600',
    border: 'border-gray-200'
  },
  dark: {
    background: 'bg-gray-900',
    text: 'text-white',
    accent: 'text-blue-400',
    border: 'border-gray-700'
  },
  elegant: {
    background: 'bg-gradient-to-br from-gray-50 to-gray-100',
    text: 'text-gray-800',
    accent: 'text-purple-600',
    border: 'border-gray-300'
  },
  bold: {
    background: 'bg-gradient-to-br from-blue-600 to-purple-600',
    text: 'text-white',
    accent: 'text-yellow-300',
    border: 'border-white/20'
  }
}

export default function PortfolioPreview({ 
  sections, 
  theme, 
  globalSettings,
  professional, 
  isEditing = false,
  selectedSection,
  onSectionSelect 
}) {
  const [lightboxImage, setLightboxImage] = useState(null)
  const themeStyles = THEME_STYLES[theme] || THEME_STYLES.minimal
  
  // Apply global settings to theme styles
  const dynamicTheme = globalSettings ? {
    ...themeStyles,
    background: globalSettings.backgroundColor,
    text: globalSettings.textColor,
    accent: globalSettings.primaryColor,
    buttonStyle: globalSettings.buttonStyle,
    typography: globalSettings.typography,
    spacing: globalSettings.spacing
  } : themeStyles

  const sortedSections = sections.sort((a, b) => a.order - b.order)
  
  const getSpacingClass = () => {
    switch (dynamicTheme.spacing) {
      case 'compact': return 'py-12'
      case 'spacious': return 'py-32'
      default: return 'py-20'
    }
  }
  
  const getTypographyClass = () => {
    switch (dynamicTheme.typography) {
      case 'elegant': return 'font-serif'
      case 'bold': return 'font-black'
      default: return 'font-sans'
    }
  }

  return (
    <div 
      className={`min-h-screen ${getTypographyClass()}`}
      style={{ 
        backgroundColor: dynamicTheme.background,
        color: dynamicTheme.text 
      }}
    >
      {sortedSections.map((section) => {
        const SectionComponent = SECTION_COMPONENTS[section.type]
        if (!SectionComponent) return null

        return (
          <div
            key={section.id}
            className={`relative ${
              isEditing && selectedSection?.id === section.id 
                ? 'ring-2 ring-blue-500 ring-offset-2' 
                : ''
            }`}
            onClick={() => isEditing && onSectionSelect?.(section)}
          >
            <SectionComponent
              config={section.config}
              professional={professional}
              theme={dynamicTheme}
              globalSettings={globalSettings}
              spacingClass={getSpacingClass()}
              onImageClick={setLightboxImage}
            />
          </div>
        )
      })}

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Portfolio item"
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}