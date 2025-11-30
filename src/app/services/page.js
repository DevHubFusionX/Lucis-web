import Navbar from '../../components/landing/Navbar'
import ServicesHero from '../../components/services/ServicesHero'
import ServicesGrid from '../../components/services/ServicesGrid'
import FeaturesSection from '../../components/services/FeaturesSection'
import ServicesCTA from '../../components/services/ServicesCTA'
import Footer from '../../components/landing/Footer'
export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <ServicesHero />
        <ServicesGrid />
        <FeaturesSection />
        <ServicesCTA />
      </div>
      <Footer/>
    </div>
  )
}
