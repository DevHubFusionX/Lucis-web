'use client'
import { authData } from '../../../data/authData'
import AuthLayout from '../../../components/auth/AuthLayout'
import TestimonialPanel from '../../../components/auth/TestimonialPanel'
import SignupForm from '../../../components/auth/SignupForm'
import { useAuth } from '../../../hooks/useAuth'

export default function ClientSignupPage() {
  const { signup } = useAuth()

  const handleSignup = async (formData) => {
    return await signup(formData, 'client')
  }

  return (
    <AuthLayout backgroundVideo="/loop.mp4">
      <TestimonialPanel 
        testimonial={authData.client.signup.testimonial}
        overlayCard={authData.client.signup.overlayCard}
        isSignup={true}
      />

      <SignupForm 
        formData={authData.client.signup.form}
        onSubmit={handleSignup}
        loginLink="/client-login"
        isProfessional={false}
      />
    </AuthLayout>
  )
}
