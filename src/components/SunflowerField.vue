<template>
  <div class="field-wrap">
    <!-- Sky -->
    <div class="sky">
      <div class="sun"></div>
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
    </div>

    <!-- Ground -->
    <div class="ground">
      <!-- Grass + rabbits -->
      <div class="grass-area">
        <div class="grass-bg"></div>

        <!-- Speech bubble -->
        <Transition name="bubble">
          <div v-if="bubbleRabbit" class="speech-bubble">{{ bubbleText }}</div>
        </Transition>

        <!-- Yellow rabbit -->
        <div class="rabbit r-y" @click="clickRabbit('y')">
          <div class="r-body"></div>
          <div class="r-head">
            <div class="r-ear-l"></div>
            <div class="r-ear-r"></div>
          </div>
          <div class="r-tail"></div>
        </div>
        <!-- Gray rabbit 1 -->
        <div class="rabbit r-g1" @click="clickRabbit('g1')">
          <div class="r-body"></div>
          <div class="r-head">
            <div class="r-ear-l"></div>
            <div class="r-ear-r"></div>
          </div>
          <div class="r-tail"></div>
        </div>
        <!-- Gray rabbit 2 -->
        <div class="rabbit r-g2" @click="clickRabbit('g2')">
          <div class="r-body"></div>
          <div class="r-head">
            <div class="r-ear-l"></div>
            <div class="r-ear-r"></div>
          </div>
          <div class="r-tail"></div>
        </div>
      </div>

      <!-- Flowers + right-side nav in a row -->
      <div class="ground-body">
        <!-- Sliding pages -->
        <div class="slide-viewport">
          <div
            class="slides-track"
            :style="{ transform: `translateX(${-currentPage * 100}%)`, transition: sliding ? 'transform 0.35s ease' : 'none' }"
          >
            <div
              v-for="pageIdx in totalPages"
              :key="pageIdx - 1"
              class="slide-page"
            >
              <div class="flowers-grid">
                <SunflowerPlant
                  v-for="(slot, i) in pageSlots(pageIdx - 1)"
                  :key="slot ? slot.id : `empty-${pageIdx}-${i}`"
                  :wish="slot"
                  :can-view="slot ? canView(slot) : false"
                  :seed="(pageIdx - 1) * PER_PAGE + i"
                  @click="$emit('wish-click', $event)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right-side vertical navigation -->
        <div class="nav" v-if="totalPages > 1">
          <button class="arrow-btn" :disabled="currentPage === 0" @click="go(-1)">∧</button>
          <div class="page-dots">
            <span
              v-for="p in totalPages"
              :key="p"
              class="dot"
              :class="{ active: p - 1 === currentPage }"
              @click="goTo(p - 1)"
            ></span>
          </div>
          <button class="arrow-btn" :disabled="currentPage >= totalPages - 1" @click="go(1)">∨</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SunflowerPlant from './SunflowerPlant.vue'

const props = defineProps({
  wishes: { type: Array, default: () => [] },
  canView: { type: Function, required: true }
})

defineEmits(['wish-click'])

const PER_PAGE = 25
const currentPage = ref(0)
const sliding = ref(false)

const totalPages = computed(() => Math.max(1, Math.ceil(props.wishes.length / PER_PAGE)))

function pageSlots(pageIdx) {
  const start = pageIdx * PER_PAGE
  const pageWishes = props.wishes.slice(start, start + PER_PAGE)
  return Array.from({ length: PER_PAGE }, (_, i) => pageWishes[i] ?? null)
}

function go(delta) {
  const next = currentPage.value + delta
  if (next < 0 || next >= totalPages.value) return
  sliding.value = true
  currentPage.value = next
  setTimeout(() => { sliding.value = false }, 400)
}

function goTo(idx) {
  if (idx === currentPage.value) return
  sliding.value = true
  currentPage.value = idx
  setTimeout(() => { sliding.value = false }, 400)
}

defineExpose({
  goToLastPage() {
    goTo(totalPages.value - 1)
  }
})

