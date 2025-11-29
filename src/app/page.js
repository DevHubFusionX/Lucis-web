'use client'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import HowItWorks from '../components/landing/HowItWorks'
import FeaturesAndBenefits from '../components/landing/FeaturesAndBenefits'
import Testimonials from '../components/landing/Testimonials'
import Services from '../components/landing/Services'
import FAQ from '../components/landing/FAQ'
import Footer from '../components/landing/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      <HeroSection />
      <Services />
      <HowItWorks />
      <FeaturesAndBenefits />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  )
}