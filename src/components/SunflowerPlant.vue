<template>
  <div
    class="sunflower-slot"
    :class="{
      clickable: wish && canView,
      'bud-slot': wish && !canView,
      empty: !wish,
      shake: shaking
    }"
    :style="slotStyle"
    @click="handleClick"
    :title="tooltipText"
  >
    <!-- Empty slot: nothing shown -->
    <template v-if="!wish"></template>

    <!-- Locked wish: bud only, sits at ground level (no stem/leaves) -->
    <template v-else-if="!canView">
      <div class="bud" style="bottom: 0">
        <div class="bud-body"></div>
        <div class="bud-tip"></div>
        <span class="spark s1">✦</span>
        <span class="spark s2">✦</span>
      </div>
    </template>

    <!-- Public / revealed wish: full flower -->
    <template v-else>
      <div class="stem"></div>
      <div class="leaf leaf-l"></div>
      <div class="leaf leaf-r"></div>
      <div class="head" :style="headStyle">
        <div class="petals">
          <div v-for="i in 12" :key="i" class="petal" :style="{ transform: `rotate(${i * 30}deg)` }"></div>
        </div>
        <div class="center"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  wish: Object,
  canView: Boolean,
  seed: { type: Number, default: 0 }
})
const emit = defineEmits(['click'])
const shaking = ref(false)

function seededRand(offset = 0) {
  const x = Math.sin(props.seed + offset) * 10000
  return x - Math.floor(x)
}

const tilt      = computed(() => (seededRand(1) - 0.5) * 8)
const heightVar = computed(() => seededRand(2) * 10)
const sizeVar   = computed(() => 0.9 + seededRand(3) * 0.22)

const slotStyle = computed(() => ({
  transform: `rotate(${tilt.value}deg)`,
  '--height-var': heightVar.value + 'px'
}))

const headStyle = computed(() => ({
  transform: `scale(${sizeVar.value})`,
  bottom: `calc(42px + var(--height-var))`
}))

const tooltipText = computed(() => {
  if (!props.wish) return ''
  if (props.canView) return `点击查看 ${props.wish.name} 的祝福`
  return '6月26日 6:26 解锁'
})

function handleClick() {
  if (!props.wish) return
  if (!props.canView) {
    shaking.value = true
    setTimeout(() => { shaking.value = false }, 500)
    return
  }
  emit('click', props.wish)
}
</script>

<style scoped>
.sunflower-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 72px;
  position: relative;
  transform-origin: bottom center;
}

.sunflower-slot.clickable { cursor: pointer; }
.sunflower-slot.clickable:hover .head {
  filter: drop-shadow(0 0 10px rgba(255,215,0,0.9));
}
.sunflower-slot.bud-slot  { cursor: default; }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-5px) rotate(-2deg); }
  40%       { transform: translateX(5px)  rotate(2deg); }
  60%       { transform: translateX(-3px); }
  80%       { transform: translateX(3px); }
}
.sunflower-slot.shake { animation: shake 0.45s ease; }

/* Stem */
.stem {
  width: 5px;
  height: calc(50px + var(--height-var, 0px));
  background: linear-gradient(to bottom, #4A7C3F, #3a6030);
  border-radius: 3px;
  position: absolute;
  bottom: 0;
}

/* Leaves */
.leaf {
  position: absolute;
  width: 14px; height: 8px;
  background: #5a8c45;
  border-radius: 50%;
  bottom: calc(22px + var(--height-var, 0px) * 0.4);
}
.leaf-l { left: calc(50% - 19px); transform: rotate(-35deg); }
.leaf-r { right: calc(50% - 19px); transform: rotate(35deg) scaleX(-1); }

/* ───── Full flower head (bigger: 56px) ───── */
.head {
  position: absolute;
  width: 56px; height: 56px;
  display: flex; align-items: center; justify-content: center;
}

.petals {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
}

.petal {
  position: absolute;
  width: 12px; height: 24px;
  background: linear-gradient(to bottom, #FFE033, #E8A800);
  border-radius: 50% 50% 40% 40%;
  transform-origin: bottom center;
  top: 4px;
}

.center {
  width: 28px; height: 28px;
  background: radial-gradient(circle, #7a3a0a 30%, #5c2a00 100%);
  border-radius: 50%;
  position: relative; z-index: 1;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.35);
}

/* Sway */
@keyframes sway {
  0%, 100% { transform: rotate(0deg); }
  30%  { transform: rotate(1.8deg); }
  70%  { transform: rotate(-1.8deg); }
}
.sunflower-slot.clickable {
  animation: sway 3.5s ease-in-out infinite;
  animation-delay: calc(var(--height-var, 0px) * 0.12s);
}

/* ───── Bud (花苞) ───── */
.bud {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.bud-body {
  width: 18px; height: 22px;
  background: linear-gradient(180deg, #88c43a 0%, #4a8020 100%);
  border-radius: 40% 40% 30% 30%;
  position: relative;
  z-index: 1;
}

.bud-tip {
  width: 14px; height: 14px;
  background: radial-gradient(circle, #fff176 30%, #FFD700 100%);
  border-radius: 50%;
  margin-top: -6px;
  position: relative;
  z-index: 2;
  box-shadow: 0 0 6px rgba(255,220,0,0.6);
}

/* Sparkle stars */
.spark {
  position: absolute;
  color: #ffd700;
  font-size: 9px;
  animation: sparkle 2.2s ease-in-out infinite;
}
.s1 { top: -8px; left: -5px; animation-delay: 0s; }
.s2 { top: -6px; right: -5px; animation-delay: 1.1s; }

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0.4) rotate(0deg); }
  50%       { opacity: 1; transform: scale(1.1) rotate(20deg); }
}

/* Bud gentle glow pulse */
.bud-slot .bud-tip {
  animation: budGlow 3s ease-in-out infinite;
}
@keyframes budGlow {
  0%, 100% { box-shadow: 0 0 5px rgba(255,220,0,0.5); }
  50%       { box-shadow: 0 0 12px rgba(255,220,0,0.9); }
}

/* ───── Empty slot sprout ───── */
.sprout-tip {
  width: 3px; height: 12px;
  background: #6B8C3A;
  border-radius: 2px;
  position: absolute;
  bottom: 0;
}
.sprout-tip::after {
  content: '';
  position: absolute;
  top: 0; left: -4px;
  width: 7px; height: 7px;
  background: #7aac4a;
  border-radius: 50% 50% 0 50%;
}
</style>
