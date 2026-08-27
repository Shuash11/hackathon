<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Settings | Scentico' })

const { auth } = useAuth()
const isAdmin = computed(() => auth.user?.role === 'admin')

const profile = reactive({
  name: auth.user ? `${auth.user.first_name ?? ''} ${auth.user.last_name ?? ''}`.trim() || 'Joashua Barimao' : 'Joashua Barimao',
  email: auth.user?.email || 'joashuabarimao10@gmail.com',
  phone: '+63 917 123 4567',
})
const savedProfile = ref(false)
function saveProfile(): void {
  savedProfile.value = true
  setTimeout(() => { savedProfile.value = false }, 2000)
}

const notifications = reactive([
  { key: 'orders', label: 'Order updates', hint: 'Packed, shipped, and out-for-delivery alerts', on: true },
  { key: 'promos', label: 'Promos & flash sales', hint: 'Bundle deals like 2 for ₱529', on: true },
  { key: 'newsletter', label: 'Monthly newsletter', hint: 'New scent drops and blending stories', on: false },
])
function toggle(key: string): void {
  const item = notifications.find(n => n.key === key)
  if (item) item.on = !item.on
}

const store = reactive({ name: 'Scentico Atelier', supportEmail: 'support@scentico.ph', codEnabled: true, freeShipMin: 529 })
const savedStore = ref(false)
function saveStore(): void {
  savedStore.value = true
  setTimeout(() => { savedStore.value = false }, 2000)
}

const password = reactive({ current: '', next: '', confirm: '' })
const pwError = ref('')
const pwSaved = ref(false)
function savePassword(): void {
  if (!password.current || !password.next) { pwError.value = 'Fill in your current and new password.'; return }
  if (password.next.length < 8) { pwError.value = 'New password must be at least 8 characters.'; return }
  if (password.next !== password.confirm) { pwError.value = 'New passwords do not match.'; return }
  pwError.value = ''
  pwSaved.value = true
  Object.assign(password, { current: '', next: '', confirm: '' })
  setTimeout(() => { pwSaved.value = false }, 2000)
}

interface Address { id: number; label: string; line: string; default: boolean }
const addresses = ref<Address[]>([
  { id: 1, label: 'Home', line: '123 Katipunan Ave, Quezon City, Metro Manila 1108', default: true },
  { id: 2, label: 'Office', line: 'Unit 2107, One Global Place, BGC, Taguig 1634', default: false },
])
function makeDefault(id: number): void {
  addresses.value.forEach(a => { a.default = a.id === id })
}

const payments = [
  { id: 1, kind: 'GCash', detail: '•••• 4567', default: true },
  { id: 2, kind: 'Visa', detail: '•••• 8842 · Exp 09/28', default: false },
]
</script>

