<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Analytics — Scentico' })

const profile = { name: 'Joashua Barimao', role: 'Atelier owner', initials: 'JB' }
const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

const kpis: { label: string; hint: string; value: string; delta: string; icon: 'orders' | 'user' | 'trend'; pill: string }[] = [
  { label: 'Orders', hint: '18 pending • 324 fulfilled', value: '342', delta: '+8.1%', icon: 'orders', pill: 'bg-emerald-50 text-emerald-700' },
  { label: 'Customers', hint: 'Avg ₱365 per order', value: '1,204', delta: '+5 new', icon: 'user', pill: 'bg-[#EDF0FE] text-[#4056E8]' },
  { label: 'Units in stock', hint: '7 items running low', value: '1,248', delta: 'Low stock 7', icon: 'trend', pill: 'bg-amber-50 text-amber-700' },
]

const kpiMeta = {
  orders: { title: 'Orders this month' },
  user: { title: 'Registered customers' },
  trend: { title: 'Units in stock' },
} as const

const activityToday = [
  { label: 'Velvet Rose order', meta: 'Completed • Paid', amount: '+₱5,940', positive: true },
  { label: 'Amber Noir refund', meta: 'Pending • Review', amount: '−₱4,280', positive: false },
]
const activityYesterday = [
  { label: 'Cedar Veil restock', meta: 'Fulfilled • Shipped', amount: '+₱3,680', positive: true },
  { label: 'Glacé Noir bulk order', meta: 'Completed • Paid', amount: '+₱3,120', positive: true },
]
</script>

