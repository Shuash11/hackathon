import type { User } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const initialized = ref(false)
  const isAuthenticated = computed(() => user.value !== null)

  function setUser(nextUser: User | null): void {
    user.value = nextUser
    initialized.value = true
  }

  function clear(): void {
    setUser(null)
  }

  return { user, initialized, isAuthenticated, setUser, clear }
})
