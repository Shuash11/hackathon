<script setup lang="ts">
const productName = 'Glacé Noir'
const productNotes = 'Frosted amber · arctic musk · 48h wear'
const midName = 'Smoked Vanilla'
const midNotes = 'Smoked vanilla · cedarwood · warm amber'
const rightName = 'Amber Noir'
const rightNotes = 'Dark amber · black orchid · spiced resin'
const backLeftName = 'Velvet Rose'
const backLeftNotes = 'Damask rose · pink pepper · soft musk'
const backRightName = 'Cedar Veil'
const backRightNotes = 'White cedar · sea salt · vetiver'

const nameChars = productName.split('')
const noteChars = productNotes.split('')
const midNameChars = midName.split('')
const midNotesChars = midNotes.split('')
const rightNameChars = rightName.split('')
const rightNotesChars = rightNotes.split('')
const backLeftNameChars = backLeftName.split('')
const backLeftNotesChars = backLeftNotes.split('')
const backRightNameChars = backRightName.split('')
const backRightNotesChars = backRightNotes.split('')
</script>

<template>
  <section id="home" class="relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden bg-[#0B0D12]">
    <!-- Cinematic backdrop -->
    <div class="absolute inset-0 -z-20" aria-hidden="true">
      <img src="/scentico/background.webp" alt="" class="hero-bg h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/55"></div>
    </div>
    <!-- Film grain + vignette -->
    <div class="pointer-events-none absolute inset-0 -z-10 opacity-[.07] mix-blend-overlay" aria-hidden="true" style="background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)"></div>
    <div class="pointer-events-none absolute inset-0 -z-10 shadow-[inset_0_0_200px_70px_rgba(5,6,10,.8)]" aria-hidden="true"></div>

    <div class="relative mt-[8vh] flex flex-col items-center px-4">
      <h1 class="scentico-3d text-center font-display text-[clamp(2.8rem,10vw,8.5rem)] font-extrabold uppercase leading-none tracking-[.12em] text-transparent">Scentico</h1>
      <div class="ground-glow mt-1 h-10 w-[min(70vw,640px)]" aria-hidden="true"></div>
    </div>

    <div class="bottle-stage bottle-back-2 group bottle--cedar-veil" aria-hidden="true">
      <div class="bottle-info bottle-info-top bottle-info-teal">
        <span class="info-eyebrow block text-[.7rem] font-bold uppercase tracking-[.3em] text-teal-100/90">Signature N°5</span>
        <strong class="mt-1.5 block font-display text-[1.7rem] leading-tight text-[#DFF3F0]"><span v-for="(ch, i) in backRightNameChars" :key="`br${i}`" class="info-ch inline-block" :style="{ '--i': i }">{{ ch }}</span></strong>
        <span class="mt-1.5 block text-[.85rem] text-[#BFE0DA]/90"><span v-for="(ch, i) in backRightNotesChars" :key="`bo${i}`" class="info-ch inline-block" :style="{ '--i': i + backRightNameChars.length }">{{ ch }}</span></span>
      </div>
      <img src="/scentico/cedar-veil.webp" alt="Cedar Veil — Scentico signature fragrance" class="bottle-img" />
    </div>
    <div class="bottle-stage bottle-back-1 group bottle--velvet-rose" aria-hidden="true">
      <div class="bottle-info bottle-info-top bottle-info-rose">
        <span class="info-eyebrow block text-[.7rem] font-bold uppercase tracking-[.3em] text-rose-200/90">Signature N°4</span>
        <strong class="mt-1.5 block font-display text-[1.7rem] leading-tight text-[#FBE3E8]"><span v-for="(ch, i) in backLeftNameChars" :key="`bl${i}`" class="info-ch inline-block" :style="{ '--i': i }">{{ ch }}</span></strong>
        <span class="mt-1.5 block text-[.85rem] text-[#EFC9D2]/90"><span v-for="(ch, i) in backLeftNotesChars" :key="`bn${i}`" class="info-ch inline-block" :style="{ '--i': i + backLeftNameChars.length }">{{ ch }}</span></span>
      </div>
      <img src="/scentico/velvet-rose.webp" alt="Velvet Rose — Scentico signature fragrance" class="bottle-img" />
    </div>
    <div class="bottle-stage bottle-mid-left group bottle--smoke-vanilla" aria-hidden="true">
      <div class="bottle-info bottle-info-top bottle-info-warm">
        <span class="info-eyebrow block text-[.72rem] font-bold uppercase tracking-[.3em] text-peach-light/90">Signature N°2</span>
        <strong class="mt-1.5 block font-display text-3xl leading-tight text-[#F5E6D3]"><span v-for="(ch, i) in midNameChars" :key="`m${i}`" class="info-ch inline-block" :style="{ '--i': i }">{{ ch }}</span></strong>
        <span class="mt-2 block text-[.95rem] text-[#E3C9A8]/90"><span v-for="(ch, i) in midNotesChars" :key="`s${i}`" class="info-ch inline-block" :style="{ '--i': i + midNameChars.length }">{{ ch }}</span></span>
      </div>
      <img src="/scentico/smoke-vanilla.webp" alt="Smoked Vanilla — Scentico signature fragrance" class="bottle-img" />
    </div>
    <div class="bottle-stage bottle-mid-right group bottle--amber-noir" aria-hidden="true">
      <div class="bottle-info bottle-info-top bottle-info-warm">
        <span class="info-eyebrow block text-[.72rem] font-bold uppercase tracking-[.3em] text-peach-light/90">Signature N°3</span>
        <strong class="mt-1.5 block font-display text-3xl leading-tight text-[#F5E6D3]"><span v-for="(ch, i) in rightNameChars" :key="`r${i}`" class="info-ch inline-block" :style="{ '--i': i }">{{ ch }}</span></strong>
        <span class="mt-2 block text-[.95rem] text-[#E3C9A8]/90"><span v-for="(ch, i) in rightNotesChars" :key="`t${i}`" class="info-ch inline-block" :style="{ '--i': i + rightNameChars.length }">{{ ch }}</span></span>
      </div>
      <img src="/scentico/amber-noir.webp" alt="Amber Noir — Scentico signature fragrance" class="bottle-img" />
    </div>
    <div class="bottle-stage bottle-hero group">
      <div class="bottle-info" aria-hidden="true">
        <span class="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[.72rem] font-bold uppercase tracking-[.22em] text-white shadow-[0_0_18px_rgba(221,234,247,.35)]"><svg class="h-3.5 w-3.5 fill-gold-light" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>Best Seller</span>
        <span class="info-eyebrow block text-[.78rem] font-bold uppercase tracking-[.3em] text-white/80">Signature N°1</span>
        <strong class="mt-1.5 block font-display text-4xl leading-tight text-white"><span v-for="(ch, i) in nameChars" :key="`n${i}`" class="info-ch inline-block" :style="{ '--i': i }">{{ ch === ' ' ? ' ' : ch }}</span></strong>
        <span class="mt-2 block text-[1rem] text-white/85"><span v-for="(ch, i) in noteChars" :key="`d${i}`" class="info-ch inline-block" :style="{ '--i': i + nameChars.length }">{{ ch === ' ' ? ' ' : ch }}</span></span>
      </div>
      <img src="/scentico/asset1.webp" alt="Glacé Noir — Scentico signature fragrance" class="bottle-img" />
      <div class="bottle-tint"></div>
      <div class="bottle-contact"></div>
    </div>
  </section>
