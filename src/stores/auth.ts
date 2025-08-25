import { defineStore } from 'pinia'
import { ref } from 'vue'
import { doc, updateDoc } from 'firebase/firestore'
import { fs } from '@/firebaseConfig'
export interface User {
  uid: string | null
  email: string | null
  name: string | null
  device_id: string | null
  mode: string | null
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)

    const setUser = (newUser: User | null) => {
      user.value = newUser
    }
    const setMode = async (newMode: string) => {
      if (user.value?.uid) {
        try {
          // update Firestore
          const userRef = doc(fs, 'users', user.value.uid)
          await updateDoc(userRef, { threshold_mode: newMode })

          // update state Pinia
          user.value = { ...user.value, mode: newMode }
        } catch (err) {
          console.error('Gagal update mode:', err)
        }
      }
    }

    const clearUser = () => {
      user.value = null
    }

    return { user, setUser, clearUser, setMode }
  },
  {
    persist: true, // ini penting supaya mode tersimpan di localStorage
  },
)
