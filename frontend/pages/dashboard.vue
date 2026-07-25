<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
const { auth } = useAuth()
</script>

<template>
  <section aria-labelledby="dashboard-title">
    <p class="font-semibold text-brand-600">Workspace</p>
    <h1 id="dashboard-title" class="mt-2 text-3xl font-bold">Welcome{{ auth.user ? `, ${auth.user.first_name || auth.user.email}` : '' }}</h1>
    <div class="mt-8 rounded-panel bg-white p-6 shadow-panel"><h2 class="text-lg font-semibold">Your foundation is ready</h2><p class="mt-2 text-muted">Add concept-specific features as focused modules when your product is defined.</p></div>
  </section>
</template>
