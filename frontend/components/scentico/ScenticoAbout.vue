<script setup lang="ts">
const word = 'VARIANTS'
const letters = word.split('')

const emit = defineEmits<{ 'open-login': [] }>()

const bottles = [
  { id: 'velvet-rose', name: 'Velvet Rose', src: '/scentico/velvet-rose.png', alt: 'Velvet Rose', scene: '/scentico/velvet-rose-bg.mp4', platform: 'linear-gradient(165deg, rgba(196, 128, 132, .65) 0%, rgba(122, 62, 66, .8) 45%, rgba(56, 24, 28, .9) 100%)', badge: 'New', gender: 'Women', desc: 'A velvety rose heart wrapped in soft musk — bold yet effortless.', price: '₱259', layer: '/scentico/realvelvet.png' },
  { id: 'smoke-vanilla', name: 'Smoked Vanilla', src: '/scentico/smoke-vanilla.png', alt: 'Smoked Vanilla', scene: '/scentico/smoke-vanilla-bg.mp4', platform: 'linear-gradient(165deg, rgba(214, 178, 128, .75) 0%, rgba(146, 104, 58, .8) 45%, rgba(74, 48, 22, .85) 100%)', badge: 'Cozy', gender: 'Men', desc: 'Warm smoked vanilla over cedarwood — like firelight in a bottle.', price: '₱259' },
  { id: 'glace-noir', name: 'Glacé Noir', src: '/scentico/asset1.png', alt: 'Glacé Noir', scene: '/scentico/glacier-anime.mp4', platform: 'linear-gradient(165deg, rgba(190, 228, 250, .55) 0%, rgba(120, 180, 215, .4) 45%, rgba(60, 110, 150, .55) 100%)', badge: 'Best Seller', gender: 'Men', desc: 'A cold, strong scent — frosted amber and arctic musk that hits sharp and lingers deep.', price: '₱259', layer: '/scentico/glacier.png' },
  { id: 'amber-noir', name: 'Amber Noir', src: '/scentico/amber-noir.png', alt: 'Amber Noir', scene: '/scentico/amber-noir-bg.mp4', platform: 'linear-gradient(165deg, rgba(120, 96, 62, .65) 0%, rgba(66, 50, 28, .85) 45%, rgba(24, 18, 10, .92) 100%)', badge: 'Bold', gender: 'Men', desc: 'Dark amber and black orchid over spiced resin — confidence after dark.', price: '₱259', layer: '/scentico/amberNoir.png', layerFramed: true },
  { id: 'cedar-veil', name: 'Cedar Veil', src: '/scentico/cedar-veil.png', alt: 'Cedar Veil', scene: '/scentico/cedar-veil-bg.mp4', platform: 'linear-gradient(165deg, rgba(120, 138, 118, .6) 0%, rgba(74, 88, 70, .75) 45%, rgba(38, 48, 36, .85) 100%)', badge: 'Fresh', gender: 'Men', desc: 'White cedar and sea salt veiled in vetiver — a quiet forest mist.', price: '₱259' },
]

const sceneBottles = bottles.filter(b => b.scene)

const active = ref<typeof bottles[number] | null>(null)
const videoEl = ref<HTMLVideoElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

async function syncPanelWidth(): Promise<void> {
  if (!active.value) {
    if (panelRef.value) panelRef.value.style.width = ''
    return
  }
  await nextTick()
  if (titleRef.value && panelRef.value) {
    panelRef.value.style.width = `${titleRef.value.offsetWidth}px`
  }
}

watch(active, () => { syncPanelWidth() })

onMounted(() => {
  videoEl.value?.play().catch(() => {})
  window.addEventListener('resize', syncPanelWidth)
})

function openScene(b: typeof bottles[number]): void { active.value = b }
function closeScene(): void { active.value = null }

function onKey(e: KeyboardEvent): void { if (e.key === 'Escape') closeScene() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', syncPanelWidth)
})
</script>

