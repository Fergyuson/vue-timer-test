export function nowMs(): number {
  return Date.now()
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`
}

export function formatDateTimeRu(ms: number): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ms))
}