export default defineNuxtRouteMiddleware(async to => {
  const { auth, loadCurrentUser } = useAuth()
  if (!auth.initialized) await loadCurrentUser()
  if (!auth.isAuthenticated) return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
})
