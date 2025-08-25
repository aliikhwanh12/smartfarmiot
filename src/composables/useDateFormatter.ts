// composables/useDateFormatter.ts
export function useDateFormatter() {
  function formatDateTime(value: string | number | Date | null) {
    if (!value) return '-'

    return new Date(value).toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return { formatDateTime }
}
