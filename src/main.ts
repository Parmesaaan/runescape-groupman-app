import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"
import {createPinia} from "pinia"
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'

const app = createApp(App)
app.use(createPinia())
app.use(PrimeVue, {
    theme: {
        preset: Material,
        options: {
            prefix: 'p'
        }
    }
})
app.use(router)
app.mount('#app')