import type { UserResponse } from '~/types/auth'
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

  async function signOut(): Promise<void> {
    try {
      const nuxtApp = useNuxtApp()
      const supabase: unknown = (nuxtApp as unknown as Record<string, unknown>).$supabase
      if (supabase && typeof (supabase as { auth?: { signOut?: () => Promise<unknown> } }).auth?.signOut === 'function') {
        try {
          await (supabase as { auth: { signOut: () => Promise<unknown> } }).auth.signOut()
        } catch {}
      }
    } catch {}
    try {
      await api.request('/auth/logout/', { method: 'POST' })
    } catch {}
    auth.clear()
    if (import.meta.client) {
      try {
        localStorage.removeItem('sb-access-token')
      } catch {}
    }
  }

  async function bootstrapCsrf(): Promise<void> {
    await api.bootstrapCsrf()
  }

  async function redirectAfterLogin(candidate: unknown): Promise<void> {
    await navigateTo(safeInternalRedirect(candidate) || '/dashboard')
  }

  return { auth, loadCurrentUser, signOut, bootstrapCsrf, redirectAfterLogin }
}
