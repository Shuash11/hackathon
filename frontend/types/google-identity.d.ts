import type { GoogleCredentialResponse } from './auth'

export interface GoogleIdentityApi {
  initialize(configuration: {
    client_id: string
    callback: (response: GoogleCredentialResponse) => void
  }): void
  renderButton(parent: HTMLElement, options: Record<string, string | number>): void
}

export interface GoogleIdentityClient {
  clientId: string
  load(): Promise<GoogleIdentityApi>
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdentityApi } }
  }
}

declare module '#app' {
  interface NuxtApp {
    $googleIdentity: GoogleIdentityClient
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $googleIdentity: GoogleIdentityClient
  }
}
