'use client'

import Link from 'next/link'

export default function LoginPage () {
  return (
    <div>
      <h2 className='text-2xl font-bold text-center text-gray-900 mb-6'>
        Sign in to your account
      </h2>

      <form
        className='space-y-6'
        onSubmit={e => {
          e.preventDefault()
          // TODO: Add form submission logic
        }}
      >
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'
          >
            Email address
          </label>
          <input
            id='email'
            name='email'
            type='email'
            required
            onInvalid={e =>
              e.target.setCustomValidity('Please enter a valid email address')
            }
            onInput={e => e.target.setCustomValidity('')}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Password
          </label>
          <input
            id='password'
            name='password'
            type='password'
            required
            onInvalid={e => e.target.setCustomValidity('Password is required')}
            onInput={e => e.target.setCustomValidity('')}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        <div className='flex items-center justify-between'>
          <Link
            href='/forgot-password'
            className='text-sm text-blue-600 hover:text-blue-500'
          >
            Forgot your password?
          </Link>
        </div>

        <button
          type='submit'
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          Sign in
        </button>
      </form>

      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600'>
          Don't have an account?{' '}
          <Link
            href='/register'
            className='font-medium text-blue-600 hover:text-blue-500'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
