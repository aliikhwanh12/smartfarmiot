<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div
      class="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-5"
    >
      <div class="space-y-4">
        <!-- Filter dan Export -->
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  class="w-full sm:w-[280px] justify-start text-left font-normal"
                >
                  <Calendar class="mr-2 h-4 w-4" />
                  {{ formatter.custom(toDate(value.start), { dateStyle: 'medium' }) }} -
                  {{ formatter.custom(toDate(value.end), { dateStyle: 'medium' }) }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="z-[99999] max-w-[95vw] sm:w-auto p-0">
                <RangeCalendarRoot
                  v-slot="{ weekDays }"
                  v-model="value"
                  v-model:placeholder="placeholder"
                  class="p-3"
                >
                  <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
                    <div class="flex flex-col gap-4">
                      <div class="flex items-center justify-between">
                        <button
                          :class="
                            cn(
                              buttonVariants({ variant: 'outline' }),
                              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                            )
                          "
                          @click="updateMonth('first', -1)"
                        >
                          <ChevronLeft class="h-4 w-4" />
                        </button>
                        <div :class="cn('text-sm font-medium')">
                          {{ formatter.fullMonthAndYear(toDate(firstMonth.value)) }}
                        </div>
                        <button
                          :class="
                            cn(
                              buttonVariants({ variant: 'outline' }),
                              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                            )
                          "
                          @click="updateMonth('first', 1)"
                        >
                          <ChevronRight class="h-4 w-4" />
                        </button>
                      </div>
                      <RangeCalendarGrid>
                        <RangeCalendarGridHead>
                          <RangeCalendarGridRow>
                            <RangeCalendarHeadCell
                              v-for="day in weekDays"
                              :key="day"
                              class="w-full"
                            >
                              {{ day }}
                            </RangeCalendarHeadCell>
                          </RangeCalendarGridRow>
                        </RangeCalendarGridHead>
                        <RangeCalendarGridBody>
                          <RangeCalendarGridRow
                            v-for="(weekDates, index) in firstMonth.rows"
                            :key="`weekDate-${index}`"
                            class="mt-2 w-full"
                          >
                            <RangeCalendarCell
                              v-for="weekDate in weekDates"
                              :key="weekDate.toString()"
                              :date="weekDate"
                            >
                              <RangeCalendarCellTrigger :day="weekDate" :month="firstMonth.value" />
                            </RangeCalendarCell>
                          </RangeCalendarGridRow>
                        </RangeCalendarGridBody>
                      </RangeCalendarGrid>
                    </div>
                    <div class="flex flex-col gap-4">
                      <div class="flex items-center justify-between">
                        <button
                          :class="
                            cn(
                              buttonVariants({ variant: 'outline' }),
                              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                            )
                          "
                          @click="updateMonth('second', -1)"
                        >
                          <ChevronLeft class="h-4 w-4" />
                        </button>
                        <div :class="cn('text-sm font-medium')">
                          {{ formatter.fullMonthAndYear(toDate(secondMonth.value)) }}
                        </div>

                        <button
                          :class="
                            cn(
                              buttonVariants({ variant: 'outline' }),
                              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                            )
                          "
                          @click="updateMonth('second', 1)"
                        >
                          <ChevronRight class="h-4 w-4" />
                        </button>
                      </div>
                      <RangeCalendarGrid>
                        <RangeCalendarGridHead>
                          <RangeCalendarGridRow>
                            <RangeCalendarHeadCell
                              v-for="day in weekDays"
                              :key="day"
                              class="w-full"
                            >
                              {{ day }}
                            </RangeCalendarHeadCell>
                          </RangeCalendarGridRow>
                        </RangeCalendarGridHead>
                        <RangeCalendarGridBody>
                          <RangeCalendarGridRow
                            v-for="(weekDates, index) in secondMonth.rows"
                            :key="`weekDate-${index}`"
                            class="mt-2 w-full"
                          >
                            <RangeCalendarCell
                              v-for="weekDate in weekDates"
                              :key="weekDate.toString()"
                              :date="weekDate"
                            >
                              <RangeCalendarCellTrigger
                                :day="weekDate"
                                :month="secondMonth.value"
                              />
                            </RangeCalendarCell>
                          </RangeCalendarGridRow>
                        </RangeCalendarGridBody>
                      </RangeCalendarGrid>
                    </div>
                  </div>
                </RangeCalendarRoot>
              </PopoverContent>
            </Popover>
            <Button variant="default" @click="refreshData"> Refresh </Button>
            <Button variant="default" @click="exportToCSV"> Export CSV </Button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  v-for="col in columns"
                  :key="col.id"
                  @click="sortBy(col.id)"
                  class="cursor-pointer"
                >
                  {{ col.label }}
                  <ArrowUpDown class="ml-1 h-4 w-4 inline" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in paginatedRows" :key="row.timestamp">
                <TableCell>{{ formatDate(row.timestamp) }}</TableCell>
                <TableCell :class="highlightPH(row.ph_value)">{{ row.ph_value }}</TableCell>
                <TableCell>{{ row.ec_value }}</TableCell>
                <TableCell>{{ row.moisture }}%</TableCell>
                <TableCell>{{ row.soil_temp }}°C</TableCell>
                <TableCell>{{ row.N_value }}</TableCell>
                <TableCell>{{ row.P_value }}</TableCell>
                <TableCell>{{ row.K_value }}</TableCell>
                <TableCell :class="highlightTemp(row.air_temp)">{{ row.air_temp }}°C</TableCell>
                <TableCell>{{ row.humidity }}%</TableCell>
                <TableCell>{{ row.light_intensity }} lx</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div class="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            Menampilkan {{ paginatedRows.length }} dari {{ filteredRows.length }} data
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Sebelumnya
            </Button>
            <span class="text-sm">{{ currentPage }} / {{ totalPages }}</span>
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button, buttonVariants } from '@/components/ui/button'
import { ArrowUpDown, Calendar, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendarRoot, useDateFormatter } from 'reka-ui'
import { CalendarDate, isEqualMonth, today } from '@internationalized/date'
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
} from '@/components/ui/range-calendar'
import { createMonth, toDate } from 'reka-ui/date'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
const currentPageTitle = ref('Riwayat')
const sensorData = ref([
  {
    timestamp: '2025-07-18T08:30:00Z',
    ph_value: 6.8,
    ec_value: 1.2,
    moisture: 45,
    soil_temp: 28,
    N_value: 25,
    P_value: 10,
    K_value: 40,
    air_temp: 32,
    humidity: 60,
    light_intensity: 15000,
  },
  {
    timestamp: '2025-07-18T09:30:00Z',
    ph_value: 4.2,
    ec_value: 2.1,
    moisture: 22,
    soil_temp: 30,
    N_value: 15,
    P_value: 5,
    K_value: 30,
    air_temp: 37,
    humidity: 80,
    light_intensity: 17000,
  },
])
const todayy = today()
const tomorrow = todayy.add({ days: 1 })
const value = ref({
  start: todayy,
  end: tomorrow,
})

