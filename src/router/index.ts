import { createRouter, createWebHistory } from 'vue-router'

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
      },
    },
    {
      path: '/konfigurasi',
      name: 'Konfigurasi',
      component: () => import('../views/KonfigurasiPage.vue'),
      meta: {
        title: 'Konfigurasi',
      },
    },
    {
      path: '/profil',
      name: 'Profil',
      component: () => import('../views/ProfilPage.vue'),
      meta: {
        title: 'Profil',
      },
    },
    {
      path: '/riwayat',
      name: 'Riwayat',
      component: () => import('../views/RiwayatPage.vue'),
      meta: {
        title: 'Riwayat',
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
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | MidoriFarm`
  next()
})