<template>
  <section id="about" class="relative flex min-h-[100svh] items-start justify-center overflow-hidden bg-[#061018]" :class="{ 'scene-open': active }">
    <video ref="videoEl" class="scene-video absolute inset-0 h-full w-full object-cover" autoplay muted loop playsinline preload="auto" aria-hidden="true">
      <source src="/scentico/glacier.mp4" type="video/mp4" />
    </video>
    <video v-for="b in sceneBottles" :key="`scene-${b.id}`" class="anime-video absolute inset-0 h-full w-full object-cover" autoplay muted loop playsinline preload="auto" aria-hidden="true" :class="{ 'anime-active': active?.id === b.id }">
      <source :src="b.scene!" type="video/mp4" />
    </video>
    <div class="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#060A12]/45 transition-opacity duration-1000" :class="active?.scene ? 'opacity-60' : ''"></div>
    <div class="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_30px_rgba(4,10,18,.3)]"></div>

    <div class="stage relative z-10 mt-[7vh] flex w-full flex-col items-center px-4 text-center transition-all duration-700" :class="active ? 'pointer-events-none scale-[.92] opacity-0 blur-md' : ''">
      <h2 class="variant-wordmark font-display text-[clamp(2.6rem,8.5vw,6.5rem)] font-extrabold uppercase leading-none tracking-[.12em]">
        <span v-for="(ch, ci) in letters" :key="`${ci}`" class="variant-letter" :data-char="ch" :style="{ '--i': ci }">{{ ch }}</span>
      </h2>
      <div class="variant-platform mt-2 h-8 w-[min(64vw,560px)]" aria-hidden="true"></div>

      <button class="variant-promo group" type="button" @click="emit('open-login')" aria-label="Get 15% off your first bottle">
        <span class="variant-promo-tag">Promo</span>
        <span class="variant-promo-text">First bottle gets <strong>15% off</strong> — small batch, slow blended.</span>
        <span class="variant-promo-arrow" aria-hidden="true">
          <svg class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </button>

      <div class="variant-shelf mt-6 md:mt-8" aria-hidden="false">
        <div class="shelf-front">
          <div v-for="(b, bi) in bottles" :key="b.id" class="shelf-bottle" :style="{ '--d': `${0.7 + bi * 0.08}s` }" role="button" tabindex="0" :aria-label="`View ${b.name}`" @click="openScene(b)" @keydown.enter.prevent="openScene(b)">
            <span class="bottle-name" :style="{ '--d': `${1.1 + bi * 0.08}s` }">{{ b.name }}</span>
            <img :src="b.src" :alt="b.alt" class="bottle-img" draggable="false" />
            <div class="bottle-shadow"></div>
            <div class="bottle-reflection" aria-hidden="true"><img :src="b.src" alt="" class="bottle-img" draggable="false" /></div>
          </div>
        </div>
        <div class="shelf-ground" aria-hidden="true"></div>
      </div>
    </div>

    <Transition name="scene">
      <div v-if="active" class="scene-layer absolute inset-0 z-20" @click.self="closeScene">
        <div class="scene-inner relative flex h-full w-full items-center justify-center gap-[3vw] md:gap-[4vw] px-[4vw] md:px-[5vw]">
          <div class="scene-bottle-wrap relative flex h-[58vh] w-[min(38vw,560px)] items-end justify-center" :class="{ 'has-layer': active.layer }">
            <div class="scene-platform" aria-hidden="true" :style="{ background: active.platform }"></div>
            <img v-if="active.layer" :src="active.layer" alt="" class="scene-layer-img" :class="{ 'framed': active.layerFramed }" draggable="false" aria-hidden="true" />
            <img :src="active.src" :alt="active.alt" class="scene-bottle-img" draggable="false" />
            <div class="scene-bottle-shadow" aria-hidden="true"></div>
          </div>
          <div class="scene-right relative flex w-max max-w-[92vw] flex-col items-stretch self-center">
            <h3 ref="titleRef" class="scene-title relative z-10 -mb-5 flex w-max flex-nowrap items-baseline gap-[.05em] overflow-visible whitespace-nowrap font-display text-[clamp(2.1rem,4.4vw,4rem)] font-extrabold uppercase leading-[.9] tracking-[.03em] md:-mb-7">
              <span v-for="(ch, ci) in active.name.toUpperCase().split('')" :key="`t${ci}`" class="scene-title-letter" :data-char="ch === ' ' ? '\u00A0' : ch" :class="ch === ' ' ? 'w-[.3em]' : ''" :style="{ '--i': ci }">{{ ch === ' ' ? '\u00A0' : ch }}</span>
            </h3>
            <div ref="panelRef" class="scene-panel w-full rounded-[24px] border border-white/15 bg-white/[.04] p-8 pt-10 text-left backdrop-blur-xl md:p-10 md:pt-12" :class="{ 'panel-dark': ['glace-noir', 'velvet-rose', 'smoke-vanilla'].includes(active?.id ?? '') }">
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[.66rem] font-bold uppercase tracking-[.2em] text-white shadow-[0_0_14px_rgba(221,234,247,.3)]">
                  <svg class="h-3 w-3 fill-gold-light" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>
                  {{ active.badge }}
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[.66rem] font-bold uppercase tracking-[.2em] text-white/85">
                  <svg class="h-3 w-3 stroke-current" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg>
                  {{ active.gender }}
                </span>
              </div>
              <p class="mt-5 text-[1rem] leading-relaxed text-white/80">{{ active.desc }}</p>
              <div class="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                <div>
                  <span class="block text-[.62rem] font-bold uppercase tracking-[.24em] text-white/50">Price</span>
                  <span class="font-display text-[1.9rem] font-semibold text-white">{{ active.price }}</span>
                </div>
                <button class="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[.78rem] font-extrabold uppercase tracking-[.14em] text-[#0B121E] shadow-[0_10px_28px_rgba(0,0,0,.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#EBF4FF] hover:shadow-[0_14px_34px_rgba(0,0,0,.5)]" @click="emit('open-login')">
                  Buy Now
                  <svg class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </button>
              </div>
              <button class="variant-promo variant-promo--panel group" type="button" @click="emit('open-login')" aria-label="Get 15% off your first bottle">
                <span class="variant-promo-tag">Promo</span>
                <span class="variant-promo-text">First bottle gets <strong>15% off</strong> — small batch, slow blended.</span>
                <span class="variant-promo-arrow" aria-hidden="true">
                  <svg class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </span>
              </button>
            </div>
          </div>
        </div>
        <button class="absolute right-6 top-6 z-30 rounded-full bg-black/40 p-3 text-white backdrop-blur transition hover:bg-black/60" aria-label="Close" @click="closeScene">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.variant-wordmark {
  perspective: 1100px;
}