<template>
  <div>
    <header class="pb-6">
      <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#4056E8]">Settings</p>
      <h1 class="mt-2 font-display text-3xl font-semibold leading-tight text-[#14161B] sm:text-4xl">Account & workspace</h1>
      <p class="mt-2 text-sm leading-6 text-slate-500">Manage your profile, notifications, security, and store preferences.</p>
    </header>

    <div class="grid gap-5 lg:grid-cols-2">
      <!-- Profile -->
      <section class="dash-card p-6" aria-label="Profile settings">
        <h2 class="font-display text-lg font-semibold text-[#14161B]">Profile</h2>
        <p class="mt-0.5 text-[13px] text-slate-500">How you appear across Scentico.</p>
        <div class="mt-4 flex items-center gap-4">
          <span class="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] text-lg font-bold text-white shadow-[0_6px_20px_rgba(74,98,246,.35)]">
            {{ profile.name.split(' ').map(w => w[0]).slice(0, 2).join('') }}
          </span>
          <div class="min-w-0 flex-1 space-y-3">
            <label class="block">
              <span class="mb-1 block text-xs font-bold text-slate-500">Full name</span>
              <input v-model="profile.name" type="text" class="w-full rounded-xl border border-[#E9ECF2] bg-white px-3.5 py-2.5 text-sm text-[#14161B] focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15">
            </label>
          </div>
        </div>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1 block text-xs font-bold text-slate-500">Email</span>
            <input v-model="profile.email" type="email" class="w-full rounded-xl border border-[#E9ECF2] bg-white px-3.5 py-2.5 text-sm text-[#14161B] focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15">
          </label>
          <label class="block">
            <span class="mb-1 block text-xs font-bold text-slate-500">Phone</span>
            <input v-model="profile.phone" type="tel" class="w-full rounded-xl border border-[#E9ECF2] bg-white px-3.5 py-2.5 text-sm text-[#14161B] focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15">
          </label>
        </div>
        <button type="button" class="mt-4 rounded-xl bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-105" @click="saveProfile">
          {{ savedProfile ? 'Saved ✓' : 'Save profile' }}
        </button>
      </section>

      <!-- Notifications -->
      <section class="dash-card p-6" aria-label="Notification settings">
        <h2 class="font-display text-lg font-semibold text-[#14161B]">Notifications</h2>
        <p class="mt-0.5 text-[13px] text-slate-500">Choose what lands in your inbox.</p>
        <ul class="mt-4 space-y-1">
          <li v-for="n in notifications" :key="n.key" class="flex items-center justify-between gap-4 rounded-xl px-2 py-3 transition hover:bg-slate-50">
            <div class="min-w-0">
              <p class="text-sm font-semibold text-[#14161B]">{{ n.label }}</p>
              <p class="text-xs text-slate-500">{{ n.hint }}</p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="n.on"
              class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
              :class="n.on ? 'bg-[#4056E8]' : 'bg-slate-200'"
              @click="toggle(n.key)"
            >
              <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" :class="n.on ? 'left-[22px]' : 'left-0.5'" />
            </button>
          </li>
        </ul>
      </section>

      <!-- Security -->
      <section class="dash-card p-6" aria-label="Security settings">
        <h2 class="font-display text-lg font-semibold text-[#14161B]">Security</h2>
        <p class="mt-0.5 text-[13px] text-slate-500">Keep your account protected.</p>
        <div class="mt-4 space-y-3">
          <label class="block">
            <span class="mb-1 block text-xs font-bold text-slate-500">Current password</span>
            <input v-model="password.current" type="password" placeholder="••••••••" class="w-full rounded-xl border border-[#E9ECF2] bg-white px-3.5 py-2.5 text-sm text-[#14161B] placeholder:text-slate-300 focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15">
          </label>
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="block">
              <span class="mb-1 block text-xs font-bold text-slate-500">New password</span>
              <input v-model="password.next" type="password" placeholder="Min. 8 characters" class="w-full rounded-xl border border-[#E9ECF2] bg-white px-3.5 py-2.5 text-sm text-[#14161B] placeholder:text-slate-300 focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15">
            </label>
            <label class="block">
              <span class="mb-1 block text-xs font-bold text-slate-500">Confirm</span>
              <input v-model="password.confirm" type="password" placeholder="Repeat it" class="w-full rounded-xl border border-[#E9ECF2] bg-white px-3.5 py-2.5 text-sm text-[#14161B] placeholder:text-slate-300 focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15">
            </label>
          </div>
        </div>
        <p v-if="pwError" role="alert" class="mt-3 text-xs font-semibold text-rose-600">{{ pwError }}</p>
        <button type="button" class="mt-4 rounded-xl border border-[#E9ECF2] bg-white px-5 py-2.5 text-sm font-bold text-[#14161B] transition hover:border-[#4056E8]/40 hover:text-[#4056E8]" @click="savePassword">
          {{ pwSaved ? 'Password updated ✓' : 'Update password' }}
        </button>
      </section>

      <!-- Addresses -->
      <section class="dash-card p-6" aria-label="Saved addresses">
        <h2 class="font-display text-lg font-semibold text-[#14161B]">Addresses</h2>
        <p class="mt-0.5 text-[13px] text-slate-500">Where your parcels land.</p>
        <ul class="mt-4 space-y-3">
          <li v-for="a in addresses" :key="a.id" class="flex items-start justify-between gap-3 rounded-xl border p-4 transition" :class="a.default ? 'border-[#4056E8]/30 bg-[#F8F9FF]' : 'border-[#E9ECF2] bg-white'">
            <div class="min-w-0">
              <p class="text-sm font-bold text-[#14161B]">{{ a.label }} <span v-if="a.default" class="ml-1 rounded-full bg-[#EDF0FE] px-2 py-0.5 text-[10px] font-bold text-[#4056E8]">Default</span></p>
              <p class="mt-0.5 text-[13px] leading-5 text-slate-500">{{ a.line }}</p>
            </div>
            <button v-if="!a.default" type="button" class="shrink-0 rounded-lg border border-[#E9ECF2] px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-[#4056E8]/40 hover:text-[#4056E8]" @click="makeDefault(a.id)">Set default</button>
          </li>
        </ul>
        <button type="button" class="mt-4 w-full rounded-xl border-2 border-dashed border-[#DFE4EE] py-2.5 text-sm font-bold text-slate-500 transition hover:border-[#4056E8]/50 hover:text-[#4056E8]">+ Add new address</button>
      </section>

      <!-- Payment methods -->
      <section class="dash-card p-6" aria-label="Payment methods">
        <h2 class="font-display text-lg font-semibold text-[#14161B]">Payment methods</h2>
        <p class="mt-0.5 text-[13px] text-slate-500">Saved wallets and cards.</p>
        <ul class="mt-4 space-y-3">
          <li v-for="p in payments" :key="p.id" class="flex items-center justify-between rounded-xl border border-[#E9ECF2] bg-white p-4">
            <div class="flex items-center gap-3">
              <span class="grid h-10 w-14 place-items-center rounded-lg bg-[#F1F3F7] text-[11px] font-bold text-slate-600">{{ p.kind }}</span>
              <div>
                <p class="text-sm font-semibold text-[#14161B]">{{ p.kind }} {{ p.detail }}</p>
                <p v-if="p.default" class="text-xs font-semibold text-[#4056E8]">Default</p>
              </div>
            </div>
            <button type="button" class="rounded-lg border border-[#E9ECF2] px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:text-rose-600">Remove</button>
          </li>
        </ul>
      </section>

      <!-- Store settings (admin only) -->
      <section v-if="isAdmin" class="dash-card p-6 lg:col-span-2" aria-label="Store settings">
        <h2 class="font-display text-lg font-semibold text-[#14161B]">Store settings</h2>
        <p class="mt-0.5 text-[13px] text-slate-500">Storefront preferences for customers.</p>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1 block text-xs font-bold text-slate-500">Store name</span>
            <input v-model="store.name" type="text" class="w-full rounded-xl border border-[#E9ECF2] bg-white px-3.5 py-2.5 text-sm text-[#14161B] focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15">
          </label>
          <label class="block">
            <span class="mb-1 block text-xs font-bold text-slate-500">Support email</span>
            <input v-model="store.supportEmail" type="email" class="w-full rounded-xl border border-[#E9ECF2] bg-white px-3.5 py-2.5 text-sm text-[#14161B] focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15">
          </label>
          <label class="block">
            <span class="mb-1 block text-xs font-bold text-slate-500">Free shipping minimum (₱)</span>
            <input v-model.number="store.freeShipMin" type="number" min="0" class="w-full rounded-xl border border-[#E9ECF2] bg-white px-3.5 py-2.5 text-sm text-[#14161B] focus:border-[#4056E8] focus:outline-none focus:ring-2 focus:ring-[#4056E8]/15">
          </label>
          <div class="flex items-center justify-between rounded-xl border border-[#E9ECF2] bg-white px-4 py-3">
            <div>
              <p class="text-sm font-semibold text-[#14161B]">Cash on delivery</p>
              <p class="text-xs text-slate-500">Let customers pay at the door</p>
            </div>
            <button type="button" role="switch" :aria-checked="store.codEnabled" class="relative h-6 w-11 shrink-0 rounded-full transition-colors" :class="store.codEnabled ? 'bg-[#4056E8]' : 'bg-slate-200'" @click="store.codEnabled = !store.codEnabled">
              <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" :class="store.codEnabled ? 'left-[22px]' : 'left-0.5'" />
            </button>
          </div>
        </div>
        <button type="button" class="mt-4 rounded-xl bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-105" @click="saveStore">
          {{ savedStore ? 'Saved ✓' : 'Save store settings' }}
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dash-card {
  border-radius: 16px;
  border: 1px solid #E9ECF2;
  background: #fff;
  box-shadow: 0 1px 2px rgba(23, 26, 63, .04);
}
</style>