</template>

<style scoped>
.hero-bg {
  animation: hero-pan 28s ease-in-out infinite alternate;
}

@keyframes hero-pan {
  from { transform: scale(1) translateY(0); }
  to { transform: scale(1.07) translateY(-1.5%); }
}

.bottle-stage {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -100%);
  aspect-ratio: 1261 / 1247;
  transition: transform .5s cubic-bezier(.22, 1, .36, 1);
  animation: bottle-morph .9s cubic-bezier(.22, 1, .36, 1) backwards;
}

@keyframes bottle-morph {
  from { opacity: 0; transform: translate(-50%, -94%) scale(.92); filter: blur(6px); }
  to { opacity: 1; transform: translate(-50%, -100%) scale(1); filter: blur(0); }
}

.bottle-back-1, .bottle-back-2 { animation-delay: .15s; }
.bottle-mid-left, .bottle-mid-right { animation-delay: .32s; }
.bottle-hero { animation-delay: .5s; }

.bottle-img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.bottle-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(221, 234, 247, .55) 0%, rgba(144, 178, 213, .4) 45%, rgba(52, 88, 127, .55) 100%);
  -webkit-mask-image: url('/scentico/asset1.webp');
  mask-image: url('/scentico/asset1.webp');
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  mix-blend-mode: soft-light;
}