.variant-letter {
  display: inline-block;
  position: relative;
  transform-style: preserve-3d;
  color: #ffffff;
  -webkit-text-stroke: .5px rgba(255, 255, 255, .95);
  paint-order: stroke fill;
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, .55)) drop-shadow(0 0 34px rgba(214, 241, 255, .35)) drop-shadow(0 10px 18px rgba(0, 0, 0, .5));
  animation: variant-letter-in .8s cubic-bezier(.22, 1, .36, 1) backwards;
  animation-delay: calc(var(--i) * .05s);
}

.variant-letter::after {
  content: attr(data-char);
  position: absolute;
  inset: 0;
  z-index: -1;
  color: #0B1B28;
  -webkit-text-stroke: 0;
  transform: translateZ(-46px);
  text-shadow:
    1px 1px 0 #14293A, 2px 2px 0 #122534, 3px 3px 0 #10202E,
    4px 4px 0 #0E1C28, 5px 5px 0 #0C1822, 6px 6px 0 #0A141C,
    7px 7px 0 #081016, 8px 8px 14px rgba(0, 0, 0, .7);
}

.variant-platform {
  background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(214, 241, 255, .38) 0%, rgba(130, 196, 232, .18) 45%, transparent 72%);
  filter: blur(7px);
  animation: platform-in 1.1s cubic-bezier(.22, 1, .36, 1) backwards;
  animation-delay: .4s;
}

