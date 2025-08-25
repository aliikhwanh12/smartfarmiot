<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img src="/images/user/profile.jpg" alt="User" />
      </span>

      <span class="block mr-1 font-medium text-theme-sm"
        >{{ getTwoWords(authStore.user?.name || '') }}
      </span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ authStore.user?.name }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ authStore.user?.email }}
        </span>
      </div>

      <router-link
        to="/signin"
        @click="logOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Sign out
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon, LogoutIcon } from '@/icons'
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { auth } from '@/firebaseConfig'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
function getTwoWords(text: string): string {
  // Pisah string berdasarkan spasi
  const words = text.trim().split(/\s+/)

  // Ambil maksimal 2 kata pertama
  return words.slice(0, 2).join(' ')
}
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const router = useRouter()

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const logOut = () => {
  // Implement sign out logic here
  console.log('Signing out...')
  signOut(auth).then(() => {
    router.push('/')
  })
  closeDropdown()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleClickOutside = (event: { target: any }) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
