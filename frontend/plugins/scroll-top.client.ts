export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }
})
