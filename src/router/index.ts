import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import SettingsPage from '../views/SettingsPage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/dashboard', name: 'Dashboard', component: DashboardPage },
  { path: '/profile', name: 'Profile', component: ProfilePage },
  { path: '/settings', name: 'Settings', component: SettingsPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const protectedRoutes = ['Dashboard', 'Profile', 'Settings']

router.beforeEach((to, _from) => {
  const saved = sessionStorage.getItem('bn_user')
  const isLoggedIn = !!saved

  if (protectedRoutes.includes(to.name as string) && !isLoggedIn) {
    return { name: 'Login' }
  }

  if (to.name === 'Login' && isLoggedIn) {
    return { name: 'Dashboard' }
  }
})

export default router
