<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div
      class="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-8"
    >
      <div class="xl:flex justify-content-start align-items-center mb-8">
        <div class="w-full flex justify-content-start">
          <img class="w-20 h-auto mx-10" src="/images/other/hardware.svg" alt="Hardware" />
          <div class="ms-5 space-y-2">
            <div>
              <h3 class="text-sm xl:text-base">Device ID:</h3>
              <h1 class="text-xl xl:text-4xl">
                <strong>{{ auth.user?.device_id }}</strong>
              </h1>
            </div>
            <Badge variant="outline">Status: Online</Badge>
            <Badge variant="outline">Version: 1</Badge>
            <Badge variant="outline">Latitude: -6.308258 </Badge>
            <Badge variant="outline">Longitude: 107.159702</Badge>

            <p class="text-sm">Mode Threshold :</p>
            <div class="flex items-center space-x-2">
              <Label for="mode">Manual</Label>
              <Switch
                id="mode"
                :model-value="isAuto"
                @update:model-value="
                  async (val: boolean) => {
                    const newMode = val ? 'auto' : 'manual'
                    await auth.setMode(newMode)
                    fetchThreshold()
                  }
                "
              />
              <Label for="mode">Auto</Label>
            </div>
          </div>
        </div>
        <Button
          class="mt-5 w-full ml-auto xl:mt-auto xl:w-auto"
          :disabled="isAuto"
          @click="saveThreshold"
        >
          <Save class="w-4 h-4" />Simpan Perubahan</Button
        >
      </div>
      <Table class="xl:text-base border border-gray-300 rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead class="text-center">Nama Sensor </TableHead>
            <TableHead class="text-center">Nilai Terendah</TableHead>
            <TableHead class="text-center">Nilai Tertinggi</TableHead>
            <TableHead class="text-center">Satuan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in sensors" :key="row.name">
            <TableCell class="text-center">{{ row.name }}</TableCell>
            <TableCell>
              <div class="flex justify-center">
                <NumberField
                  id="min"
                  :model-value="row.min"
                  @update:model-value="(v) => (row.min = v)"
                  :min="0"
                  class="w-50"
                  :disabled="isAuto"
                >
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex justify-center">
                <NumberField
                  id="min"
                  :model-value="row.max"
                  @update:model-value="(v) => (row.max = v)"
                  :min="0"
                  class="w-50"
                  :disabled="isAuto"
                >
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField></div
            ></TableCell>
            <TableCell class="text-center">{{ row.unit }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { fs } from '@/firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { Switch } from '@/components/ui/switch'
import { Save } from '@/icons'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'
import { Button } from '@/components/ui/button'
const currentPageTitle = ref('Konfigurasi Perangkat')
const auth = useAuthStore()
if (!auth.user || !auth.user.device_id) {
  console.error('Device ID tidak tersedia')
}

interface SensorThreshold {
  id: string
  name: string
  min: number
  max: number
  unit: string
}
const sensors = ref<SensorThreshold[]>([])
const isAuto = computed(() => auth.user?.mode == 'auto')
const mode = computed(() => (isAuto.value ? 'auto' : 'manual'))
const fetchThreshold = async () => {
  try {
    if (!auth.user?.device_id) {
      throw new Error('Device ID tidak tersedia')
    }

    const docRef = doc(fs, 'devices', auth.user.device_id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      toast.error(`Data device ${auth.user.device_id} tidak ditemukan`, {
        position: 'bottom-right',
      })
      return
    }
    const deviceData = docSnap.data()
    const threshold = deviceData.thresholds?.[mode.value]

    sensors.value = [
      {
        id: 'air_temp',
        name: 'Suhu Udara',
        min: threshold.air_temp?.min ?? 0,
        max: threshold.air_temp?.max ?? 0,
        unit: '°C',
      },
      {
        id: 'humidity',
        name: 'Kelembapan Udara',
        min: threshold.humidity?.min ?? 0,
        max: threshold.humidity?.max ?? 0,
        unit: '%',
      },
      {
        id: 'light_intensity',
        name: 'Sinar UV',
        min: threshold.light_intensity?.min ?? 0,
        max: threshold.light_intensity?.max ?? 0,
        unit: 'UV Index',
      },
      {
        id: 'soil_temp',
        name: 'Suhu Tanah',
        min: threshold.soil_temp?.min ?? 0,
        max: threshold.soil_temp?.max ?? 0,
        unit: '°C',
      },
      {
        id: 'moisture',
        name: 'Kelembapan Tanah',
        min: threshold.moisture?.min ?? 0,
        max: threshold.moisture?.max ?? 0,
        unit: '%',
      },
      {
        id: 'ph_value',
        name: 'pH Tanah',
        min: threshold.ph_value?.min ?? 0,
        max: threshold.ph_value?.max ?? 0,
        unit: 'pH',
      },
      {
        id: 'ec_value',
        name: 'Salinitas',
        min: threshold.ec_value?.min ?? 0,
        max: threshold.ec_value?.max ?? 0,
        unit: 'mS/cm',
      },
      {
        id: 'N_value',
        name: 'Nilai N',
        min: threshold.N_value?.min ?? 0,
        max: threshold.N_value?.max ?? 0,
        unit: 'mg/kg',
      },
      {
        id: 'P_value',
        name: 'Nilai P',
        min: threshold.P_value?.min ?? 0,
        max: threshold.P_value?.max ?? 0,
        unit: 'mg/kg',
      },
      {
        id: 'K_value',
        name: 'Nilai K',
        min: threshold.K_value?.min ?? 0,
        max: threshold.K_value?.max ?? 0,
        unit: 'mg/kg',
      },
    ]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.error(err.message || 'Terjadi kesalahan', {
      position: 'bottom-right',
    })
    console.log(err.message)
  }
}
const saveThreshold = async () => {
  if (!auth.user?.device_id) return
  const docRef = doc(fs, 'devices', auth.user.device_id)
  const updatedThresholds = { ...((await getDoc(docRef)).data()?.thresholds || {}) }
  updatedThresholds[mode.value] = sensors.value.reduce(
    (acc, s) => {
      acc[s.id] = { min: s.min, max: s.max }
      return acc
    },
    {} as Record<string, { min: number; max: number }>,
  )
  await updateDoc(docRef, { thresholds: updatedThresholds })
  toast.success('Threshold berhasil disimpan', { position: 'bottom-right' })
}

onMounted(() => {
  fetchThreshold()
})
</script>

<style></style>
