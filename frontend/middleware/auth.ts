export default defineNuxtRouteMiddleware(async to => {
  if (import.meta.server) return
  const { auth, loadCurrentUser } = useAuth()
  if (!auth.initialized) await loadCurrentUser()
  if (!auth.isAuthenticated) return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
})
