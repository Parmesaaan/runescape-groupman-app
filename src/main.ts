import "./style.css"
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import { createApp } from "vue"
import PrimeVue from "primevue/config"
import Aura from "@primeuix/themes/aura"
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import App from "./App.vue"
import useRouter from "./router";
import {createPinia} from "pinia";
import {useStore} from "./stores"

const app = createApp(App);
app.use(createPinia())

const authStore = useStore()
await authStore.initialize()

app.use(useRouter)
app.use(ToastService)
app.use(ConfirmationService)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: 'system',
            prefix: 'p',
        },
    }
});

app.mount("#app");