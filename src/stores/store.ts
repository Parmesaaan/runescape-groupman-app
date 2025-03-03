import { defineStore } from 'pinia';
import {Credentials, Profile, TokenPair} from "../models";
import {BackendService} from "../services";

export const useStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        tokenPair: null as TokenPair | null,
        profile: null as Profile | null
    }),

    actions: {
        async login(credentials: Credentials) {
            this.tokenPair = await BackendService.login(credentials)

            if(this.tokenPair) {
                this.isAuthenticated = true
                this.profile = await BackendService.getProfile()
                localStorage.setItem('token', this.tokenPair.token)
                localStorage.setItem('refreshToken', this.tokenPair.refreshToken)
            }
        },

        logout() {
            this.isAuthenticated = false
            this.tokenPair = null
            this.profile = null

            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
        },

        async initialize() {
            const storedToken = localStorage.getItem('token')
            const storedRefreshToken = localStorage.getItem('refreshToken')

            if (storedToken && storedRefreshToken) {
                this.tokenPair = await BackendService.refreshToken(storedRefreshToken)

                if (this.tokenPair) {
                    this.isAuthenticated = true
                    this.profile = await BackendService.getProfile()
                    localStorage.setItem('token', this.tokenPair.token)
                    localStorage.setItem('refreshToken', this.tokenPair.refreshToken)
                }
            }
        },
    },
})