// ── Rabbit quotes ──
const quotes = [
  '去生活，去犯错，去堕落，去征服，去从生命中创造生命！',
  '是因为有爱，暗淡世界忽然变彩色。',
  'You know I love you so.',
  'Everything that drowns me makes me wanna fly.',
  'You never shined so brightly.',
  '所以你睡了没',
  '不能做普通朋友',
  'Someone in the crowd could be the one you need to know.',
  '爱已无法回答所有的问题。',
  'Te quiero lento',
  '要感谢低谷赋予了生命高潮的意义',
  '孩子别紧张 生活不是竞技场',
  '鹰 不可以留恋地平线',
  '偶尔也会想家 但我知道我需要变得更强大',
  '我告诉自己抛下心中所有的牵绊 只要做我想做的不能够轻易地认命',
  '穿过幽暗的岁月 也曾感到彷徨',
  '没有什么能够阻挡 你对自由的向往',
  'Sans fleurs, sans fards, Écrire de nos sangs l\'histoire',
  '她就像一朵蓓蕾 满怀希望',
  '全部都交给我 虽然我身在远方',
  'Und wenn wir zusammenstehen Kann unser Licht nie untergehen',
  '最重要是有好心态 上帝才会对你更青睐',
  'Посидим с товарищами у костра',
  '短暂的胜利无所谓 只想要记住你的笑脸'
]

const bubbleText = ref('')
const bubbleRabbit = ref(null)
let bubbleTimer = null

function clickRabbit(id) {
  if (bubbleTimer) clearTimeout(bubbleTimer)
  const pool = quotes.filter(q => q !== bubbleText.value)
  bubbleText.value = pool[Math.floor(Math.random() * pool.length)]
  bubbleRabbit.value = id
  bubbleTimer = setTimeout(() => { bubbleRabbit.value = null }, 4000)
}
</script>

