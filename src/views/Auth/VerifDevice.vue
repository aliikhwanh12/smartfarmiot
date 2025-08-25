<script setup lang="ts">
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import { ref } from 'vue'
import { PinInput, PinInputGroup, PinInputSlot } from '@/components/ui/pin-input'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { auth, fs } from '@/firebaseConfig'
import type { User } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { toast } from 'vue3-toastify'

const router = useRouter()
const deviceId = ref('')
const pinValue = ref<string[]>([])

const currentUser = ref<User | null>(null)
onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})
const handleLogin = async () => {
  try {
    if (!deviceId.value || pinValue.value.length === 0) {
      toast.error('Harap isi Device ID dan OTP')
      return
    }
    if (pinValue.value.length < 6) {
      toast.error('OTP harus 6 digit')
      return
    }
    if (!currentUser.value) {
      toast.error('Anda belum login ke akun')
      return
    }
    const normalizedDeviceId = deviceId.value.trim()
    const deviceRef = doc(fs, 'devices', normalizedDeviceId)
    const userRef = doc(fs, 'users', currentUser.value.uid)
    const snap = await getDoc(deviceRef)

    if (!snap.exists()) {
      toast.error('Device tidak ditemukan')
      return
    }

    const deviceData = snap.data()
    const enteredCode = pinValue.value.join('')

    if (deviceData.isClaimed) {
      toast.error('Device sudah diklaim oleh user lain')
      return
    }

    if (deviceData.code.toString() !== enteredCode) {
      toast.error('Kode OTP salah')
      return
    }

    // Update device agar terhubung ke user
    await updateDoc(deviceRef, {
      user_id: currentUser.value.uid,
      isClaimed: true,
      claimed_at: new Date().toISOString(),
      code: null,
    })

    await updateDoc(userRef, {
      device_id: normalizedDeviceId,
    })

    toast.success('Device berhasil diverifikasi')
    router.push('/')
  } catch (err) {
    toast.error((err as Error).message || 'Terjadi kesalahan')
  }
}

const handleLogout = () => {
  signOut(auth).then(() => {
    router.push('/')
  })
}
</script>

<template>
  <FullScreenLayout>
    <div
      class="min-h-screen bg-gradient-to-br from-asparagus to-yellowgreen flex items-center justify-center"
    >
      <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-5">
        <!-- Judul -->
        <div class="text-center space-y-2">
          <h2 class="text-2xl font-bold text-gray-800">Verifikasi Device</h2>
          <p class="text-sm text-gray-500">
            Masukkan Device ID dan kode OTP yang tertera di perangkat
          </p>
        </div>

        <!-- Input Device ID -->
        <Input
          id="deviceId"
          v-model="deviceId"
          type="text"
          placeholder="Masukkan Device ID"
          class="w-full bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-green-500"
        />

        <!-- Input OTP -->
        <div class="flex justify-center">
          <PinInput otp type="text" id="pin-input" v-model="pinValue" placeholder="">
            <PinInputGroup class="gap-3">
              <PinInputSlot
                v-for="(_, index) in 6"
                :key="index"
                :index="index"
                class="w-12 h-12 text-lg rounded-md border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-green-500"
              />
            </PinInputGroup>
          </PinInput>
        </div>

        <!-- Tombol Aksi -->
        <div class="flex gap-4 pt-2">
          <Button
            variant="outline"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
            @click="handleLogout"
          >
            Logout
          </Button>
          <Button class="flex-1 bg-green-600 hover:bg-green-700 text-white" @click="handleLogin">
            Login
          </Button>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>
