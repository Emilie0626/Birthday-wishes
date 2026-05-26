<template>
  <div class="birthday-page">
    <!-- Reveal banner (shows on/after June 26 18:26) -->
    <transition name="banner">
      <div v-if="isRevealed" class="reveal-banner">
        🎂 生日快乐！所有祝福已全部解锁～
      </div>
    </transition>

    <!-- Sunflower field fills remaining space -->
    <SunflowerField
      ref="fieldRef"
      :wishes="wishes"
      :can-view="canViewWish"
      @wish-click="openWish"
    />

    <!-- Guide button (top-left) -->
    <button class="guide-btn" @click="showGuide = true" title="使用指南">？</button>

    <!-- Wish count pill -->
    <transition name="fade">
      <div class="count-pill" v-if="wishes.length > 0">
        {{ wishes.length }} 朵向日葵
      </div>
    </transition>

    <!-- Bottom action bar -->
    <div class="bottom-actions">
      <button class="write-btn" @click="showForm = true">
        写下祝福 🌻
      </button>
      <transition name="fade">
        <button
          v-if="visibleWishCount > 0"
          class="poster-btn"
          @click="showPoster = true"
        >
          展开长卷 📜
        </button>
      </transition>
      <transition name="fade">
        <button
          v-if="hasMyCard"
          class="poster-btn"
          @click="showMyCard = true"
        >
          我的回执 🎁
        </button>
      </transition>
    </div>

    <!-- Overlays -->
    <GuideModal
      v-if="showGuide"
      @close="closeGuide"
    />

    <WishPoster
      v-if="showPoster"
      :wishes="wishes"
      :is-revealed="isRevealed"
      @close="showPoster = false"
    />

    <WishForm
      v-if="showForm"
      @close="showForm = false"
      @submit="onSubmit"
    />

    <SeedAnimation
      v-if="showSeed"
      @done="onSeedDone"
    />

    <ThankYouCard
      v-if="showThankYou"
      @close="showThankYou = false"
    />

    <ThankYouCard
      v-if="showMyCard"
      :view-only="true"
      @close="showMyCard = false"
    />

    <WishCard
      v-if="activeWish"
      :wish="activeWish"
      @close="activeWish = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { REVEAL_TIME } from './data/birthdayImages.js'
import { getWishes, addWish } from './data/birthdayStore.js'
import SunflowerField from './components/SunflowerField.vue'
import WishForm from './components/WishForm.vue'
import SeedAnimation from './components/SeedAnimation.vue'
import ThankYouCard from './components/ThankYouCard.vue'
import WishCard from './components/WishCard.vue'
import WishPoster from './components/WishPoster.vue'
import GuideModal from './components/GuideModal.vue'

const wishes = ref([])
const showForm = ref(false)
const showSeed = ref(false)
const showThankYou = ref(false)
const showMyCard = ref(false)
const showPoster = ref(false)
const showGuide = ref(false)
const activeWish = ref(null)
const fieldRef = ref(null)
const hasMyCard = ref(false)

const MY_CARD_KEY = 'birthday_my_card_idx'

const isRevealed = computed(() => new Date() >= REVEAL_TIME)
const canViewWish = (w) => isRevealed.value || w.isPublic
const visibleWishCount = computed(() =>
  wishes.value.filter(w => isRevealed.value || w.isPublic).length
)

const GUIDE_KEY = 'birthday_guide_seen'

onMounted(async () => {
  wishes.value = await getWishes()
  if (!localStorage.getItem(GUIDE_KEY)) showGuide.value = true
  hasMyCard.value = !!localStorage.getItem(MY_CARD_KEY)
})

function closeGuide() {
  showGuide.value = false
  localStorage.setItem(GUIDE_KEY, '1')
}

async function onSubmit(data) {
  showForm.value = false
  try {
    await addWish(data)
    wishes.value = await getWishes()
  } catch (e) {
    console.error('Failed to save wish:', e)
  }
  setTimeout(() => {
    fieldRef.value?.goToLastPage()
    showSeed.value = true
  }, 100)
}

function onSeedDone() {
  showSeed.value = false
  showThankYou.value = true
  hasMyCard.value = true
}

function openWish(wish) {
  activeWish.value = wish
}
</script>

<style scoped>
.birthday-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background: #4A9FE0;
}

.reveal-banner {
  background: linear-gradient(90deg, #f5c518, #e8a800);
  color: #5c3a00;
  text-align: center;
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
  z-index: 10;
}

/* Guide button (top-left) */
.guide-btn {
  position: fixed;
  top: 12px;
  left: 12px;
  width: 34px;
  height: 34px;
  background: rgba(255, 253, 240, 0.88);
  color: #5c3a00;
  border: 2px solid #e8a800;
  border-radius: 50%;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  transition: transform 0.15s, box-shadow 0.15s;
}
.guide-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 14px rgba(232, 168, 0, 0.4);
}

/* Bottom action bar — keeps both buttons side-by-side and centred */
.bottom-actions {
  position: fixed;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 50;
  padding: 0 16px;
  pointer-events: none; /* let clicks pass through the gap */
}
.bottom-actions > * {
  pointer-events: auto;
}

/* Write button */
.write-btn {
  background: linear-gradient(135deg, #f5c518, #e8a800);
  color: #5c3a00;
  border: none;
  border-radius: 50px;
  padding: 13px 28px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(245,197,24,0.55);
  white-space: nowrap;
  font-family: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}
.write-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(245,197,24,0.65);
}
.write-btn:active { transform: translateY(0); }

/* Wish count pill */
.count-pill {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(6px);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 50px;
  z-index: 10;
  pointer-events: none;
  text-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

/* Poster button */
.poster-btn {
  background: rgba(255, 253, 240, 0.92);
  color: #5c3a00;
  border: 2px solid #e8a800;
  border-radius: 50px;
  padding: 11px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 12px rgba(232, 168, 0, 0.3);
  transition: transform 0.15s, box-shadow 0.15s;
}
.poster-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(232, 168, 0, 0.45);
}
.poster-btn:active { transform: translateY(0); }

/* Transitions */
.banner-enter-active, .banner-leave-active { transition: all 0.4s ease; }
.banner-enter-from, .banner-leave-to { opacity: 0; transform: translateY(-100%); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
