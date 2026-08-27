import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      if (to.hash.includes('access_token') || to.hash.includes('refresh_token') || to.hash.includes('='))
        return { top: 0 }
      try {
        if (document.querySelector(to.hash)) return { el: to.hash, behavior: 'smooth' }
      } catch {}
      return { top: 0 }
    }
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
}