.bottle-contact {
  position: absolute;
  bottom: -2%;
  left: 50%;
  transform: translateX(-50%);
  width: 78%;
  height: 6%;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(6, 31, 57, .55) 0%, rgba(27, 60, 94, .3) 50%, transparent 75%);
  filter: blur(5px);
}

.bottle-hero {
  top: 77%;
  height: 58vh;
  z-index: 10;
  cursor: pointer;
  filter: drop-shadow(0 30px 40px rgba(6, 31, 57, .55));
  transition: transform .5s cubic-bezier(.22, 1, .36, 1), filter .5s ease;
}

.bottle-hero:hover {
  transform: translate(-50%, -100%) scale(1.06);
  filter: drop-shadow(0 34px 48px rgba(6, 31, 57, .65));
}

.bottle-info {
  position: absolute;
  top: 50%;
  right: calc(100% + 3vw);
  transform: translate(16px, -50%);
  width: max-content;
  max-width: 42vw;
  text-align: left;
  padding: 1.4rem 1.75rem;
  border-radius: 18px;
  border: 1px solid rgba(221, 234, 247, .25);
  background: rgba(6, 31, 57, .45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 20px 50px -20px rgba(6, 31, 57, .8);
  opacity: 0;
  pointer-events: none;
  text-shadow: 0 0 14px rgba(255, 255, 255, .75), 0 0 34px rgba(221, 234, 247, .5);
  transition: opacity .45s ease, transform .45s cubic-bezier(.22, 1, .36, 1);
}

.bottle-info .info-eyebrow {
  opacity: 0;
  transition: opacity .3s ease;
}

.bottle-info .info-ch {
  opacity: 0;
  filter: blur(4px);
  white-space: pre;
  transition: opacity .25s ease, filter .25s ease;
}

.bottle-hero:hover .bottle-info,
.bottle-mid-left:hover .bottle-info,
.bottle-mid-right:hover .bottle-info,
.bottle-back-1:hover .bottle-info,
.bottle-back-2:hover .bottle-info {
  opacity: 1;
}

.bottle-hero:hover .bottle-info {
  transform: translate(0, -50%);
}

.bottle-info-top {
  top: auto;
  right: auto;
  bottom: calc(100% + 1.5vh);
  left: 50%;
  transform: translate(-50%, 12px);
  text-align: center;
}

.bottle-info-warm {
  border-color: rgba(240, 195, 154, .3);
  background: linear-gradient(160deg, rgba(46, 26, 12, .62) 0%, rgba(27, 14, 6, .68) 100%);
  box-shadow: 0 20px 50px -20px rgba(0, 0, 0, .8), 0 0 34px -8px rgba(201, 122, 71, .35);
  text-shadow: 0 0 14px rgba(240, 195, 154, .7), 0 0 34px rgba(201, 122, 71, .45);
  overflow: hidden;
}

.bottle-info-warm::after {
  content: '';
  position: absolute;
  top: -40%;
  left: -20%;
  width: 140%;
  height: 80%;
  background: radial-gradient(ellipse 50% 60% at 30% 40%, rgba(240, 195, 154, .14), transparent 70%);
  filter: blur(10px);
  pointer-events: none;
  animation: smoke-drift 7s ease-in-out infinite alternate;
}

@keyframes smoke-drift {
  from { transform: translateX(-4%) rotate(-2deg); opacity: .7; }
  to { transform: translateX(5%) rotate(2deg); opacity: 1; }
}

.bottle-info-rose {
  border-color: rgba(247, 181, 199, .3);
  background: linear-gradient(160deg, rgba(66, 22, 38, .62) 0%, rgba(38, 12, 22, .68) 100%);
  box-shadow: 0 20px 50px -20px rgba(0, 0, 0, .8), 0 0 34px -8px rgba(219, 112, 147, .4);
  text-shadow: 0 0 14px rgba(247, 181, 199, .65), 0 0 34px rgba(219, 112, 147, .4);
}

.bottle-info-teal {
  border-color: rgba(153, 216, 205, .3);
  background: linear-gradient(160deg, rgba(10, 48, 46, .62) 0%, rgba(5, 26, 28, .68) 100%);
  box-shadow: 0 20px 50px -20px rgba(0, 0, 0, .8), 0 0 34px -8px rgba(94, 184, 173, .4);
  text-shadow: 0 0 14px rgba(153, 216, 205, .6), 0 0 34px rgba(94, 184, 173, .4);
}

.bottle-mid-left:hover .bottle-info-top,
.bottle-mid-right:hover .bottle-info-top,
.bottle-back-1:hover .bottle-info-top,
.bottle-back-2:hover .bottle-info-top {
  transform: translate(-50%, 0);
}

.bottle-mid-left:hover,
.bottle-mid-right:hover,
.bottle-back-1:hover,
.bottle-back-2:hover {
  z-index: 12;
  cursor: pointer;
  transform: translate(-50%, -100%) scale(1.06);
  transition: transform .5s cubic-bezier(.22, 1, .36, 1);
}

.bottle-mid-left:hover .bottle-img,
.bottle-mid-right:hover .bottle-img,
.bottle-back-1:hover .bottle-img,
.bottle-back-2:hover .bottle-img {
  filter: saturate(.82) brightness(1.05) contrast(.97);
  transition: filter .4s ease;
}

.bottle-hero:hover .bottle-info .info-eyebrow,
.bottle-mid-left:hover .bottle-info .info-eyebrow,
.bottle-mid-right:hover .bottle-info .info-eyebrow,
.bottle-back-1:hover .bottle-info .info-eyebrow,
.bottle-back-2:hover .bottle-info .info-eyebrow {
  opacity: 1;
  transition-delay: .1s;
}

.bottle-hero:hover .bottle-info .info-ch,
.bottle-mid-left:hover .bottle-info .info-ch,
.bottle-mid-right:hover .bottle-info .info-ch,
.bottle-back-1:hover .bottle-info .info-ch,
.bottle-back-2:hover .bottle-info .info-ch {
  opacity: 1;
  filter: blur(0);
  transition: opacity .3s ease, filter .3s ease;
  transition-delay: calc(.15s + var(--i) * .028s);
}

.bottle-hero .bottle-img {
  filter: saturate(.82) brightness(1.05) contrast(.97);
}

.bottle-mid-left,
.bottle-mid-right {
  top: 71.5%;
  height: 36vh;
  z-index: 6;
  filter: drop-shadow(0 20px 28px rgba(6, 31, 57, .4));
}

.bottle-mid-left { left: 41%; }
.bottle-mid-right { left: 59%; }

.bottle-mid-left .bottle-img,
.bottle-mid-right .bottle-img {
  filter: saturate(.7) brightness(.98) contrast(.92) blur(.6px);
}

.bottle-back-1,
.bottle-back-2 {
  top: 70%;
  height: 26vh;
  z-index: 4;
  opacity: .92;
  filter: drop-shadow(0 14px 22px rgba(6, 31, 57, .35));
}

.bottle-back-1 { left: 32%; }
.bottle-back-2 { left: 68%; }

.bottle-back-1 .bottle-img,
.bottle-back-2 .bottle-img {
  filter: saturate(.55) brightness(.94) contrast(.85) blur(1.2px);
}

.bottle-mid-left .bottle-tint,
.bottle-mid-right .bottle-tint {
  opacity: .9;
}

.bottle-back-1 .bottle-tint,
.bottle-back-2 .bottle-tint {
  background: linear-gradient(180deg, rgba(178, 205, 233, .7) 0%, rgba(112, 150, 189, .65) 50%, rgba(52, 88, 127, .8) 100%);
  opacity: .95;
}

.scentico-3d {
  background: linear-gradient(175deg, #ffffff 12%, #f2f8ff 38%, #ddeaf7 62%, #b2cde9 88%, #90b2d5 100%);
  -webkit-background-clip: text;
  background-clip: text;
  filter: drop-shadow(0 0 16px rgba(221, 234, 247, .5)) drop-shadow(0 0 55px rgba(178, 205, 233, .4)) drop-shadow(0 0 120px rgba(112, 150, 189, .3));
  transform: perspective(1100px) rotateX(4deg);
  transform-style: preserve-3d;
  animation: wordmark-morph 1.1s cubic-bezier(.22, 1, .36, 1) backwards;
}

@keyframes wordmark-morph {
  from { opacity: 0; letter-spacing: .32em; filter: blur(10px); }
  to {
    opacity: 1;
    letter-spacing: .12em;
    filter: drop-shadow(0 0 16px rgba(221, 234, 247, .5)) drop-shadow(0 0 55px rgba(178, 205, 233, .4)) drop-shadow(0 0 120px rgba(112, 150, 189, .3));
  }
}

.scentico-3d::before {
  content: 'Scentico';
  position: absolute;
  inset: 0;
  z-index: -1;
  color: #061F39;
  background: none;
  -webkit-background-clip: initial;
  background-clip: initial;
  transform: translateZ(-80px);
  text-shadow:
    1px 1px 0 #1B3C5E, 2px 2px 0 #193857, 3px 3px 0 #173450,
    4px 4px 0 #153049, 5px 5px 0 #132C42, 6px 6px 0 #11283B,
    7px 7px 0 #0F2434, 8px 8px 0 #0D202D, 9px 9px 0 #0B1C26,
    10px 10px 0 #091820, 11px 11px 0 #071419, 12px 12px 0 #061012,
    13px 13px 0 #050C0D, 14px 14px 18px rgba(6, 31, 57, .7);
}

.bottle--smoke-vanilla,
.bottle--amber-noir,
.bottle--velvet-rose,
.bottle--cedar-veil {
  aspect-ratio: auto;
}

.bottle--smoke-vanilla .bottle-img,
.bottle--amber-noir .bottle-img,
.bottle--velvet-rose .bottle-img,
.bottle--cedar-veil .bottle-img {
  filter: none !important;
}

.bottle--smoke-vanilla.bottle-mid-left,
.bottle--amber-noir.bottle-mid-right,
.bottle--velvet-rose.bottle-back-1,
.bottle--cedar-veil.bottle-back-2 {
  filter: drop-shadow(0 14px 22px rgba(6, 31, 57, .35));
}

.bottle--smoke-vanilla.bottle-mid-left:hover .bottle-img,
.bottle--amber-noir.bottle-mid-right:hover .bottle-img,
.bottle--velvet-rose.bottle-back-1:hover .bottle-img,
.bottle--cedar-veil.bottle-back-2:hover .bottle-img {
  filter: none !important;
}

.ground-glow {
  background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(6, 31, 57, .55) 0%, rgba(27, 60, 94, .3) 45%, transparent 72%);
  filter: blur(6px);
}
</style>
