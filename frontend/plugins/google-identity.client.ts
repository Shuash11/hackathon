import type { GoogleIdentityApi, GoogleIdentityClient } from '~/types/google-identity'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  async function load(): Promise<GoogleIdentityApi> {
    if (!config.public.googleClientId) throw new Error('Google Identity is not configured.')
    if (window.google?.accounts.id) return window.google.accounts.id
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Google Identity could not be loaded.'))
      document.head.appendChild(script)
    })
    if (!window.google?.accounts.id) throw new Error('Google Identity is unavailable.')
    return window.google.accounts.id
  }

  const googleIdentity: GoogleIdentityClient = { load, clientId: config.public.googleClientId }
  return { provide: { googleIdentity } }
})
