import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        token: null as string | null,
        refreshToken: null as string | null
    }),

    actions: {
        login(token: string, refreshToken: string) {
            this.isAuthenticated = true
            this.token = token
            this.refreshToken = refreshToken

            localStorage.setItem('token', token)
            localStorage.setItem('refreshToken', token)
        },

        logout() {
            this.isAuthenticated = false
            this.token = null

            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
        },

        initialize() {
            const storedToken = localStorage.getItem('token')
            const storedRefreshToken = localStorage.getItem('refreshToken')

            if (storedToken && storedRefreshToken) {
                this.isAuthenticated = true
                this.token = storedToken
                this.refreshToken = storedRefreshToken
            }
        },
    },
})
