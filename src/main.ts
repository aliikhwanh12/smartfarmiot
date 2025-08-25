import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import 'leaflet/dist/leaflet.css'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/stores/auth'
import { auth, fs } from '@/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(VueApexCharts)
pinia.use(piniaPluginPersistedstate) // <--- ini penting
app.use(pinia)
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
} as ToastContainerOptions)

const authStore = useAuthStore() // ✅ panggil store

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(fs, 'users', user.uid))
    if (userDoc.exists()) {
      const data = userDoc.data()
      const userData: User = {
        uid: user.uid,
        device_id: data.device_id,
        name: data.name,
        email: data.email,
        mode: data.threshold_mode || 'auto',
      }
      useAuthStore().setUser(userData) // ❌
    }
  } else {
    authStore.clearUser()
  }
})

app.mount('#app')
