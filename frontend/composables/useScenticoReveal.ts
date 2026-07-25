import type { Ref } from 'vue'

export function useScenticoReveal(root: Readonly<Ref<HTMLElement | null>>): void {
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const elements = Array.from(root.value?.querySelectorAll<HTMLElement>('.reveal') ?? [])
    const showAll = (): void => elements.forEach(element => element.classList.add('is-visible'))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      showAll()
      return
    }

    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })
    elements.forEach(element => observer?.observe(element))
  })

  onBeforeUnmount(() => observer?.disconnect())
}
