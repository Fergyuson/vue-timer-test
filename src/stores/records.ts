import { defineStore } from 'pinia'
import { nowMs } from '@/shared/time'
import { readJson, writeJson } from '@/shared/storage'

export type TimerRecord = {
  id: string
  startedAtMs: number
  savedAtMs: number
  durationMs: number
}

const STORAGE_KEY = 'timer_records_v1'

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as Crypto).randomUUID()
  }
  return `id_${nowMs()}_${Math.random().toString(16).slice(2)}`
}

type PersistedRecords = {
  records: TimerRecord[]
}

export const useRecordsStore = defineStore('records', {
  state: () => ({
    records: [] as TimerRecord[],
  }),

  actions: {
    hydrate() {
      const data = readJson<PersistedRecords>(STORAGE_KEY)
      if (!data || !Array.isArray(data.records)) return
      this.records = data.records
    },

    save() {
      writeJson<PersistedRecords>(STORAGE_KEY, { records: this.records })
    },

    addRecord(payload: Omit<TimerRecord, 'id' | 'savedAtMs'>) {
      this.records.unshift({
        id: newId(),
        savedAtMs: nowMs(),
        ...payload,
      })
      this.save()
    },

    remove(id: string) {
      this.records = this.records.filter((r) => r.id !== id)
      this.save()
    },

    clear() {
      this.records = []
      this.save()
    },
  },
})q