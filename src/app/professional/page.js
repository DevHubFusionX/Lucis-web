import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'
import ProfessionalHero from '../../components/professional/ProfessionalHero'
import ProfessionalBenefits from '../../components/professional/ProfessionalBenefits'
import ProfessionalHowItWorks from '../../components/professional/ProfessionalHowItWorks'
import ProfessionalTestimonials from '../../components/professional/ProfessionalTestimonials'
import ProfessionalCTA from '../../components/professional/ProfessionalCTA'

export default function ProfessionalPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        <ProfessionalHero />
        <ProfessionalBenefits />
        <ProfessionalHowItWorks />
        <ProfessionalTestimonials />
        <ProfessionalCTA />
      </main>
      <Footer />
    </div>
  )
}