<style scoped>
.field-wrap {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Sky */
.sky {
  flex: 1;
  min-height: 110px;
  background: linear-gradient(180deg, #4A9FE0 0%, #87CEEB 55%, #C5E8FF 100%);
  position: relative;
  overflow: hidden;
}

.sun {
  position: absolute;
  top: 12%; right: 10%;
  width: 64px; height: 64px;
  background: radial-gradient(circle, #FFF9C4 20%, #FFD700 65%, #FFA500 100%);
  border-radius: 50%;
  box-shadow: 0 0 35px 12px rgba(255,215,0,0.45);
  animation: sunPulse 4s ease-in-out infinite;
}
@keyframes sunPulse {
  0%, 100% { box-shadow: 0 0 35px 12px rgba(255,215,0,0.45); }
  50%       { box-shadow: 0 0 50px 20px rgba(255,215,0,0.6); }
}

.cloud {
  position: absolute;
  background: white;
  border-radius: 50px;
  opacity: 0.88;
}
.cloud::before, .cloud::after {
  content: ''; position: absolute;
  background: white; border-radius: 50%;
}
.cloud-1 { width: 90px; height: 26px; top: 20%; left: 6%; animation: drift 20s linear infinite; }
.cloud-1::before { width: 38px; height: 38px; top: -18px; left: 16px; }
.cloud-1::after  { width: 26px; height: 26px; top: -12px; left: 44px; }

.cloud-2 { width: 65px; height: 20px; top: 45%; left: 38%; animation: drift 28s linear infinite reverse; }
.cloud-2::before { width: 28px; height: 28px; top: -13px; left: 11px; }
.cloud-2::after  { width: 20px; height: 20px; top: -8px;  left: 32px; }

.cloud-3 { width: 75px; height: 22px; top: 15%; left: 58%; animation: drift 22s linear infinite; }
.cloud-3::before { width: 32px; height: 32px; top: -15px; left: 14px; }
.cloud-3::after  { width: 22px; height: 22px; top: -9px;  left: 38px; }

@keyframes drift {
  0%   { transform: translateX(0); }
  50%  { transform: translateX(20px); }
  100% { transform: translateX(0); }
}

/* Ground */
.ground {
  background: linear-gradient(180deg, #8B6D2A 0%, #6b5020 100%);
  padding-bottom: 80px; /* keeps bottom flowers above the action buttons */
  flex-shrink: 0;
}

/* Grass + rabbits wrapper */
.grass-area {
  position: relative;
  height: 36px;
  overflow: visible;
}

.grass-bg {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 100%;
  background: linear-gradient(180deg, #82b83a, #5a8c35);
  border-radius: 6px 6px 0 0;
}

/* ── Speech bubble ── */
.speech-bubble {
  position: absolute;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  background: #fffdf0;
  border: 2px solid #e8c870;
  border-radius: 14px;
  padding: 8px 14px;
  font-size: 12px;
  color: #5c3a00;
  line-height: 1.5;
  max-width: 220px;
  width: max-content;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  z-index: 20;
  pointer-events: none;
}
.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -9px;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: #e8c870;
  border-bottom: none;
}
.speech-bubble::before {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border: 7px solid transparent;
  border-top-color: #fffdf0;
  border-bottom: none;
  z-index: 1;
}

.bubble-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.bubble-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.bubble-enter-from   { opacity: 0; transform: translateX(-50%) translateY(8px); }
.bubble-leave-to     { opacity: 0; transform: translateX(-50%) translateY(-6px); }

/* ═══════════════ RABBIT ═══════════════ */
.rabbit {
  position: absolute;
  bottom: 14px;
  width: 26px;
  height: 20px;
  transform-origin: center bottom;
  cursor: pointer;
}

.r-body {
  position: absolute;
  width: 20px; height: 14px;
  background: currentColor;
  border-radius: 45% 50% 50% 45%;
  bottom: 2px; left: 2px;
}
.r-head {
  position: absolute;
  width: 13px; height: 12px;
  background: currentColor;
  border-radius: 50% 45% 45% 50%;
  right: 0; bottom: 7px;
}
.r-ear-l, .r-ear-r {
  position: absolute;
  width: 4px; height: 10px;
  background: currentColor;
  border-radius: 50%;
  top: -9px;
}
.r-ear-l { left: 2px; }
.r-ear-r { left: 7px; }
.r-tail {
  position: absolute;
  width: 7px; height: 7px;
  background: rgba(255,255,255,0.85);
  border-radius: 50%;
  bottom: 5px; left: 0;
}

.r-y  { color: #E8B820; }
.r-g1 { color: #9E9E9E; }
.r-g2 { color: #6E6E6E; }

.r-y  .r-ear-l::after,
.r-y  .r-ear-r::after { background: #fff0a0; }
.r-g1 .r-ear-l::after,
.r-g1 .r-ear-r::after { background: #d4aeb0; }
.r-g2 .r-ear-l::after,
.r-g2 .r-ear-r::after { background: #c09092; }

.r-ear-l::after, .r-ear-r::after {
  content: '';
  position: absolute;
  width: 2px; height: 6px;
  border-radius: 50%;
  top: 2px; left: 1px;
}
.r-head::after {
  content: '';
  position: absolute;
  width: 3px; height: 3px;
  background: #1a1a1a;
  border-radius: 50%;
  top: 3px; right: 2px;
}

.r-y  { animation: run-y  9s  ease-in-out infinite; }
.r-g1 { animation: run-g1 7s  ease-in-out infinite 1.8s; }
.r-g2 { animation: run-g2 11s ease-in-out infinite 4.5s; }

@keyframes run-y {
  0%   { left: 5%;  transform: scaleX(1)  translateY(0); }
  6%   { left: 11%; transform: scaleX(1)  translateY(-5px); }
  12%  { left: 17%; transform: scaleX(1)  translateY(0); }
  18%  { left: 23%; transform: scaleX(1)  translateY(-5px); }
  24%  { left: 28%; transform: scaleX(1)  translateY(0); }
  30%  { left: 34%; transform: scaleX(1)  translateY(-5px); }
  36%  { left: 40%; transform: scaleX(1)  translateY(0); }
  41%  { left: 46%; transform: scaleX(1)  translateY(-5px); }
  44%  { left: 48%; transform: scaleX(1)  translateY(0); }
  46%  { left: 48%; transform: scaleX(-1) translateY(0); }
  50%  { left: 48%; transform: scaleX(-1) translateY(0); }
  56%  { left: 42%; transform: scaleX(-1) translateY(-5px); }
  62%  { left: 36%; transform: scaleX(-1) translateY(0); }
  68%  { left: 30%; transform: scaleX(-1) translateY(-5px); }
  74%  { left: 24%; transform: scaleX(-1) translateY(0); }
  80%  { left: 18%; transform: scaleX(-1) translateY(-5px); }
  86%  { left: 12%; transform: scaleX(-1) translateY(0); }
  91%  { left: 6%;  transform: scaleX(-1) translateY(-5px); }
  94%  { left: 5%;  transform: scaleX(-1) translateY(0); }
  96%  { left: 5%;  transform: scaleX(1)  translateY(0); }
  100% { left: 5%;  transform: scaleX(1)  translateY(0); }
}
@keyframes run-g1 {
  0%   { left: 18%; transform: scaleX(1)  translateY(0); }
  7%   { left: 26%; transform: scaleX(1)  translateY(-5px); }
  14%  { left: 33%; transform: scaleX(1)  translateY(0); }
  21%  { left: 41%; transform: scaleX(1)  translateY(-5px); }
  28%  { left: 49%; transform: scaleX(1)  translateY(0); }
  35%  { left: 57%; transform: scaleX(1)  translateY(-5px); }
  41%  { left: 63%; transform: scaleX(1)  translateY(0); }
  44%  { left: 65%; transform: scaleX(1)  translateY(0); }
  46%  { left: 65%; transform: scaleX(-1) translateY(0); }
  50%  { left: 65%; transform: scaleX(-1) translateY(0); }
  57%  { left: 57%; transform: scaleX(-1) translateY(-5px); }
  64%  { left: 49%; transform: scaleX(-1) translateY(0); }
  71%  { left: 41%; transform: scaleX(-1) translateY(-5px); }
  78%  { left: 33%; transform: scaleX(-1) translateY(0); }
  85%  { left: 25%; transform: scaleX(-1) translateY(-5px); }
  91%  { left: 19%; transform: scaleX(-1) translateY(0); }
  94%  { left: 18%; transform: scaleX(-1) translateY(0); }
  96%  { left: 18%; transform: scaleX(1)  translateY(0); }
  100% { left: 18%; transform: scaleX(1)  translateY(0); }
}
@keyframes run-g2 {
  0%   { left: 10%; transform: scaleX(1)  translateY(0); }
  6%   { left: 17%; transform: scaleX(1)  translateY(-5px); }
  12%  { left: 24%; transform: scaleX(1)  translateY(0); }
  18%  { left: 31%; transform: scaleX(1)  translateY(-5px); }
  24%  { left: 38%; transform: scaleX(1)  translateY(0); }
  30%  { left: 44%; transform: scaleX(1)  translateY(-5px); }
  36%  { left: 50%; transform: scaleX(1)  translateY(0); }
  41%  { left: 54%; transform: scaleX(1)  translateY(-5px); }
  44%  { left: 55%; transform: scaleX(1)  translateY(0); }
  46%  { left: 55%; transform: scaleX(-1) translateY(0); }
  50%  { left: 55%; transform: scaleX(-1) translateY(0); }
  56%  { left: 48%; transform: scaleX(-1) translateY(-5px); }
  62%  { left: 41%; transform: scaleX(-1) translateY(0); }
  68%  { left: 35%; transform: scaleX(-1) translateY(-5px); }
  74%  { left: 28%; transform: scaleX(-1) translateY(0); }
  80%  { left: 22%; transform: scaleX(-1) translateY(-5px); }
  86%  { left: 15%; transform: scaleX(-1) translateY(0); }
  91%  { left: 11%; transform: scaleX(-1) translateY(-5px); }
  94%  { left: 10%; transform: scaleX(-1) translateY(0); }
  96%  { left: 10%; transform: scaleX(1)  translateY(0); }
  100% { left: 10%; transform: scaleX(1)  translateY(0); }
}

/* ── Ground body: flowers + right nav in a row ── */
.ground-body {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

/* Sliding viewport */
.slide-viewport {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  padding-top: 50px;
  margin-top: -50px;
}

.slides-track {
  display: flex;
  will-change: transform;
}

.slide-page {
  flex: 0 0 100%;
  min-width: 0;
  padding: 6px 8px 4px 12px;
}

/* Flower grid: 5 cols */
.flowers-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px 0;
}

/* ── Right-side vertical navigation ── */
.nav {
  flex-shrink: 0;
  width: 38px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 0;
}

.arrow-btn {
  background: rgba(255,255,255,0.15);
  border: 2px solid rgba(255,255,255,0.4);
  color: white;
  width: 30px; height: 30px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;
  line-height: 1;
}
.arrow-btn:hover:not(:disabled) { background: rgba(255,255,255,0.3); }
.arrow-btn:disabled { opacity: 0.3; cursor: default; }

.page-dots {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}

.dot {
  width: 7px; height: 7px;
  background: rgba(255,255,255,0.4);
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.dot.active {
  background: white;
  transform: scale(1.3);
}
</style>
