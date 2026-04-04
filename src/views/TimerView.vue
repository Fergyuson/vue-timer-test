<template>
  <div class="wrap">
    <div class="top">
      <h1>{{ timer.formattedTime }}</h1>
      <RouterLink class="link" to="/timers">Список таймеров</RouterLink>
    </div>

    <div class="row">
      <button type="button" :disabled="!timer.canStart" @click="timer.start()">
        Старт
      </button>

      <button type="button" :disabled="!timer.canPause" @click="timer.pause()">
        Пауза
      </button>

      <button type="button" :disabled="!timer.canStop" @click="openStopModal">
        Остановить
      </button>
    </div>

    <!-- <p class="hint">Экран обновляется раз в 250мс.</p> -->

    <div v-if="showConfirm" class="overlay" @click.self="cancelSave">
      <div class="modal">
        <h2>Записать время?</h2>

        <p class="big">{{ timer.formattedTime }}</p>

        <p class="muted" v-if="timer.sessionStartedAtMs">
          Дата запуска: {{ formatDateTimeRu(timer.sessionStartedAtMs) }}
        </p>

        <div class="row">
          <button type="button" class="primary" @click="confirmSave">
            Подтвердить
          </button>
          <button type="button" @click="cancelSave">
            Отмена
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useTimerStore } from '@/stores/timer'
import { useRecordsStore } from '@/stores/records'
import { formatDateTimeRu } from '@/shared/time'

const timer = useTimerStore()
const records = useRecordsStore()

let intervalId: number | null = null

onMounted(() => {
  intervalId = window.setInterval(() => {
    timer.setNow(Date.now())
  }, 250)
})

onBeforeUnmount(() => {
  if (intervalId !== null) window.clearInterval(intervalId)
})

const showConfirm = ref(false)

function openStopModal() {
  timer.stop()
  if (timer.elapsedMs <= 0) return
  showConfirm.value = true
}

function cancelSave() {
  showConfirm.value = false
}

function confirmSave() {
  if (timer.sessionStartedAtMs === null) {
    showConfirm.value = false
    timer.clearSession()
    return
  }

  records.addRecord({
    startedAtMs: timer.sessionStartedAtMs,
    durationMs: timer.elapsedMs,
  })

  showConfirm.value = false
  timer.clearSession()
}
</script>

<style scoped lang="scss">
.wrap {
  max-width: 700px;
  margin: 40px auto;
  text-align: center;
  padding: 0 16px;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.link {
  text-decoration: underline;
  color: #111;
}

.row {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 16px;
  flex-wrap: wrap;
}

button {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #cfcfcf;
  background: #fff;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary {
  border-color: #111;
  font-weight: 700;
}

.hint {
  margin-top: 14px;
  color: #666;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.modal {
  width: min(420px, 100%);
  background: #fff;
  border-radius: 14px;
  padding: 18px;
  text-align: center;
}

.big {
  font-size: 34px;
  font-weight: 800;
  margin: 12px 0;
}

.muted {
  color: #666;
  margin: 0 0 10px;
}
</style>