const locale = ref('en-US')
const formatter = useDateFormatter(locale.value)

const placeholder = ref(value.value.start)
const secondMonthPlaceholder = ref(value.value.end)

const firstMonth = ref(
  createMonth({
    dateObj: placeholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
)

const secondMonth = ref(
  createMonth({
    dateObj: secondMonthPlaceholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
)

function updateMonth(reference, months) {
  if (reference === 'first') {
    placeholder.value = placeholder.value.add({ months })
  } else {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({ months })
  }
}

watch(placeholder, (_placeholder) => {
  firstMonth.value = createMonth({
    dateObj: _placeholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(secondMonthPlaceholder.value, _placeholder)) {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({ months: 1 })
  }
})

watch(secondMonthPlaceholder, (_secondMonthPlaceholder) => {
  secondMonth.value = createMonth({
    dateObj: _secondMonthPlaceholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(_secondMonthPlaceholder, placeholder.value)) {
    placeholder.value = placeholder.value.subtract({ months: 1 })
  }
})

const sortKey = ref('timestamp')
const sortAsc = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(10)

const columns = [
  { id: 'timestamp', label: 'Timestamp' },
  { id: 'ph_value', label: 'pH' },
  { id: 'ec_value', label: 'EC' },
  { id: 'moisture', label: 'Moisture' },
  { id: 'soil_temp', label: 'Soil Temp' },
  { id: 'N_value', label: 'N' },
  { id: 'P_value', label: 'P' },
  { id: 'K_value', label: 'K' },
  { id: 'air_temp', label: 'Air Temp' },
  { id: 'humidity', label: 'Humidity' },
  { id: 'light_intensity', label: 'Light' },
]

const filteredRows = computed(() => {
  let rows = [...sensorData.value]

  const startDate = new Date(toDate(value.value.start)).getTime()
  const endDate = new Date(toDate(value.value.end)).getTime()

  rows = rows.filter((row) => {
    const time = new Date(row.timestamp).getTime()
    return time >= startDate && time <= endDate
  })

  rows.sort((a, b) => {
    if (sortAsc.value) return a[sortKey.value] > b[sortKey.value] ? 1 : -1
    else return a[sortKey.value] < b[sortKey.value] ? 1 : -1
  })

  return rows
})
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRows.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredRows.value.length / itemsPerPage.value))
function sortBy(key) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function refreshData() {
  alert('Simulasi refresh data')
}

function exportToCSV() {
  const csvHeader = columns.map((c) => c.label).join(',')
  const csvBody = filteredRows.value
    .map((row) => columns.map((col) => row[col.id]).join(','))
    .join('\n')
  const blob = new Blob([csvHeader + '\n' + csvBody], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sensor-data.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function formatDate(isoStr) {
  return new Date(isoStr).toLocaleString()
}

function highlightPH(ph) {
  return ph < 5.5 ? 'bg-red-100 text-red-800 font-bold' : ''
}

function highlightTemp(temp) {
  return temp > 35 ? 'bg-orange-100 text-orange-800 font-bold' : ''
}
watch(filteredRows, () => {
  currentPage.value = 1
})
</script>

<style scoped></style>
