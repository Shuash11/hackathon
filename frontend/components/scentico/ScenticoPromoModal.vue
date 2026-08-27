<script setup lang="ts">
const emit = defineEmits<{ claim: [] }>()
const open = defineModel<boolean>({ default: false })

const stage = ref<HTMLElement | null>(null)
const tilt = ref({ x: 0, y: 0 })

function onMove(event: MouseEvent): void {
  const el = stage.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width - 0.5
  const py = (event.clientY - rect.top) / rect.height - 0.5
  tilt.value = { x: py * -10, y: px * 14 }
}

function claim(): void {
  open.value = false
  emit('claim')
}

function onEsc(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) open.value = false
}
watch(open, value => {
  if (import.meta.client) document.body.style.overflow = value ? 'hidden' : ''
  if (value) tilt.value = { x: 0, y: 0 }
})
onMounted(() => document.addEventListener('keydown', onEsc))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEsc)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[450] flex items-center justify-center overflow-hidden bg-[rgba(3,8,14,.78)] backdrop-blur-md transition-opacity duration-500"
      :class="open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'"
      @click.self="open = false"
    >
      <!-- 3D stage -->
      <div
        ref="stage"
        class="relative mx-4 w-full max-w-[880px] overflow-hidden rounded-[32px] border border-white/10 bg-[#050D16] shadow-[0_60px_120px_-40px_rgba(0,0,0,.9)]"
        :class="open ? 'stage-in' : ''"
        :style="{ perspective: '1200px' }"
        @mousemove="onMove"
      >
        <!-- Ambient scene video -->
        <video autoplay muted loop playsinline preload="auto" class="absolute inset-0 h-full w-full object-cover opacity-40" aria-hidden="true">
          <source src="/scentico/amber-noir-bg.webm" type="video/webm" />
        </video>
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(94,234,212,.14),transparent_55%),radial-gradient(ellipse_at_20%_80%,rgba(217,119,6,.18),transparent_55%)]" aria-hidden="true"></div>
        <div class="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_40px_rgba(2,6,12,.7)]" aria-hidden="true"></div>

        <button type="button" aria-label="Close promo" class="absolute right-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white/80 backdrop-blur transition hover:bg-white/20 hover:text-white" @click="open = false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-4 w-4"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        <div class="relative z-10 grid gap-6 p-7 sm:p-10 md:grid-cols-[1.05fr_.95fr] md:items-center">
          <!-- Bottles -->
          <div class="bottle-scene relative mx-auto h-[300px] w-full max-w-[340px] sm:h-[360px]" :style="{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }">
            <div class="glow-ring absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden="true"></div>
            <div class="absolute bottom-[16%] left-1/2 h-6 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-md" aria-hidden="true"></div>
            <img src="/scentico/velvet-rose.webp" alt="Velvet Rose" class="bottle bottle-left absolute bottom-[18%] left-[8%] w-[38%] drop-shadow-[0_24px_30px_rgba(0,0,0,.55)]" draggable="false" />
            <img src="/scentico/amber-noir.webp" alt="Amber Noir" class="bottle bottle-right absolute bottom-[14%] right-[8%] w-[42%] drop-shadow-[0_24px_30px_rgba(0,0,0,.55)]" draggable="false" />
            <div class="absolute left-1/2 top-[10%] -translate-x-1/2 rounded-full border border-amber-200/30 bg-[#1A1206]/70 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[.22em] text-amber-200 backdrop-blur">Flash bundle</div>
          </div>

          <!-- Offer card -->
          <div class="offer-card relative rounded-[26px] border border-white/12 bg-white/[.06] p-7 backdrop-blur-xl" :style="{ transform: `rotateX(${tilt.x * 0.5}deg) rotateY(${tilt.y * 0.5}deg)` }">
            <p class="text-[.68rem] font-extrabold uppercase tracking-[.28em] text-white/60">Scentico promo</p>
            <h3 class="mt-3 font-display text-[2.1rem] font-extrabold uppercase leading-[1.02] text-white [text-shadow:0_0_30px_rgba(221,234,247,.35)]">
              Buy 2 perfumes<br>
              <span class="bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent [background-size:200%_100%] motion-safe:animate-[shine_3s_linear_infinite]">for only ₱529</span>
            </h3>
            <div class="mt-3 flex items-center gap-3 text-sm">
              <s class="text-white/45">₱688</s>
              <span class="rounded-full border border-amber-200/40 bg-amber-200/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-200">Save ₱159</span>
              <span class="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white/80">Free shipping</span>
            </div>
            <ul class="mt-5 space-y-2 text-[.9rem] text-white/75">
              <li class="flex items-center gap-2.5"><span class="h-1.5 w-1.5 rounded-full bg-amber-200/80"></span>Velvet Rose — midnight Damask rose</li>
              <li class="flex items-center gap-2.5"><span class="h-1.5 w-1.5 rounded-full bg-amber-200/80"></span>Amber Noir — smoked oud & amber</li>
              <li class="flex items-center gap-2.5"><span class="h-1.5 w-1.5 rounded-full bg-amber-200/80"></span>Small batch · slow blended</li>
            </ul>
            <button type="button" class="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[.8rem] font-extrabold uppercase tracking-[.14em] text-[#0B121E] shadow-[0_14px_34px_rgba(0,0,0,.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#EBF4FF]" @click="claim">
              Sign in to claim
              <svg class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
            <p class="mt-3 text-center text-[.72rem] text-white/45">Signed in? The bundle waits in your cart at ₱529.</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.stage-in { animation: stage-in .55s cubic-bezier(.16,.84,.44,1); }
@keyframes stage-in {
  from { opacity: 0; transform: translateY(26px) scale(.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.bottle-scene { transform-style: preserve-3d; transition: transform .18s ease-out; }
.offer-card { transition: transform .18s ease-out; transform-style: preserve-3d; }
.bottle { animation: bottle-drift 5.5s ease-in-out infinite; transform-style: preserve-3d; }
.bottle-left { --drift: -10px; animation-delay: .4s; }
.bottle-right { --drift: 10px; }
@keyframes bottle-drift {
  0%, 100% { transform: translateY(0) rotateY(var(--ry, 0deg)) translateZ(30px); }
  50% { transform: translateY(var(--drift, -8px)) rotateY(var(--ry, 0deg)) translateZ(30px); }
}
.bottle-left { --ry: 14deg; }
.bottle-right { --ry: -14deg; }
.glow-ring {
  background: conic-gradient(from 0deg, rgba(251,191,36,.0), rgba(251,191,36,.55), rgba(255,255,255,.12), rgba(251,191,36,.55), rgba(251,191,36,0));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
  animation: ring-spin 14s linear infinite;
  filter: drop-shadow(0 0 18px rgba(251,191,36,.35));
}
@keyframes ring-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .bottle, .glow-ring { animation: none !important; }
}
</style>