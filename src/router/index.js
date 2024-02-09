import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { auth: true }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

// const getAuthenticatedUser = async () => {
//   const { username, signInDetails } = await getCurrentUser()

//   const { tokens: session } = await fetchAuthSession()

//   // Note that session will no longer contain refreshToken and clockDrift
//   return {
//     username,
//     session,
//     authenticationFlowType: signInDetails.authFlowType
//   }
// }

router.beforeEach((to) => {
  if (to.meta.auth) {
    router.push({ name: 'home' })
  }
})

export default router
