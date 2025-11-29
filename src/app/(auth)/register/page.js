'use client'

import Link from 'next/link'

export default function RegisterPage () {
  return (
    <div>
      <h2 className='text-2xl font-bold text-center text-gray-900 mb-6'>
        Create your account
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
            htmlFor='userType'
            className='block text-sm font-medium text-gray-700'
          >
            I am a
          </label>
          <select
            id='userType'
            name='userType'
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          >
            <option value='client'>Client looking for photographer</option>
            <option value='photographer'>Professional photographer</option>
          </select>
        </div>

        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700'
          >
            Full name
          </label>
          <input
            id='name'
            name='name'
            type='text'
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

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
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        <button
          type='submit'
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          Create account
        </button>
      </form>

      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='font-medium text-blue-600 hover:text-blue-500'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
