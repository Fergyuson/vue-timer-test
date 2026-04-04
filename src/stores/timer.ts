import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { nowMs, formatTime } from '@/shared/time'

export const useTimerStore = defineStore(
  'timer',
  () => {
    const running = ref(false)
    const sessionStartedAtMs = ref<number | null>(null)
    const lastStartAtMs = ref<number | null>(null)
    const accumulatedMs = ref(0)

    // ВАЖНО: реактивное "текущее время", чтобы computed пересчитывались
    const now = ref(nowMs())

    function setNow(value: number) {
      now.value = value
    }

    const elapsedMs = computed(() => {
      if (!running.value || lastStartAtMs.value === null) return accumulatedMs.value
      return accumulatedMs.value + (now.value - lastStartAtMs.value)
    })

    const formattedTime = computed(() => formatTime(elapsedMs.value))

    const canStart = computed(() => !running.value)
    const canPause = computed(() => running.value)
    const canStop = computed(() => elapsedMs.value > 0 || running.value)

    function start() {
      if (running.value) return
      if (sessionStartedAtMs.value === null) sessionStartedAtMs.value = nowMs()
      running.value = true
      lastStartAtMs.value = nowMs()
      setNow(nowMs())
    }

    function pause() {
      if (!running.value || lastStartAtMs.value === null) return
      const t = nowMs()
      accumulatedMs.value += t - lastStartAtMs.value
      running.value = false
      lastStartAtMs.value = null
      setNow(t)
    }

    function stop() {
      if (running.value) pause()
    }

    function clearSession() {
      running.value = false
      sessionStartedAtMs.value = null
      lastStartAtMs.value = null
      accumulatedMs.value = 0
      setNow(nowMs())
    }

    return {
      running,
      sessionStartedAtMs,
      lastStartAtMs,
      accumulatedMs,
      now,
      setNow,
      elapsedMs,
      formattedTime,
      canStart,
      canPause,
      canStop,
      start,
      pause,
      stop,
      clearSession,
    }
  },
  {
    persist: {
      key: 'timer_session_v1',
      storage: localStorage,
      pick: ['running', 'sessionStartedAtMs', 'lastStartAtMs', 'accumulatedMs'],
    },
  }
)