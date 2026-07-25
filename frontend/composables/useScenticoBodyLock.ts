import type { Ref } from 'vue'

export function useScenticoBodyLock(active: Readonly<Ref<boolean>>): void {
  let previousOverflow = ''

  function unlock(): void {
    document.body.style.overflow = previousOverflow
  }

  onMounted(() => {
    watch(active, isActive => {
      if (isActive) {
        previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      } else {
        unlock()
      }
    }, { immediate: true })
  })

  onBeforeUnmount(unlock)
}
