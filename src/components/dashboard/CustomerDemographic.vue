<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6"
  >
    <div class="flex justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          Provinsi dengan Aktivitas Sensor Tertinggi
        </h3>
        <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Menampilkan distribusi data sensor berdasarkan wilayah provinsi di Indonesia.
        </p>
      </div>
    </div>
    <div
      ref="mapOneRef"
      id="map"
      class="my-6 overflow-hidden border border-gray-200 rounded-2xl"
    ></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'

const map = ref(null)
let geojson // Tambahkan di atas onMounted()
onMounted(async () => {
  map.value = L.map('map', {
    zoomControl: false, // Sembunyikan kontrol zoom
    scrollWheelZoom: false, // Disable zoom pakai scroll
    doubleClickZoom: false, // Disable zoom pakai double click
    touchZoom: false, // Disable pinch zoom di mobile
    dragging: true, // Opsional: tetap bisa digeser
    zoomSnap: 0, // Supaya tidak snap ke level tertentu
  }).setView([-2.5, 118], 5) // Tengah Indonesia

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map.value)

  // Ambil GeoJSON provinsi Indonesia
  try {
    const response = await fetch('/data/indogeojson.json')
    if (!response.ok) throw new Error('File GeoJSON tidak ditemukan')
    const geoData = await response.json()

    const sensorData = {
      Aceh: 28,
      'Sumatera Utara': 29,
      Jakarta: 34,
      'Jawa Barat': 32,
      'Jawa Tengah': 31,
      'Jawa Timur': 33,
      Bali: 30,
    }

    const getColor = (value) => {
      return value > 33
        ? '#800026'
        : value > 32
          ? '#BD0026'
          : value > 30
            ? '#E31A1C'
            : value > 28
              ? '#FC4E2A'
              : value > 26
                ? '#FD8D3C'
                : value > 24
                  ? '#FEB24C'
                  : value > 22
                    ? '#FED976'
                    : '#FFEDA0'
    }

    const style = (feature) => {
      const name = feature.properties?.PROVINSI || feature.properties?.NAME_1
      const value = sensorData[name] || 0

      return {
        fillColor: getColor(value),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
      }
    }

    function highlightFeature(e) {
      const layer = e.target
      layer.setStyle({
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.9,
      })
      layer.bringToFront()
    }

    function resetHighlight(e) {
      geojson.resetStyle(e.target)
    }

    const onEachFeature = (feature, layer) => {
      const name = feature.properties?.PROVINSI || feature.properties?.NAME_1
      const value = sensorData[name] ?? 'N/A'
      layer.bindPopup(`<strong>${name}</strong><br>Temperature: ${value} °C`)
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
      })
    }
    geojson = L.geoJSON(geoData, {
      style,
      onEachFeature,
    }).addTo(map.value)
  } catch (err) {
    console.error('Gagal memuat GeoJSON:', err)
  }
})
</script>

<style scoped>
#map {
  height: 450px;
}
</style>
