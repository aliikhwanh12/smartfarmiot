<script setup>
defineProps({
  title: String,
  value: [Number, String],
  unit: String,
  status: String,
  icon: Object, // atau String kalau register global
})
</script>

<template>
  <div class="rounded-2xl border p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <div class="flex items-center">
      <component :is="icon" class="w-6 h-6 fill-current text-green-500" />
      <span class="ml-2 text-m text-gray-500 dark:text-gray-400">{{ title }}</span>
    </div>

    <div class="mt-2">
      <div class="flex items-end">
        <h4 class="font-bold text-gray-800 text-title-sm dark:text-white/90">{{ value }}</h4>
        <h6 class="font-bold ml-2 text-gray-800 dark:text-white/90">{{ unit }}</h6>
      </div>
    </div>
  </div>
</template>
