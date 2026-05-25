<template>
  <div class="overlay">
    <div class="card" :class="{ visible: shown }">

      <!-- 金色日期条 -->
      <div class="date-strip">
        <span class="star">✦</span>
        <span class="date-text">{{ image.date }}</span>
        <span class="star">✦</span>
      </div>

      <!-- 照片 -->
      <div class="photo-wrap">
        <img
          :src="image.src"
          :alt="image.date"
          class="photo"
          @error="onImgError"
        />
      </div>

      <!-- 故事文字 + 按钮 -->
      <div class="body">
        <p class="story">{{ image.caption }}</p>
        <p class="thanks">谢谢你来到我的生日花海 🌻</p>
        <button class="close-btn" @click="$emit('close')">收好啦 ✨</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { thankYouImages } from '../data/birthdayImages.js'

defineEmits(['close'])

const SEEN_KEY = 'birthday_seen_images'

function pickImage() {
  if (thankYouImages.length === 1) return thankYouImages[0]
  let seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')
  const available = thankYouImages.map((_, i) => i).filter(i => !seen.includes(i))
  if (available.length === 0) seen = []
  const pool = available.length > 0 ? available : thankYouImages.map((_, i) => i)
  const idx = pool[Math.floor(Math.random() * pool.length)]
  seen.push(idx)
  localStorage.setItem(SEEN_KEY, JSON.stringify(seen))
  return thankYouImages[idx]
}

const image = pickImage()
const shown = ref(false)

onMounted(() => setTimeout(() => { shown.value = true }, 50))

function onImgError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped>
/* ── Overlay ── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 16px;
}

/* ── Card ── */
.card {
  background: #fffdf0;
  border-radius: 20px;
  overflow: hidden;
  max-width: 360px;
  width: 100%;
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.35);
  opacity: 0;
  transform: scale(0.88) translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.card.visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* ── Date strip ── */
.date-strip {
  background: linear-gradient(90deg, #e8a800 0%, #f5c518 50%, #e8a800 100%);
  color: #5c3a00;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 11px 20px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
}
.star {
  font-size: 8px;
  opacity: 0.6;
}
.date-text {
  font-size: 14px;
}

/* ── Photo ── */
.photo-wrap {
  width: 100%;
  min-height: 200px;
  max-height: 340px;
  overflow: hidden;
  background: #fffdf0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.photo {
  width: 100%;
  height: auto;
  max-height: 340px;
  object-fit: contain;
  display: block;
  transition: transform 0.4s ease;
}
.photo:hover {
  transform: scale(1.02);
}

/* ── Body ── */
.body {
  padding: 18px 22px 22px;
  text-align: center;
}

.story {
  font-size: 14px;
  color: #5c3a00;
  line-height: 1.9;
  margin: 0 0 10px;
  font-style: italic;
  letter-spacing: 0.3px;
  white-space: pre-line;
}

.thanks {
  font-size: 11px;
  color: #c49a60;
  margin: 0 0 18px;
  letter-spacing: 0.8px;
}

/* ── Button ── */
.close-btn {
  width: 100%;
  background: linear-gradient(135deg, #f5c518, #e8a800);
  color: #5c3a00;
  border: none;
  border-radius: 12px;
  padding: 13px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.15s, box-shadow 0.15s;
}
.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(245, 197, 24, 0.55);
}
.close-btn:active {
  transform: translateY(0);
}
</style>
