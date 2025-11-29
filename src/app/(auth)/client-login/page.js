'use client'
import { authData } from '../../../data/authData'
import AuthLayout from '../../../components/auth/AuthLayout'
import TestimonialPanel from '../../../components/auth/TestimonialPanel'
import LoginForm from '../../../components/auth/LoginForm'
import { useAuth } from '../../../hooks/useAuth'

export default function ClientLoginPage() {
  const { login } = useAuth()

  const handleLogin = async (formData) => {
    return await login(formData, 'client')
  }

  return (
    <AuthLayout backgroundImage={authData.client.login.backgroundImage}>
      <TestimonialPanel 
        testimonial={authData.client.login.testimonial}
        overlayCard={authData.client.login.overlayCard}
      />
      <LoginForm 
        formData={authData.client.login.form}
        onSubmit={handleLogin}
        signupLink="/client-signup"
        forgotPasswordLink="/forgot-password"
      />
    </AuthLayout>
  );
  
}