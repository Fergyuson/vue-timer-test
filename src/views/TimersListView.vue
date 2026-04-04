<template>
  <div class="wrap">
    <div class="top">
      <h1>Список таймеров</h1>
      <RouterLink class="link" to="/timer">Назад к таймеру</RouterLink>
    </div>

    <div v-if="records.records.length === 0" class="empty">
      Пока нет сохранённых таймеров
    </div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Дата запуска</th>
          <th>Время</th>
          <th>Дата записи</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="r in records.records" :key="r.id">
          <td>{{ formatDateTimeRu(r.startedAtMs) }}</td>
          <td class="mono">{{ formatTime(r.durationMs) }}</td>
          <td>{{ formatDateTimeRu(r.savedAtMs) }}</td>
          <td>
            <button type="button" class="danger" @click="records.remove(r.id)">
              Удалить
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="records.records.length" class="footer">
      <button type="button" @click="records.clear()">Очистить всё</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRecordsStore } from '@/stores/records'
import { formatDateTimeRu, formatTime } from '@/shared/time'

const records = useRecordsStore()
</script>

<style scoped lang="scss">
.wrap {
  max-width: 900px;
  margin: 40px auto;
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

.empty {
  margin-top: 18px;
  color: #666;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

th,
td {
  border-bottom: 1px solid #e5e7eb;
  padding: 10px 8px;
  text-align: left;
  vertical-align: top;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
}

button {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #cfcfcf;
  background: #fff;
  cursor: pointer;
}

.danger {
  border-color: #ffb4b4;
}

.footer {
  margin-top: 14px;
}
</style>