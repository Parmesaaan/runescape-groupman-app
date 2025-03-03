import "./style.css"
import 'primeflex/primeflex.css'

import { createApp } from "vue"
import PrimeVue from "primevue/config"
import Aura from "@primeuix/themes/aura"
import App from "./App.vue"
import router from "./router";
import {createPinia} from "pinia";
import {useStore} from "./stores"

const app = createApp(App);
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: 'system',
            prefix: 'p'
        },
    },
});

const authStore = useStore()
authStore.initialize()

app.mount("#app");