<template>
  <div>
    <div class="mx-auto w-full max-w-[1280px]">

      <!-- Page header -->
      <header class="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#4056E8]">Overview</p>
          <h1 class="mt-2 font-display text-3xl font-semibold leading-tight text-[#14161B] sm:text-4xl">Welcome back, {{ profile.name.split(' ')[0] }}</h1>
          <p class="mt-2 text-sm leading-6 text-slate-500">Here’s how your fragrance house is performing today.</p>
        </div>
        <span class="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E9ECF2] bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-600 shadow-[0_1px_2px_rgba(23,26,63,.05)]">
          <DashboardIcon name="bell" class="h-4 w-4" /> {{ today }}
        </span>
      </header>

      <div class="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-6 xl:grid-cols-12">

        <!-- KPI row -->
        <section v-for="k in kpis" :key="k.label" :aria-label="k.label" class="dash-card col-span-1 p-5 md:col-span-2 xl:col-span-4">
          <div class="flex items-start justify-between">
            <span class="grid h-10 w-10 place-items-center rounded-xl border border-[#DFE5FD] bg-[#EEF1FE] text-[#4056E8]"><DashboardIcon :name="k.icon" class="h-[18px] w-[18px]" /></span>
            <span class="rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide" :class="k.pill">{{ k.delta }}</span>
          </div>
          <p class="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{{ kpiMeta[k.icon].title }}</p>
          <p class="mt-1.5 font-display text-[1.9rem] font-semibold leading-none text-[#14161B]">{{ k.value }}</p>
          <p class="mt-1.5 text-[13px] text-slate-500">{{ k.hint }}</p>
        </section>

        <!-- Revenue trend — primary chart -->
        <section class="dash-card col-span-1 flex flex-col p-6 md:col-span-6 xl:col-span-8" aria-label="Revenue trend">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 class="font-display text-lg font-semibold text-[#14161B]">Revenue trend</h2>
              <p class="mt-0.5 text-[13px] text-slate-500">Sales performance · last 7 days</p>
            </div>
            <span class="rounded-full border border-[#DFE5FD] bg-[#EEF1FE] px-3 py-1.5 text-xs font-bold text-[#4056E8]">₱58.0k this week</span>
          </div>

          <div class="flex flex-1 flex-col justify-center pt-4">
            <div class="w-full max-w-[620px] self-center">
              <svg viewBox="0 0 600 190" class="block h-auto w-full" role="img" aria-label="Line chart of daily revenue, Monday to Sunday, peaking Saturday at 6.1 thousand pesos">
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4A62F0" stop-opacity=".22" /><stop offset="100%" stop-color="#4A62F0" stop-opacity="0" /></linearGradient>
                  <linearGradient id="revStroke" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#93A7FF" /><stop offset="100%" stop-color="#3D55F0" /></linearGradient>
                </defs>
                <line x1="40" y1="30" x2="560" y2="30" stroke="#ECEFF6" stroke-width="1" />
                <line x1="40" y1="110" x2="560" y2="110" stroke="#ECEFF6" stroke-width="1" />
                <path d="M40 118 C54.5 114.2 97.8 96.5 126.7 95.0 C155.6 93.5 184.4 111.3 213.3 109.0 C242.2 106.7 271.1 84.2 300.0 81.0 C328.9 77.8 357.8 92.5 386.7 90.0 C415.6 87.5 444.4 68.7 473.3 66.0 C502.2 63.3 545.5 72.7 560.0 74.0 L560 190 L40 190 Z" fill="url(#revFill)" class="area-reveal" />
                <path d="M40 118 C54.5 114.2 97.8 96.5 126.7 95.0 C155.6 93.5 184.4 111.3 213.3 109.0 C242.2 106.7 271.1 84.2 300.0 81.0 C328.9 77.8 357.8 92.5 386.7 90.0 C415.6 87.5 444.4 68.7 473.3 66.0 C502.2 63.3 545.5 72.7 560.0 74.0" fill="none" stroke="url(#revStroke)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="line-draw" />
                <g fill="white" stroke="#4A62F0" stroke-width="2">
                  <circle cx="40" cy="118" r="3.4" class="dot-pop" /><circle cx="126.7" cy="95" r="3.4" class="dot-pop" style="animation-delay:.9s" /><circle cx="213.3" cy="109" r="3.4" class="dot-pop" style="animation-delay:1s" /><circle cx="300" cy="81" r="3.4" class="dot-pop" style="animation-delay:1.1s" /><circle cx="386.7" cy="90" r="3.4" class="dot-pop" style="animation-delay:1.2s" /><circle cx="473.3" cy="66" r="3.4" class="dot-pop" style="animation-delay:1.3s" />
                  <circle cx="560" cy="74" r="5.5" fill="#3344D6" stroke="white" stroke-width="3" class="dot-pop" style="animation-delay:1.4s" />
                </g>
                <circle cx="560" cy="74" r="11" fill="none" stroke="#4A62F0" stroke-width="1.5" class="today-ring" />
              </svg>
              <div class="mt-2 flex justify-between px-1 text-xs font-medium tracking-wide text-slate-400">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span class="flex items-center gap-1 font-bold text-[#14161B]"><span class="h-1.5 w-1.5 rounded-full bg-[#4056E8]" />Sun</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Profile + balance card -->
        <div class="col-span-1 flex flex-col gap-5 md:col-span-6 xl:col-span-4">
          <section class="dash-card p-6" aria-label="Your profile">
            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5B79FF] to-[#3D55F0] text-lg font-bold text-white shadow-[0_6px_20px_rgba(74,98,246,.35)]">{{ profile.initials }}</div>
              <div class="min-w-0">
                <p class="truncate font-display text-lg font-semibold leading-tight text-[#14161B]">{{ profile.name }}</p>
                <p class="text-[13px] text-slate-500">{{ profile.role }}</p>
                <button class="mt-1 text-[13px] font-bold text-[#4056E8] transition hover:text-[#3344D6]">Edit profile</button>
              </div>
            </div>
          </section>

          <!-- Finance-style balance card -->
          <section class="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-[#5B79FF] via-[#475FEF] to-[#3949DB] p-6 text-white shadow-[0_16px_36px_-16px_rgba(64,86,232,.65)]" aria-label="Total revenue">
            <div class="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-white/10" aria-hidden="true" />
            <div class="pointer-events-none absolute -bottom-20 right-10 h-36 w-36 rounded-full bg-white/[.07]" aria-hidden="true" />
            <div class="relative">
              <div class="flex items-center justify-between">
                <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">Total revenue</p>
                <DashboardIcon name="revenue" class="h-5 w-5 text-white/85" />
              </div>
              <p class="mt-3 font-display text-[2rem] font-semibold leading-none">₱124,850</p>
              <p class="mt-1.5 text-[13px] text-white/70">Last 30 days · 342 orders</p>
              <div class="mt-5 grid grid-cols-2 gap-3">
                <div class="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 backdrop-blur">
                  <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">Avg order</p>
                  <p class="mt-0.5 text-sm font-bold">₱365</p>
                </div>
                <div class="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 backdrop-blur">
                  <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">Best day</p>
                  <p class="mt-0.5 text-sm font-bold">Saturday</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Top fragrances — supporting chart -->
        <section class="dash-card col-span-1 p-6 md:col-span-6 xl:col-span-8" aria-label="Top fragrances bar chart">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 class="font-display text-lg font-semibold text-[#14161B]">Top fragrances</h2>
              <p class="mt-0.5 text-[13px] text-slate-500">Units sold · this month</p>
            </div>
            <span class="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">Best seller <span class="h-1.5 w-1.5 rounded-full bg-amber-500" /></span>
          </div>

          <div class="flex justify-center pt-4">
            <div class="w-full max-w-[720px]">
              <div class="flex">
                <div class="flex h-[180px] w-8 shrink-0 flex-col justify-between py-[2px] text-right text-[11px] font-semibold leading-none text-slate-400">
                  <span>125</span><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
                </div>
                <div class="relative flex-1">
                  <div class="absolute inset-0 flex flex-col justify-between py-[2px]">
                    <span class="h-px w-full bg-[#EFF1F6]" /><span class="h-px w-full bg-[#EFF1F6]" /><span class="h-px w-full bg-[#EFF1F6]" /><span class="h-px w-full bg-[#EFF1F6]" /><span class="h-px w-full bg-[#EFF1F6]" /><span class="h-px w-full bg-[#E3E7EF]" />
                  </div>
                  <div class="absolute inset-x-0 top-0 flex h-[180px] items-end justify-between gap-3 px-3 sm:gap-5 sm:px-6">
                    <div class="col flex flex-1 flex-col items-center gap-1.5">
                      <span class="text-xs font-bold tabular-nums text-[#14161B]">120</span>
                      <div class="bar-grow w-full max-w-[56px] rounded-t-md bg-gradient-to-t from-amber-600/90 via-amber-500 to-[#B8863B]" style="height:173px" />
                    </div>
                    <div class="col flex flex-1 flex-col items-center gap-1.5">
                      <span class="text-xs font-bold tabular-nums text-[#14161B]">98</span>
                      <div class="bar-grow w-full max-w-[56px] rounded-t-md bg-gradient-to-t from-emerald-600/90 via-emerald-500 to-teal-400" style="height:141px" />
                    </div>
                    <div class="col flex flex-1 flex-col items-center gap-1.5">
                      <span class="text-xs font-bold tabular-nums text-[#14161B]">85</span>
                      <div class="bar-grow w-full max-w-[56px] rounded-t-md bg-gradient-to-t from-sky-600/90 via-sky-500 to-blue-400" style="height:122px" />
                    </div>
                    <div class="col flex flex-1 flex-col items-center gap-1.5">
                      <span class="text-xs font-bold tabular-nums text-[#14161B]">72</span>
                      <div class="bar-grow w-full max-w-[56px] rounded-t-md bg-gradient-to-t from-violet-600/90 via-violet-500 to-purple-400" style="height:104px" />
                    </div>
                    <div class="col flex flex-1 flex-col items-center gap-1.5">
                      <span class="text-xs font-bold tabular-nums text-[#14161B]">45</span>
                      <div class="bar-grow w-full max-w-[56px] rounded-t-md bg-gradient-to-t from-rose-600/90 via-rose-500 to-rose-400" style="height:65px" />
                    </div>
                  </div>
                  <div class="absolute inset-x-0 bottom-0 h-px bg-[#D8DDE8]" />
                </div>
              </div>
              <div class="ml-8 mt-2 flex justify-between gap-3 px-3 text-[11px] font-medium leading-tight text-slate-500 sm:px-6">
                <span class="flex-1 text-center">Velvet Rose</span><span class="flex-1 text-center">Cedar Veil</span><span class="flex-1 text-center">Amber Noir</span><span class="flex-1 text-center">Smoked Vanilla</span><span class="flex-1 text-center">Glacé Noir</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Recent activity -->
        <section class="dash-card col-span-1 p-6 md:col-span-6 xl:col-span-4" aria-label="Recent activity">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg font-semibold text-[#14161B]">Recent activity</h2>
            <button type="button" class="text-[13px] font-bold text-[#4056E8] transition hover:text-[#3344D6]">View all</button>
          </div>

          <div class="mt-4 space-y-1">
            <p class="px-1 pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Today</p>
            <div v-for="(a, i) in activityToday" :key="'t' + i" class="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-slate-50">
              <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg" :class="a.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'">{{ a.positive ? '↑' : '↓' }}</span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-[#14161B]">{{ a.label }}</p>
                <p class="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-400">{{ a.meta }}</p>
              </div>
              <span class="text-sm font-bold tabular-nums" :class="a.positive ? 'text-emerald-600' : 'text-rose-500'">{{ a.amount }}</span>
            </div>

            <p class="px-1 pt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Yesterday</p>
            <div v-for="(a, i) in activityYesterday" :key="'y' + i" class="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-slate-50">
              <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg" :class="a.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'">{{ a.positive ? '↑' : '↓' }}</span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-[#14161B]">{{ a.label }}</p>
                <p class="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-400">{{ a.meta }}</p>
              </div>
              <span class="text-sm font-bold tabular-nums" :class="a.positive ? 'text-emerald-600' : 'text-rose-500'">{{ a.amount }}</span>
            </div>
          </div>
        </section>

      </div>
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
.line-draw {
  stroke-dasharray: 620;
  stroke-dashoffset: 620;
  animation: line-draw 1.5s cubic-bezier(.45, 0, .3, 1) forwards;
}
@keyframes line-draw { to { stroke-dashoffset: 0; } }
.area-reveal {
  opacity: 0;
  animation: area-reveal .8s ease-out 1.2s forwards;
}
@keyframes area-reveal { to { opacity: 1; } }
.dot-pop {
  transform: scale(0);
  transform-origin: center;
  transform-box: fill-box;
  animation: dot-pop .35s cubic-bezier(.2, 1.4, .4, 1) forwards;
}
@keyframes dot-pop { to { transform: scale(1); } }
.today-ring {
  transform: scale(0);
  transform-origin: center;
  transform-box: fill-box;
  animation: ring-pulse 2s ease-out 1.6s infinite;
}
@keyframes ring-pulse {
  0% { transform: scale(.6); opacity: .8; }
  70% { transform: scale(1.8); opacity: 0; }
  100% { transform: scale(1.8); opacity: 0; }
}
.col .bar-grow {
  transform-origin: bottom;
  animation: bar-grow .85s cubic-bezier(.2, .85, .3, 1.4) backwards;
}
.col:nth-child(1) .bar-grow { animation-delay: .1s; }
.col:nth-child(2) .bar-grow { animation-delay: .2s; }
.col:nth-child(3) .bar-grow { animation-delay: .3s; }
.col:nth-child(4) .bar-grow { animation-delay: .4s; }
.col:nth-child(5) .bar-grow { animation-delay: .5s; }
@keyframes bar-grow {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
</style>
