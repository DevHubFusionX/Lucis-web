'use client'
import { authData } from '../../../data/authData'
import AuthLayout from '../../../components/auth/AuthLayout'
import TestimonialPanel from '../../../components/auth/TestimonialPanel'
import ProfessionalSignupForm from '../../../components/auth/ProfessionalSignupForm'
import { useAuth } from '../../../hooks/useAuth'

export default function ProfessionalSignupPage() {
  const { signup } = useAuth()

  const handleSignup = async (formData) => {
    try {
      return await signup(formData, 'professional')
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthLayout backgroundVideo="/loop.mp4">
      <TestimonialPanel 
        testimonial={authData.professional.signup.testimonial}
        overlayCard={authData.professional.signup.overlayCard}
        isSignup={true}
      />
      <ProfessionalSignupForm 
        formData={authData.professional.signup.form}
        onSubmit={handleSignup}
        loginLink="/professional-login"
      />
    </AuthLayout>
  )
}
