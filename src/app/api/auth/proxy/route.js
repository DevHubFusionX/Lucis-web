import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request) {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirect')

  if (!token && redirectTo) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.json({ authenticated: !!token })
}