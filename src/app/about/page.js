import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'
import AboutHero from '../../components/about/AboutHero'
import AboutStory from '../../components/about/AboutStory'
import AboutMission from '../../components/about/AboutMission'
import AboutTeam from '../../components/about/AboutTeam'
import AboutCTA from '../../components/about/AboutCTA'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        <AboutHero />
        <AboutStory />
        <AboutMission />
        <AboutTeam />
        <AboutCTA />
      </main>
      <Footer />
    </div>
  )
}
