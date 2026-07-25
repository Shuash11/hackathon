<script setup lang="ts">
const { auth, signOut } = useAuth()

async function handleSignOut(): Promise<void> {
  await signOut()
  await navigateTo('/')
}
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <nav aria-label="Primary navigation" class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
      <NuxtLink to="/" class="font-bold text-ink">Foundation</NuxtLink>
      <div class="flex items-center gap-4">
        <NuxtLink v-if="!auth.isAuthenticated" to="/login" class="font-semibold text-brand-600 hover:text-brand-700">Sign in</NuxtLink>
        <template v-else>
          <span class="hidden text-sm text-muted sm:inline">{{ auth.user?.email }}</span>
          <button type="button" class="font-semibold text-brand-600 hover:text-brand-700" @click="handleSignOut">Sign out</button>
        </template>
      </div>
    </nav>
  </header>
</template>
