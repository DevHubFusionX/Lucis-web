'use client'
import { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'

export default function TestUIPage() {
  const { addToast } = useToast()
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">UI Component Test</h1>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Toast Notifications</h2>
        <div className="flex space-x-4">
          <button 
            onClick={() => addToast('This is an info toast', 'info')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Info Toast
          </button>
          <button 
            onClick={() => addToast('This is a success toast', 'success')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Success Toast
          </button>
          <button 
            onClick={() => addToast('This is an error toast', 'error')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Error Toast
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h3 className="font-bold mb-2">Basic Card</h3>
            <p className="text-gray-600">This is a basic card component.</p>
          </Card>
          <Card className="bg-blue-50 border-blue-100">
            <h3 className="font-bold mb-2 text-blue-900">Styled Card</h3>
            <p className="text-blue-700">This card has custom classes.</p>
          </Card>
          <Card hover={false}>
            <h3 className="font-bold mb-2">No Hover Effect</h3>
            <p className="text-gray-600">This card does not animate on hover.</p>
          </Card>
        </div>
      </section>

      <section className="space-y-4 max-w-md">
        <h2 className="text-xl font-semibold">Inputs</h2>
        <Input 
          label="Standard Input" 
          placeholder="Type something..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Input 
          label="Error State" 
          placeholder="Invalid input" 
          error="This field is required"
        />
      </section>
    </div>
  )
}
