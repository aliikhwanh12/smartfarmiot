<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { Fertility, History } from '@/icons'
import { useDateFormatter } from '@/composables/useDateFormatter'

const { formatDateTime } = useDateFormatter()
defineProps<{
  data: {
    fertility_rank: string
    timestamp: string
    recommendation: string
  } | null
}>()

const getRankBadge = (rank: string) => {
  switch (rank) {
    case '1':
      return { label: 'Sangat Subur', variant: '-brand-500' }
    case '2':
      return { label: 'Subur', variant: '-asparagus' }
    case '3':
      return { label: 'Kurang Subur', variant: '-warning-500' }
    case '4':
      return { label: 'Tidak Subur', variant: '-error-500' }

    default:
      return { label: '-', variant: '-error-500' }
  }
}
</script>
<template>
  <div
    :class="[
      `rounded-2xl border p-5 flex flex-col justify-center items-center text-center text-white dark:border-gray-800 dark:bg-white/[0.03] md:p-6`,
      `bg${getRankBadge(data?.fertility_rank || '99').variant}`,
    ]"
  >
    <component :is="Fertility" class="w-6 h-6 fill-current text-white text-5xl mb-2" />
    <h3 class="text-lg font-semibold">Status Kesuburan Tanah:</h3>
    <p class="text-4xl font-bold">
      {{ getRankBadge(data?.fertility_rank || '99').label.toUpperCase() }}
    </p>
    <p class="text-sm mt-1">{{ data?.recommendation }}</p>
    <p class="text-sm mt-1 flex items-center">
      <History class="w-5 mr-2" /> {{ data?.timestamp ? formatDateTime(data.timestamp) : '-' }}
    </p>
  </div>
</template>
