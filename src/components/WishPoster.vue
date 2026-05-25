<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="poster">

      <!-- 标题 -->
      <div class="poster-header">
        <div class="title">🌻 生日花海 · 祝福长卷</div>
        <div class="subtitle">共 {{ visible.length }} 朵向日葵</div>
      </div>

      <!-- 留言列表 -->
      <div class="scroll-body">
        <!-- 无可见祝福时的提示 -->
        <div v-if="visible.length === 0" class="locked-msg">
          🔒 等到 6月26日 6:26，所有祝福将一起绽放
        </div>

        <template v-else>
          <div
            v-for="(wish, i) in visible"
            :key="wish.id"
            class="wish-entry"
          >
            <p class="message">{{ wish.message }}</p>
            <p v-if="wish.name && wish.name !== '匿名朋友'" class="name">—— {{ wish.name }}</p>

            <!-- 分隔线（最后一条不显示） -->
            <div v-if="i < visible.length - 1" class="divider">
              <span class="dot">✦</span>
            </div>
          </div>
        </template>
      </div>

      <!-- 关闭按钮（固定在底部） -->
      <div class="footer">
        <button class="close-btn" @click="$emit('close')">收起长卷 ✨</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  wishes: { type: Array, required: true },
  isRevealed: { type: Boolean, required: true }
})
defineEmits(['close'])

const visible = computed(() =>
  props.wishes.filter(w => props.isRevealed || w.isPublic)
)
</script>

<style scoped>
/* ── Overlay ── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
}

/* ── Poster card ── */
.poster {
  background: #fffdf0;
  border-radius: 20px;
  width: 100%;
  max-width: 460px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  animation: popIn 0.3s ease;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.92) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* ── Header ── */
.poster-header {
  background: linear-gradient(90deg, #e8a800 0%, #f5c518 50%, #e8a800 100%);
  padding: 18px 24px 14px;
  text-align: center;
  flex-shrink: 0;
}
.title {
  font-size: 17px;
  font-weight: 700;
  color: #5c3a00;
  letter-spacing: 1.5px;
}
.subtitle {
  font-size: 12px;
  color: #7a5200;
  margin-top: 4px;
  letter-spacing: 1px;
}

/* ── Scrollable body ── */
.scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 22px 26px 8px;
  -webkit-overflow-scrolling: touch;
}

/* ── No wishes locked message ── */
.locked-msg {
  text-align: center;
  color: #b08040;
  font-size: 14px;
  padding: 32px 0;
  line-height: 1.8;
}

/* ── Individual wish entry ── */
.wish-entry {
  margin-bottom: 4px;
}

.message {
  font-size: 15px;
  color: #3a2800;
  line-height: 1.85;
  white-space: pre-line;
  margin: 0;
  font-style: italic;
}

.name {
  font-size: 13px;
  color: #a07840;
  text-align: right;
  margin: 6px 0 0;
  font-style: normal;
  letter-spacing: 0.5px;
}

/* ── Divider ── */
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
  color: #d4a840;
  font-size: 10px;
  gap: 8px;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e8c870, transparent);
}

/* ── Footer ── */
.footer {
  padding: 14px 24px 18px;
  flex-shrink: 0;
  background: #fffdf0;
  border-top: 1px solid #f0e8c0;
}
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
  box-shadow: 0 6px 18px rgba(245, 197, 24, 0.5);
}
.close-btn:active {
  transform: translateY(0);
}
</style>
