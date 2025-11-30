import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'
import ContactHero from '../../components/contact/ContactHero'
import ContactForm from '../../components/contact/ContactForm'
import ContactInfo from '../../components/contact/ContactInfo'
import ContactFAQ from '../../components/contact/ContactFAQ'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <ContactHero />
        <ContactForm />
        <ContactInfo />
        <ContactFAQ />
      </main>
      <Footer />
    </div>
  )
}
