<script setup>
import AdminLayout from '../components/layout/AdminLayout.vue'
import SensorMetrics from '../components/dashboard/SensorMetrics.vue'
import CustomerDemographic from '../components/dashboard/CustomerDemographic.vue'
import StatisticsChart from '../components/dashboard/StatisticsChart.vue'
import { getDatabase, ref, onValue } from 'firebase/database'

const db = getDatabase()
const dbref = ref(db, 'users/unknown_user/devices/SM5c264cda3bd8PL/current_data')
onValue(dbref, (snapshot) => {
  const data = snapshot.val()
  if (data) {
    sensors.forEach((sensor) => {
      if (data[sensor.key] !== undefined) {
        sensor.value = data[sensor.key]
      }
    })
  }
})

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
} from '../icons'
import { markRaw, reactive } from 'vue'

const sensors = reactive([
  {
    key: 'air_temp',
    name: 'Suhu Udara',
    value: 28,
    unit: '°C',
    icon: markRaw(AirTemp),
    col: 'md:col-span-3',
    min: 20,
    max: 30,
  },
  {
    key: 'humidity',
    name: 'Kelembapan Udara',
    value: 60,
    unit: '%',
    icon: markRaw(AirHumi),
    col: 'md:col-span-3',
    min: 40,
    max: 70,
  },
  {
    key: 'light_intensity',
    name: 'Sinar UV',
    value: 5.6,
    unit: 'UV Index',
    icon: markRaw(Light),
    col: 'md:col-span-3',
    min: 0,
    max: 8,
  },
  {
    key: 'moisture',
    name: 'Kelembapan Tanah',
    value: 45,
    unit: '%',
    icon: markRaw(SoilHumi),
    col: 'md:col-span-3',
    min: 30,
    max: 60,
  },
  {
    key: 'soil_temp',
    name: 'Suhu Tanah',
    value: 26,
    unit: '°C',
    icon: markRaw(SoilTemp),
    col: 'md:col-span-2',
    min: 20,
    max: 32,
  },
  {
    key: 'ph_value',
    name: 'pH Tanah',
    value: 6.8,
    unit: 'pH',
    icon: markRaw(SoilpH),
    col: 'md:col-span-2',
    min: 5.5,
    max: 7.5,
  },
  {
    key: 'ec_value',
    name: 'Salinitas',
    value: 1.2,
    unit: 'mS/cm',
    icon: markRaw(Salinity),
    col: 'md:col-span-2',
    min: 0.5,
    max: 2.5,
  },
  {
    key: 'N_value',
    name: 'Nilai N',
    value: 300,
    unit: 'mg/kg',
    icon: markRaw(SoilN),
    col: 'md:col-span-2',
    min: 250,
    max: 500,
  },
  {
    key: 'P_value',
    name: 'Nilai P',
    value: 25,
    unit: 'mg/kg',
    icon: markRaw(SoilP),
    col: 'md:col-span-2',
    min: 15,
    max: 50,
  },
  {
    key: 'K_value',
    name: 'Nilai K',
    value: 210,
    unit: 'mg/kg',
    icon: markRaw(SoilK),
    col: 'md:col-span-2',
    min: 150,
    max: 300,
  },
])

const grafik = reactive({
  lingkungan: [
    {
      name: 'Suhu Udara',
      data: [
        28, 29, 30, 29, 27, 28, 30, 31, 29, 30, 29, 30, 28, 29, 30, 31, 30, 29, 28, 30, 31, 29, 28,
        29, 30, 31, 29, 28, 30, 31, 30,
      ],
    },
    {
      name: 'Kelembapan Udara',
      data: [
        75, 78, 80, 82, 79, 77, 75, 74, 76, 78, 80, 79, 77, 75, 76, 78, 80, 82, 81, 79, 78, 77, 75,
        74, 73, 75, 76, 77, 79, 78, 76,
      ],
    },
    {
      name: 'Sinar UV',
      data: [
        5, 6, 7, 8, 6, 5, 7, 8, 6, 5, 7, 8, 9, 6, 5, 6, 7, 8, 9, 6, 5, 7, 8, 9, 6, 5, 7, 6, 5, 8, 7,
      ],
    },
  ],
  tanah: [
    {
      name: 'Suhu Tanah',
      data: [
        26, 27, 28, 27, 26, 25, 27, 28, 27, 26, 25, 27, 28, 29, 27, 26, 27, 28, 29, 30, 29, 27, 26,
        25, 26, 27, 28, 27, 26, 25, 27,
      ],
    },
    {
      name: 'Kelembapan Tanah',
      data: [
        60, 62, 63, 64, 63, 62, 61, 60, 59, 58, 60, 62, 63, 65, 66, 67, 66, 65, 64, 63, 62, 61, 60,
        59, 58, 60, 61, 62, 63, 64, 65,
      ],
    },
    {
      name: 'pH Tanah',
      data: [
        6.5, 6.4, 6.3, 6.2, 6.1, 6.3, 6.4, 6.5, 6.3, 6.2, 6.1, 6.0, 6.2, 6.4, 6.3, 6.1, 6.2, 6.3,
        6.4, 6.2, 6.3, 6.4, 6.1, 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.3, 6.2,
      ],
    },
    {
      name: 'Salinitas',
      data: [
        0.3, 0.35, 0.32, 0.34, 0.36, 0.38, 0.37, 0.36, 0.34, 0.33, 0.35, 0.36, 0.37, 0.39, 0.38,
        0.37, 0.35, 0.34, 0.33, 0.32, 0.34, 0.36, 0.38, 0.37, 0.36, 0.35, 0.34, 0.33, 0.32, 0.31,
        0.3,
      ],
    },
  ],
  nutrisi: [
    {
      name: 'Nilai N',
      data: [
        12, 13, 14, 15, 13, 14, 15, 14, 13, 12, 14, 15, 16, 14, 13, 12, 14, 15, 16, 17, 15, 14, 13,
        12, 14, 15, 16, 17, 15, 14, 13,
      ],
    },
    {
      name: 'Nilai P',
      data: [
        9, 10, 11, 12, 11, 10, 9, 8, 10, 11, 12, 11, 10, 9, 10, 11, 12, 13, 11, 10, 9, 8, 9, 10, 11,
        12, 11, 10, 9, 10, 11,
      ],
    },
    {
      name: 'Nilai K',
      data: [
        7, 8, 9, 10, 9, 8, 7, 6, 8, 9, 10, 9, 8, 7, 8, 9, 10, 11, 9, 8, 7, 6, 7, 8, 9, 10, 9, 8, 7,
        8, 9,
      ],
    },
  ],
})
</script>

<template>
  <admin-layout>
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90" x-text="pageTitle">
      Dasbor
    </h2>
    <div class="grid grid-cols-1 xl:grid-cols-5 gap-4 py-2">
      <div v-for="(sensor, index) in sensors" :key="index">
        <!-- Komponen metrics atau isi card -->
        <sensor-metrics
          :title="sensor.name"
          :value="sensor.value"
          :unit="sensor.unit"
          :icon="sensor.icon"
        />
      </div>

      <!-- <monthly-target /> -->
    </div>
    <div class="col-span-12 py-2">
      <statistics-chart :series="grafik" />
    </div>

    <div class="col-span-12 py-2">
      <customer-demographic />
    </div>
  </admin-layout>
</template>
