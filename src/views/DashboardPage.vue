<script setup>
import AdminLayout from '../components/layout/AdminLayout.vue'
import SensorMetrics from '../components/dashboard/SensorMetrics.vue'
import FertilityCard from '../components/dashboard/FertilityCard.vue'
import WeatherCard from '../components/dashboard/WeatherCard.vue'
import CustomerDemographic from '../components/dashboard/CustomerDemographic.vue'
import StatisticsChart from '../components/dashboard/StatisticsChart.vue'
import { getDatabase, ref as dbref, onValue } from 'firebase/database'
import { ref, computed, onMounted } from 'vue'

import {
  AirTemp,
  AirHumi,
  SoilTemp,
  SoilHumi,
  SoilpH,
  SoilN,
  SoilP,
  SoilK,
  Salinity,
  Light,
  History,
} from '../icons'
import { markRaw, reactive } from 'vue'
const timestampp = ref(null)
const formattedTime = computed(() => {
  return timestampp.value
    ? new Date(timestampp.value).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '-'
})

const grafik = reactive({
  lingkungan: [],
  tanah: [],
  nutrisi: [],
})

const fetchChartData = async () => {
  try {
    const res = await fetch(
      'https://getchartdata-19576946914.asia-southeast2.run.app?user_id=unknown_user',
    )
    const data = await res.json()

    grafik.lingkungan = data.lingkungan || []
    grafik.tanah = data.tanah || []
    grafik.nutrisi = data.nutrisi || []
  } catch (err) {
    console.error('Fetch Error:', err)
  }
}
const sensors = reactive([
  {
    key: 'air_temp',
    name: 'Suhu Udara',
    value: 28,
    unit: '°C',
    icon: markRaw(AirTemp),
    min: 20,
    max: 30,
  },
  {
    key: 'humidity',
    name: 'Kelembapan',
    value: 60,
    unit: '%',
    icon: markRaw(AirHumi),
    min: 40,
    max: 70,
  },
  {
    key: 'light_intensity',
    name: 'Sinar UV',
    value: 5.6,
    unit: 'UV Index',
    icon: markRaw(Light),
    min: 0,
    max: 8,
  },
  {
    key: 'moisture',
    name: 'Basah Tanah',
    value: 45,
    unit: '%',
    icon: markRaw(SoilHumi),
    min: 30,
    max: 60,
  },
  {
    key: 'soil_temp',
    name: 'Suhu Tanah',
    value: 26,
    unit: '°C',
    icon: markRaw(SoilTemp),
    min: 20,
    max: 32,
  },
  {
    key: 'ph_value',
    name: 'pH Tanah',
    value: 6.8,
    unit: 'pH',
    icon: markRaw(SoilpH),
    min: 5.5,
    max: 7.5,
  },
  {
    key: 'ec_value',
    name: 'Salinitas',
    value: 1.2,
    unit: 'mS/cm',
    icon: markRaw(Salinity),
    min: 0.5,
    max: 2.5,
  },
  {
    key: 'N_value',
    name: 'Nilai N',
    value: 300,
    unit: 'mg/kg',
    icon: markRaw(SoilN),
    min: 250,
    max: 500,
  },
  {
    key: 'P_value',
    name: 'Nilai P',
    value: 25,
    unit: 'mg/kg',
    icon: markRaw(SoilP),
    min: 15,
    max: 50,
  },
  {
    key: 'K_value',
    name: 'Nilai K',
    value: 210,
    unit: 'mg/kg',
    icon: markRaw(SoilK),
    min: 150,
    max: 300,
  },
])

onMounted(() => {
  const db = getDatabase()
  const dbbref = dbref(db, 'users/unknown_user/devices/SM5c264cda3bd8PL/current_data')

  onValue(dbbref, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      sensors.forEach((sensor) => {
        if (data[sensor.key] !== undefined) {
          sensor.value = data[sensor.key]
        }
      })
      timestampp.value = data.timestamp
    }
  })
  fetchChartData()
})
</script>

<template>
  <admin-layout>
    <div
      class="flex flex-wrap items-center justify-between gap-3 mb-6 text-gray-800 dark:text-white/90"
    >
      <h2 class="text-xl font-semibold" x-text="pageTitle">Dasbor</h2>
      <div class="flex items-center gap-1.5">
        <component :is="History" />
        <p>Terakhir update :</p>
        <p class="font-light">{{ formattedTime }}</p>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 pb-2 md:gap-6">
      <div class="col-span-12 xl:col-span-5">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          <div v-for="(sensor, index) in sensors" :key="index">
            <!-- Komponen metrics atau isi card -->
            <sensor-metrics
              :title="sensor.name"
              :value="sensor.value"
              :unit="sensor.unit"
              :icon="sensor.icon"
            />
          </div>
        </div>
      </div>

      <!-- <monthly-target /> -->
      <div class="col-span-12 xl:col-span-7">
        <div class="grid grid-cols-1 gap-4 md:gap-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            <weather-card />
            <fertility-card status="Optimal" />
          </div>

          <statistics-chart :series="grafik" />
        </div>
      </div>
    </div>
    <div class="col-span-12 py-2">
      <customer-demographic />
    </div>
  </admin-layout>
</template>
