import type { FetchOptions } from 'ofetch'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type ApiBody = FetchOptions['body']

interface ApiOptions {
  method?: HttpMethod
  body?: ApiBody
  headers?: Record<string, string>
  retryAfterRefresh?: boolean
}

function isUnsafe(method: HttpMethod): boolean {
  return !['GET'].includes(method)
}

/** The sole HTTP boundary for browser and server API requests. */
export function useApi() {
  const config = useRuntimeConfig()
  const csrfToken = useCookie<string | null>('csrftoken')
  const inboundCookie = import.meta.server ? useRequestHeaders(['cookie']).cookie : undefined

  function requestHeaders(additional: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = { ...additional }
    if (inboundCookie) headers.cookie = inboundCookie
    return headers
  }

  function currentCsrfToken(): string | null {
    if (import.meta.server) return csrfToken.value
    const csrfCookie = document.cookie
      .split('; ')
      .find(cookie => cookie.startsWith('csrftoken='))
    return csrfCookie ? decodeURIComponent(csrfCookie.slice('csrftoken='.length)) : null
  }

  async function refresh(): Promise<boolean> {
    try {
      const token = currentCsrfToken()
      await $fetch('/auth/refresh/', {
        baseURL: config.public.apiBaseUrl,
        method: 'POST',
        credentials: 'include',
        headers: requestHeaders(token ? { 'X-CSRFToken': token } : {}),
      })
      return true
    } catch {
      return false
    }
  }

  async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
    const method = options.method ?? 'GET'
    const headers = requestHeaders(options.headers)
    const token = currentCsrfToken()
    if (isUnsafe(method) && token) headers['X-CSRFToken'] = token
    try {
      return await $fetch<T>(path, {
        baseURL: config.public.apiBaseUrl,
        method,
        body: options.body,
        headers,
        credentials: 'include',
      })
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } }).response?.status
      if (status === 401 && options.retryAfterRefresh !== false && await refresh()) {
        return request<T>(path, { ...options, retryAfterRefresh: false })
      }
      throw error
    }
  }

  async function bootstrapCsrf(): Promise<void> {
    await request('/health/', { retryAfterRefresh: false })
  }

  return { request, bootstrapCsrf }
}
