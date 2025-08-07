<script setup>
import { Fertility } from '@/icons'
defineProps({
  status: String,
})
</script>
<template>
  <div
    class="rounded-2xl bg-asparagus border p-5 flex flex-col justify-center items-center text-center text-white dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
  >
    <component :is="Fertility" class="w-6 h-6 fill-current text-white text-5xl mb-2" />
    <h3 class="text-lg font-semibold">Soil Fertility Status</h3>
    <p class="text-4xl font-bold">{{ status?.toUpperCase?.() || '-' }}</p>
    <p class="text-sm mt-1">Based on ML Analysis</p>
  </div>
</template>
