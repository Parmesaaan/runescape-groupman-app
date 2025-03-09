import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import {useStore} from "../stores";

const routes: Array<RouteRecordRaw> = [
    { path: '/login', name: 'Login', component: Login },
    { path: '/dash', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    {
        path: '/',
        name: 'Home',
        redirect: () => {
            const store = useStore()
            if (store.isAuthenticated) {
                return '/dash'
            } else {
                return '/login'
            }
        }
    },
]

const useRouter = createRouter({
    history: createWebHistory(),
    routes,
})

useRouter.beforeEach((to, from, next) => {
    const store = useStore()

    if (to.meta.requiresAuth && !store.isAuthenticated) {
        next("/login")
    } else if (to.path === '/login' && store.isAuthenticated) {
        next('/dash')
    } else {
        next()
    }
})

export default useRouter
