import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import {useAuthStore} from "../stores/auth.ts";

const routes: Array<RouteRecordRaw> = [
    { path: '/login', name: 'Login', component: Login },
    { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next("/login")
    } else {
        next()
    }
})

export default router
