import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        authToken: null as string | null
    }),

    actions: {
        login(token: string) {
            this.isAuthenticated = true
            this.authToken = token

            localStorage.setItem('authToken', token)
        },

        logout() {
            this.isAuthenticated = false
            this.authToken = null

            localStorage.removeItem('authToken')
        },

        initialize() {
            const storedToken = localStorage.getItem('authToken');
            if (storedToken) {
                this.isAuthenticated = true;
                this.authToken = storedToken;
            }
        },
    },
})