@keyframes platform-in {
  from { opacity: 0; transform: scaleX(.6); }
  to { opacity: 1; transform: scaleX(1); }
}

@keyframes variant-letter-in {
  from { opacity: 0; filter: blur(10px); transform: translateY(20px); }
  to { opacity: 1; filter: blur(0); transform: translateY(0); }
}

.variant-shelf {
  position: relative;
  width: min(94vw, 1180px);
  perspective: 1400px;
  padding-bottom: clamp(120px, 14vw, 180px);
}

.shelf-front {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: clamp(6px, 1.6vw, 22px);
  transform: perspective(1100px) rotateX(3deg) translateY(clamp(18px, 2.6vw, 38px)) scale(1.03);
  transform-origin: 50% 100%;
  transform-style: preserve-3d;
}

.shelf-bottle {
  position: relative;
  height: clamp(170px, 24vw, 320px);
  display: flex;
  align-items: flex-end;
  animation: bottle-stand .9s cubic-bezier(.22, 1, .36, 1) backwards;
  animation-delay: var(--d);
  cursor: pointer;
  padding: 0 clamp(4px, .8vw, 12px) clamp(6px, 1vw, 14px);
  margin: 0 calc(clamp(4px, .8vw, 12px) * -1) calc(clamp(6px, 1vw, 14px) * -1);
}

.shelf-bottle:hover {
  z-index: 5;
}

.bottle-img {
  display: block;
  height: 100%;
  width: auto;
  object-fit: contain;
  user-select: none;
  transition: transform .45s cubic-bezier(.22, 1, .36, 1), filter .45s ease;
  will-change: transform;
}

.shelf-bottle:hover .bottle-img {
  transform: scale(1.12) translateY(-6px);
  filter: drop-shadow(0 18px 30px rgba(2, 8, 14, .55));
}

.shelf-bottle:hover .bottle-reflection {
  transform: scaleY(-.44);
  opacity: .28;
}

.bottle-name {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(6px);
  width: max-content;
  max-width: 160px;
  padding: .35rem .8rem;
  border-radius: 999px;
  border: 1px solid rgba(214, 241, 255, .25);
  background: rgba(6, 16, 24, .55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-size: clamp(.58rem, .9vw, .72rem);
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #EAF6FF;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .4), 0 0 16px rgba(130, 196, 232, .2);
  transition: opacity .3s ease, transform .3s cubic-bezier(.22, 1, .36, 1);
  animation: name-in .5s ease backwards;
  animation-delay: var(--d);
}

.shelf-bottle:hover .bottle-name {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@keyframes name-in {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(6px); }
}

.bottle-shadow {
  position: absolute;
  bottom: -2.5%;
  left: 50%;
  transform: translateX(-50%);
  width: 92%;
  height: 6%;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(2, 8, 14, .6) 0%, rgba(10, 30, 48, .32) 50%, transparent 75%);
  filter: blur(6px);
}

.bottle-reflection {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  transform: scaleY(-.38);
  transform-origin: top;
  opacity: .22;
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, .75), transparent 58%);
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, .75), transparent 58%);
  filter: blur(1.5px) saturate(.85) brightness(1.05);
  pointer-events: none;
  z-index: -1;
  transition: transform .45s cubic-bezier(.22, 1, .36, 1), opacity .45s ease;
}

.shelf-ground {
  position: absolute;
  bottom: clamp(88px, 11.4vw, 148px);
  left: 50%;
  transform: translateX(-50%);
  width: min(90vw, 1080px);
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(214, 241, 255, .28) 18%, rgba(214, 241, 255, .38) 50%, rgba(214, 241, 255, .28) 82%, transparent);
  filter: blur(.5px);
  z-index: 1;
}

