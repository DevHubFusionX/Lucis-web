'use client'
import { authData } from '../../../data/authData'
import AuthLayout from '../../../components/auth/AuthLayout'
import TestimonialPanel from '../../../components/auth/TestimonialPanel'
import LoginForm from '../../../components/auth/LoginForm'
import { useAuth } from '../../../hooks/useAuth'

export default function ProfessionalLoginPage() {
  const { login } = useAuth()

  const handleLogin = async (formData) => {
    return await login(formData, 'professional')
  }

  return (
    <AuthLayout backgroundImage={authData.professional.login.backgroundImage}>
      <LoginForm 
        formData={authData.professional.login.form}
        onSubmit={handleLogin}
        signupLink="/professional-signup"
        forgotPasswordLink="/forgot-password"
      />

      <TestimonialPanel 
        testimonial={authData.professional.login.testimonial}
        overlayCard={authData.professional.login.overlayCard}
      />
    </AuthLayout>
  )
}