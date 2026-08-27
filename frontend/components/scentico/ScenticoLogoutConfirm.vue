<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; confirm: [] }>()
const isOpen = computed(() => props.modelValue)
function close(): void {
  emit('update:modelValue', false)
}
function confirm(): void {
  emit('confirm')
}
function onEsc(e: KeyboardEvent): void {
  if (e.key === 'Escape' && isOpen.value) close()
}
watch(isOpen, open => {
  if (open) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
})
onMounted(() => document.addEventListener('keydown', onEsc))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEsc)
  document.body.style.overflow = ''
})
</script>

<template>
  <div
    class="fixed inset-0 z-[500] flex items-center justify-center bg-[rgba(20,11,7,.55)] p-5 backdrop-blur-md transition-opacity duration-300"
    :class="isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'"
    @click.self="close"
  >
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-confirm-title"
      class="relative w-full max-w-[380px] rounded-[24px] border border-cream-deep bg-cream-soft p-7 shadow-[0_32px_80px_-20px_rgba(42,24,16,.5)] transition-transform duration-300 md:p-8"
      :class="isOpen ? 'translate-y-0 scale-100' : 'translate-y-4 scale-[.97]'"
      :aria-hidden="!isOpen"
      :inert="!isOpen"
    >
      <div class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-espresso/10">
        <svg class="h-5 w-5 text-espresso" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
          <path d="M15 17l5-5-5-5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M20 12H9" stroke-linecap="round" />
          <path d="M13 21H6a2 2 0 01-2-2V5a2 2 0 012-2h7" stroke-linecap="round" />
        </svg>
      </div>
      <h2 id="logout-confirm-title" class="mt-4 text-center font-display text-[1.35rem] text-espresso">Sign out?</h2>
      <p class="mx-auto mt-2 max-w-[28ch] text-center text-[.88rem] leading-relaxed text-espresso/60">You’ll need to sign in again to track orders and manage your fragrance profile.</p>
      <div class="mt-6 grid grid-cols-2 gap-3">
        <button type="button" class="rounded-full border border-espresso/15 bg-white px-5 py-3 text-[.82rem] font-bold text-espresso transition hover:bg-espresso/[.06]" @click="close">Cancel</button>
        <button type="button" class="rounded-full bg-espresso px-5 py-3 text-[.82rem] font-bold text-cream-soft shadow-[0_10px_22px_rgba(42,24,16,.35)] transition hover:bg-espresso-soft" @click="confirm">Sign out</button>
      </div>
    </section>
  </div>
</template>
