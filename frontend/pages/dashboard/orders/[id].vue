<script setup lang="ts">
import { useShopOrders } from '~/composables/useShopData'

definePageMeta({ layout: false, middleware: 'auth' })

const route = useRoute()
const { auth } = useAuth()
const isAdmin = computed(() => auth.user?.role === 'admin')
const orders = useShopOrders()

const orderId = Number(route.params.id)
const exists = computed(() => orders.value.some(o => o.id === orderId))
if (!Number.isInteger(orderId) || orderId < 1) {
  throw createError({ statusCode: 404, statusMessage: 'Order not found' })
}

useHead({ title: computed(() => {
  const order = orders.value.find(o => o.id === orderId)
  return `${order?.ref ?? 'Order'} | Scentico`
}) })
</script>

<template>
  <div v-if="exists">
    <AdminShell v-if="isAdmin">
      <div class="mx-auto w-full max-w-[1280px]">
        <OrderDetailBody :is-admin="true" :id="orderId" />
      </div>
    </AdminShell>
    <UserShell v-else>
      <OrderDetailBody :is-admin="false" :id="orderId" />
    </UserShell>
  </div>
</template>