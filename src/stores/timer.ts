import { defineStore } from 'pinia'
import { formatTime, nowMs } from '@/shared/time'
import { readJson, writeJson } from '@/shared/storage'

const STORAGE_KEY = 'timer_session_v1'

type PersistedTimer = {
  running: boolean
  sessionStartedAtMs: number | null
  lastStartAtMs: number | null
  accumulatedMs: number
}

export const useTimerStore = defineStore('timer', {
  state: () => ({
    running: false,
    sessionStartedAtMs: null as number | null,
    lastStartAtMs: null as number | null,
    accumulatedMs: 0,

    now: nowMs(),
  }),

  getters: {
    elapsedMs(state): number {
      if (!state.running || state.lastStartAtMs === null) return state.accumulatedMs
      return state.accumulatedMs + (state.now - state.lastStartAtMs)
    },

    formattedTime(): string {
      return formatTime(this.elapsedMs)
    },

    canStart(state): boolean {
      return !state.running
    },
    canPause(state): boolean {
      return state.running
    },
    canStop(): boolean {
      return this.elapsedMs > 0 || this.running
    },
  },

  actions: {
    hydrate() {
      const data = readJson<PersistedTimer>(STORAGE_KEY)
      if (!data) return

      if (typeof data.running !== 'boolean') return
      if (data.sessionStartedAtMs !== null && typeof data.sessionStartedAtMs !== 'number') return
      if (data.lastStartAtMs !== null && typeof data.lastStartAtMs !== 'number') return
      if (typeof data.accumulatedMs !== 'number') return

      this.running = data.running
      this.sessionStartedAtMs = data.sessionStartedAtMs
      this.lastStartAtMs = data.lastStartAtMs
      this.accumulatedMs = data.accumulatedMs
      this.now = nowMs()
    },

    save() {
      const payload: PersistedTimer = {
        running: this.running,
        sessionStartedAtMs: this.sessionStartedAtMs,
        lastStartAtMs: this.lastStartAtMs,
        accumulatedMs: this.accumulatedMs,
      }
      writeJson(STORAGE_KEY, payload)
    },

    setNow(value: number) {
      this.now = value
    },

    start() {
      if (this.running) return

      if (this.sessionStartedAtMs === null) {
        this.sessionStartedAtMs = nowMs()
      }

      this.running = true
      this.lastStartAtMs = nowMs()
      this.now = nowMs()

      this.save()
    },

    pause() {
      if (!this.running || this.lastStartAtMs === null) return

      const t = nowMs()
      this.accumulatedMs += t - this.lastStartAtMs
      this.running = false
      this.lastStartAtMs = null
      this.now = t

      this.save()
    },

    stop() {
      if (this.running) this.pause()
    },

    clearSession() {
      this.running = false
      this.sessionStartedAtMs = null
      this.lastStartAtMs = null
      this.accumulatedMs = 0
      this.now = nowMs()

      this.save()
    },
  },
})