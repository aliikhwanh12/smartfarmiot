import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebaseConfig'
import type { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { fs } from '@/firebaseConfig' // pakai alias @ jika sudah di-setup, atau relatif path
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/DashboardPage.vue'),
      meta: {
        title: 'Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: '/konfigurasi',
      name: 'Konfigurasi',
      component: () => import('../views/KonfigurasiPage.vue'),
      meta: {
        title: 'Konfigurasi',
        requiresAuth: true,
      },
    },
    {
      path: '/profil',
      name: 'Profil',
      component: () => import('../views/ProfilPage.vue'),
      meta: {
        title: 'Profil',
        requiresAuth: true,
      },
    },
    {
      path: '/riwayat',
      name: 'Riwayat',
      component: () => import('../views/RiwayatPage.vue'),
      meta: {
        title: 'Riwayat',
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Auth/SignIn.vue'),
      meta: {
        title: 'SignIn',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/SignUp.vue'),
      meta: {
        title: 'SignUp',
      },
    },
    {
      path: '/verify-device',
      name: 'Verify Device',
      component: () => import('../views/Auth/VerifDevice.vue'),
      meta: {
        title: 'Verify Device',
      },
    },
  ],
})

const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener()
        // cast user ke tipe User | null
        resolve(user as User | null)
      },
      reject,
    )
  })
}

export default router

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title} | MidoriFarm`

  const currentUser: User | null = await getCurrentUser()

  // Jika route membutuhkan auth
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!currentUser) return next('/login')

    const userRef = doc(fs, 'users', currentUser.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) return next('/login')

    const userData = userSnap.data() as { device_id?: string }

    // Jika user belum klaim device, arahkan ke verify-device
    if (!userData.device_id) {
      if (to.path !== '/verify-device') return next('/verify-device')
      return next()
    }

    // Jika user sudah punya device_id, jangan bisa akses verify-device
    if (to.path === '/verify-device') return next('/')

    return next()
  }

  // Route untuk login/signup
  if (to.path === '/login' || to.path === '/signup') {
    if (currentUser) {
      const userRef = doc(fs, 'users', currentUser.uid)
      const userSnap = await getDoc(userRef)
      const userData = userSnap.exists() ? (userSnap.data() as { device_id?: string }) : null

      if (userData && !userData.device_id) return next('/verify-device')
      return next('/')
    }
    return next()
  }

  return next()
})
