import { defineStore } from 'pinia'
import { ref } from 'vue'
import { nowMs } from '@/shared/time'

export type TimerRecord = {
  id: string
  startedAtMs: number
  savedAtMs: number
  durationMs: number
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as Crypto).randomUUID()
  }
  return `id_${nowMs()}_${Math.random().toString(16).slice(2)}`
}

export const useRecordsStore = defineStore(
  'records',
  () => {
    const records = ref<TimerRecord[]>([])

    function addRecord(payload: Omit<TimerRecord, 'id' | 'savedAtMs'>) {
      records.value.unshift({
        id: newId(),
        savedAtMs: nowMs(),
        ...payload,
      })
    }

    function remove(id: string) {
      records.value = records.value.filter((r) => r.id !== id)
    }

    function clear() {
      records.value = []
    }

    return { records, addRecord, remove, clear }
  },
  {
    persist: {
      key: 'timer_records_v1',
      storage: localStorage,
      pick: ['records'],
    },
  }
)