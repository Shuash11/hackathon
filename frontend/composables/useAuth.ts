import type { GoogleCredentialResponse, UserResponse } from '~/types/auth'
import { safeInternalRedirect } from '~/utils/redirect'

export function useAuth() {
  const api = useApi()
  const auth = useAuthStore()

  async function loadCurrentUser(): Promise<void> {
    try {
      const response = await api.request<UserResponse>('/auth/me/')
      auth.setUser(response.user)
    } catch {
      auth.clear()
    }
  }

  async function signInWithGoogle(credential: GoogleCredentialResponse): Promise<void> {
    const response = await api.request<UserResponse>('/auth/google/', {
      method: 'POST', body: credential, retryAfterRefresh: false,
    })
    auth.setUser(response.user)
  }

  async function signOut(): Promise<void> {
    try {
      await api.request('/auth/logout/', { method: 'POST' })
    } finally {
      auth.clear()
    }
  }

  async function bootstrapCsrf(): Promise<void> {
    await api.bootstrapCsrf()
  }

  async function redirectAfterLogin(candidate: unknown): Promise<void> {
    await navigateTo(safeInternalRedirect(candidate) || '/dashboard')
  }

  return { auth, loadCurrentUser, signInWithGoogle, signOut, bootstrapCsrf, redirectAfterLogin }
}
