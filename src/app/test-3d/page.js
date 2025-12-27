'use client'
import { useEffect, useRef } from 'react'

export default function Test3D() {
  const containerRef = useRef(null)
  const iframeRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !iframeRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
      
      const scale = 0.8 + (scrollProgress * 0.4)
      const rotateY = scrollProgress * 360
      const translateY = (1 - scrollProgress) * 50
      
      iframeRef.current.style.transform = `scale(${scale}) rotateY(${rotateY}deg) translateY(${translateY}px)`
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-gray-100">
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Scroll to see the camera animate</h1>
      </div>
      
      <div ref={containerRef} className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="sketchfab-embed-wrapper">
              <iframe 
                ref={iframeRef}
                title="Nikon Foto Camera" 
                frameBorder="0" 
                allowFullScreen 
                mozallowfullscreen="true" 
                webkitallowfullscreen="true" 
                allow="autoplay; fullscreen; xr-spatial-tracking" 
                xr-spatial-tracking="true"
                execution-while-out-of-viewport="true"
                execution-while-not-rendered="true"
                web-share="true"
                src="https://sketchfab.com/models/00977989eef4469bb813d4637a6375b1/embed"
                className="w-full h-96 transition-transform duration-100 ease-out"
              />
              <p className="text-sm font-normal mt-2 text-gray-600">
                <a 
                  href="https://sketchfab.com/3d-models/nikon-foto-camera-00977989eef4469bb813d4637a6375b1?utm_medium=embed&utm_campaign=share-popup&utm_content=00977989eef4469bb813d4637a6375b1" 
                  target="_blank" 
                  rel="nofollow" 
                  className="font-bold text-blue-500 hover:text-blue-700"
                >
                  Nikon Foto Camera
                </a> by{' '}
                <a 
                  href="https://sketchfab.com/pewkey?utm_medium=embed&utm_campaign=share-popup&utm_content=00977989eef4469bb813d4637a6375b1" 
                  target="_blank" 
                  rel="nofollow" 
                  className="font-bold text-blue-500 hover:text-blue-700"
                >
                  pewkey
                </a> on{' '}
                <a 
                  href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=00977989eef4469bb813d4637a6375b1" 
                  target="_blank" 
                  rel="nofollow" 
                  className="font-bold text-blue-500 hover:text-blue-700"
                >
                  Sketchfab
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-3xl font-bold">Animation complete!</h2>
      </div>
    </div>
  )
}