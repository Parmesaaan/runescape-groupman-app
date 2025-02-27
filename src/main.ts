import "./style.css"
import 'primeflex/primeflex.css'

import { createApp } from "vue"
import PrimeVue from "primevue/config"
import Aura from "@primeuix/themes/aura"
import App from "./App.vue"
import router from "./router";
import {createPinia} from "pinia";
import { useAuthStore } from "./stores/auth"

const app = createApp(App);
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: "system",
        },
    },
});

const authStore = useAuthStore()
authStore.initialize()

app.mount("#app");