@keyframes bottle-stand {
  from { opacity: 0; transform: translateY(26px) scale(.94); filter: blur(6px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

.variant-promo {
  margin-top: clamp(18px, 2.6vw, 30px);
  display: flex;
  align-items: center;
  gap: 1rem;
  width: min(92vw, 760px);
  padding: .8rem .9rem .8rem 1.1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, .4);
  background: rgba(255, 255, 255, .16);
  color: rgba(255, 255, 255, .92);
  text-align: left;
  cursor: pointer;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  transition: border-color .3s ease, background-color .3s ease, transform .3s ease;
  animation: promo-in .7s cubic-bezier(.22, 1, .36, 1) backwards;
  animation-delay: 1.4s;
}

.variant-promo--panel {
  width: 100%;
  margin-top: 1.1rem;
  gap: .6rem;
  padding: .5rem .6rem .5rem .85rem;
  border-color: rgba(255, 255, 255, .45);
  background: rgba(255, 255, 255, .18);
  animation: none;
}

.variant-promo--panel .variant-promo-text {
  font-size: .8rem;
}

.variant-promo--panel .variant-promo-tag {
  padding: .28rem .6rem;
  font-size: .55rem;
}

.variant-promo--panel .variant-promo-arrow {
  width: 28px;
  height: 28px;
}

.variant-promo:hover {
  border-color: rgba(255, 255, 255, .6);
  background: rgba(255, 255, 255, .24);
  transform: translateY(-2px);
}

.variant-promo-tag {
  flex: none;
  font-size: .6rem;
  font-weight: 800;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: #0B121E;
  background: linear-gradient(180deg, #E7C48C, #D4A857);
  padding: .35rem .7rem;
  border-radius: 999px;
}

.variant-promo-text {
  flex: 1 1 auto;
  font-size: clamp(.82rem, 1.4vw, .98rem);
  line-height: 1.3;
}

.variant-promo-text strong {
  color: #fff;
  font-weight: 700;
}

.variant-promo-arrow {
  flex: none;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, .22);
  color: #fff;
  transition: background-color .3s ease, border-color .3s ease;
}

.variant-promo:hover .variant-promo-arrow {
  background: rgba(255, 255, 255, .12);
  border-color: rgba(255, 255, 255, .45);
}

@keyframes promo-in {
  from { opacity: 0; transform: translateY(18px); filter: blur(6px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.scene-video {
  transition: transform 1.2s cubic-bezier(.22, 1, .36, 1), filter 1.2s ease;
  transform-origin: 50% 60%;
}

.scene-open .scene-video {
  transform: scale(1.35);
  filter: brightness(1.05);
}

.anime-video {
  opacity: 0;
  transform: scale(1.18);
  transform-origin: 22% 62%;
  transition: opacity 1.2s ease, transform 1.4s cubic-bezier(.22, 1, .36, 1);
  will-change: opacity, transform;
}

.anime-video.anime-active {
  opacity: 1;
  transform: scale(1.32);
}

.scene-layer { perspective: 1200px; }

.scene-enter-active { transition: opacity .55s ease; }
.scene-leave-active { transition: opacity .4s ease; }
.scene-enter-from, .scene-leave-to { opacity: 0; }

.scene-enter-active .scene-bottle-wrap { animation: bottle-land 1s cubic-bezier(.22, 1, .36, 1) backwards; animation-delay: .15s; }
.scene-enter-active .scene-platform { animation: platform-land .9s cubic-bezier(.22, 1, .36, 1) backwards; animation-delay: .1s; }
.scene-enter-active .scene-panel { animation: panel-in .7s cubic-bezier(.22, 1, .36, 1) backwards; animation-delay: .35s; }
.scene-leave-active .scene-bottle-wrap, .scene-leave-active .scene-right { transition: opacity .3s ease, transform .3s ease; }
.scene-leave-active .scene-bottle-wrap { transform: translateY(30px) scale(.9); opacity: 0; }
.scene-leave-active .scene-right { transform: translateX(40px); opacity: 0; }

.scene-bottle-wrap { position: relative; }

.scene-layer-img {
  position: absolute;
  left: 1%;
  bottom: 2%;
  z-index: 2;
  height: 76%;
  width: auto;
  object-fit: contain;
  transform-origin: bottom center;
  transform: rotate(-7deg) translateX(-6%);
  filter: drop-shadow(0 18px 26px rgba(2, 8, 14, .5));
  pointer-events: none;
}

.scene-layer-img.framed {
  border-radius: 22px;
  border: 1px solid rgba(231, 196, 140, .35);
}

.scene-enter-active .scene-layer-img { animation: layer-in-stand 1s cubic-bezier(.22, 1, .36, 1) backwards; animation-delay: .3s; }

.scene-bottle-wrap.has-layer .scene-platform {
  width: clamp(420px, 42vw, 600px);
}

@keyframes layer-in {
  from { opacity: 0; transform: rotate(-7deg) translateX(-18%) translateY(20px) scale(.9); filter: blur(8px); }
  to { opacity: 1; transform: rotate(-7deg) translateX(-6%) translateY(0) scale(1); filter: blur(0); }
}

@keyframes layer-in-stand {
  from { opacity: 0; transform: rotate(-7deg) translateX(-18%) translateY(30px) scale(.7); filter: blur(10px); }
  to { opacity: 1; transform: rotate(-7deg) translateX(-6%) translateY(0) scale(1); filter: blur(0); }
}

.scene-bottle-img {
  position: relative;
  z-index: 2;
  height: 100%;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 24px 34px rgba(2, 8, 14, .5));
}

.scene-platform {
  position: absolute;
  bottom: -2.5vh;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(360px, 36vw, 520px);
  height: clamp(38px, 4.2vw, 58px);
  border-radius: 14px;
  background: linear-gradient(165deg, rgba(190, 228, 250, .55) 0%, rgba(120, 180, 215, .4) 45%, rgba(60, 110, 150, .55) 100%);
  border: 1px solid rgba(230, 246, 255, .25);
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, .7), inset 0 2px 8px rgba(255, 255, 255, .2);
  z-index: 1;
}

.scene-bottle-shadow {
  position: absolute;
  bottom: -3%;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 5%;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(2, 8, 14, .55) 0%, transparent 72%);
  filter: blur(7px);
  z-index: 3;
}

@keyframes bottle-land {
  from { opacity: 0; transform: translateY(60px) scale(.6); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

@keyframes platform-land {
  from { opacity: 0; transform: translateX(-50%) translateY(30px) scale(.8); }
  to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}

@keyframes panel-in {
  from { opacity: 0; transform: translateX(50px); filter: blur(6px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
}

.scene-panel {
  box-shadow: 0 30px 70px -20px rgba(0, 0, 0, .6), 0 10px 30px -10px rgba(0, 0, 0, .5), inset 0 1px 0 rgba(255, 255, 255, .12);
}

.scene-panel.panel-dark {
  background: rgba(16, 30, 44, .4);
}

.scene-title-letter {
  display: inline-block;
  position: relative;
  color: #ffffff;
  text-shadow: 0 0 12px rgba(255, 255, 255, .8), 0 0 30px rgba(214, 241, 255, .7), 0 4px 14px rgba(0, 0, 0, .55);
  -webkit-text-stroke: .4px rgba(255, 255, 255, .95);
  paint-order: stroke fill;
  animation: title-letter-in .6s cubic-bezier(.22, 1, .36, 1) backwards;
  animation-delay: calc(.3s + var(--i) * .04s);
}

.scene-title-letter::after {
  content: attr(data-char);
  position: absolute;
  inset: 0;
  z-index: -1;
  color: #0A1E2E;
  -webkit-text-stroke: 0;
  transform: translateZ(-30px);
  text-shadow: 1px 1px 0 #12364d, 2px 2px 0 #0d2a40, 3px 3px 0 #0a2134, 4px 4px 8px rgba(0, 0, 0, .6);
}

@keyframes title-letter-in {
  from { opacity: 0; transform: translateY(18px) scale(.92); filter: blur(6px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
</style>
