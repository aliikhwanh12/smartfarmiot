import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import 'leaflet/dist/leaflet.css'
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCTI3qiIRGrnzKc0f6jJXGjL0tMUk9lZNM',
  authDomain: 'smartfarmiot-28e0f.firebaseapp.com',
  databaseURL: 'https://smartfarmiot-28e0f-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'smartfarmiot-28e0f',
  storageBucket: 'smartfarmiot-28e0f.firebasestorage.app',
  messagingSenderId: '1060521794829',
  appId: '1:1060521794829:web:1ee7d73135aeb26aaea444',
  measurementId: 'G-7HQ0JEWVZE',
}
initializeApp(firebaseConfig)

const app = createApp(App)

app.use(router)
app.use(VueApexCharts)

app.mount('#app')
