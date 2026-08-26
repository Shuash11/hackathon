<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Scentico - Fragrance, Bottled Slowly',
  meta: [{ name: 'description', content: 'Small-batch fragrances blended slowly in warm tones of coffee, amber and peach.' }],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,600;1,600&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap' },
  ],
})

const page = ref<HTMLElement | null>(null)
const loginOpen = ref(false)
useScenticoReveal(page)

onMounted(() => {
  if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
})
</script>

<template>
  <div ref="page" class="scentico-page min-h-screen overflow-x-hidden bg-cream font-body leading-relaxed text-espresso antialiased">
    <ScenticoHeader @open-login="loginOpen = true" />
    <main><ScenticoHero /><ScenticoAbout /><ScenticoPromoGallery /><ScenticoContact /></main>
    <ScenticoFooter @open-login="loginOpen = true" />
    <ScenticoLoginModal v-model="loginOpen" />
  </div>
</template>
