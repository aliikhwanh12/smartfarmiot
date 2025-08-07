<script setup>
import { Sunny } from '@/icons'
</script>
<template>
  <div
    class="flex border w-full h-full flex-col md:flex-row mx-auto my-auto bg-white rounded-2xl overflow-hidden dark:border-gray-800"
  >
    <!-- Info Utama -->
    <div
      class="bg-gray-800 text-white w-full p-6 flex flex-col justify-center items-center dark:border-gray-800"
    >
      <div class="text-5xl font-bold font-mono">33&#176;<span class="text-jonquil">C</span></div>
      <div class="text-xl">Jakarta</div>
      <div class="text-md font-semibold">Indonesia</div>
    </div>

    <!-- Icon -->
    <div class="bg-white w-full flex justify-center items-center text-gray-800">
      <component :is="Sunny" class="mx-3 w-[120px] h-[120px]" />
    </div>
  </div>
</template>
