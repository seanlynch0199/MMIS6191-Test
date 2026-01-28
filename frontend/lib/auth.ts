const TOKEN_KEY = 'auth_token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthed(): boolean {
  return getToken() !== null
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

type FetchOptions = RequestInit & {
  skipAuthRedirect?: boolean
}

export async function authFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const token = getToken()
  const { skipAuthRedirect, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (fetchOptions.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const fullUrl = url.startsWith('/') ? `${BASE_URL}${url}` : url
  const response = await fetch(fullUrl, {
    ...fetchOptions,
    headers,
  })

  if (response.status === 401 && !skipAuthRedirect) {
    clearToken()
    window.location.href = '/admin/login'
    throw new Error('Unauthorized')
  }

  return response
}

export async function adminLogin(password: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid password. Please try again.')
    }
    throw new Error('Login failed. Please try again later.')
  }

  const data = await response.json()
  setToken(data.token)
  return data.token
}
