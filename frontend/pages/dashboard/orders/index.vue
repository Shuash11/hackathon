<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'auth' })

const { auth } = useAuth()
const isAdmin = computed(() => auth.user?.role === 'admin')
</script>

<template>
  <AdminShell v-if="isAdmin">
    <div class="mx-auto w-full max-w-[1280px]">
      <OrdersBody :is-admin="true" />
    </div>
  </AdminShell>
  <UserShell v-else>
    <OrdersBody :is-admin="false" />
  </UserShell>
</template>