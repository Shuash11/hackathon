export default defineNuxtPlugin(() => {
  const router = useRouter()
  router.beforeEach((to) => {
    const hash = (to.hash || (typeof window !== 'undefined' ? window.location.hash : '')) as string
    const hasAuthHash = hash.includes('access_token') || hash.includes('refresh_token')
    if (hasAuthHash && to.path !== '/auth/callback') {
      return { path: '/auth/callback', query: to.query, hash: hash as string }
    }
  })
  if (typeof window !== 'undefined') {
    const h = window.location.hash
    const hasAuth = h.includes('access_token') || h.includes('refresh_token')
    if (hasAuth && window.location.pathname !== '/auth/callback') {
      const target = `/auth/callback${window.location.search}${h}`
      window.history.replaceState({}, '', target)
      navigateTo(target, { replace: true })
    }
  }
})
