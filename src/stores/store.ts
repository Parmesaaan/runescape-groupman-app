import { defineStore } from 'pinia';
import {Credentials, Profile, TokenPair} from "../models";
import {BackendService} from "../services";

export const useStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        tokenPair: null as TokenPair | null,
        lastTokenFetch: null as Date | null,
        profile: null as Profile | null
    }),

    actions: {
        async login(credentials: Credentials) {
            try {
                this.tokenPair = await BackendService.login(credentials)
            } catch (e) {
                return false
            }

            if(this.tokenPair) {
                this.isAuthenticated = true

                try {
                    this.profile = await BackendService.getProfile()
                } catch (e) {
                    return false
                }

                localStorage.setItem('token', this.tokenPair.token)
                localStorage.setItem('refreshToken', this.tokenPair.refreshToken)
            }

            return true
        },

        logout() {
            this.isAuthenticated = false
            this.tokenPair = null
            this.profile = null

            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
        },

        getProfile() {
            return this.profile
        },
        
        async updateProfile() {
            if (!this.isAuthenticated) return

            try {
                this.profile = await BackendService.getProfile()
            } catch (e) {
                return
            }
        },

        async initialize() {
            const storedToken = localStorage.getItem('token')
            const storedRefreshToken = localStorage.getItem('refreshToken')

            if (storedToken && storedRefreshToken) {
                try {
                    this.tokenPair = await BackendService.refreshToken(storedRefreshToken)
                } catch (e) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('refreshToken')
                    return
                }

                if (this.tokenPair) {
                    this.isAuthenticated = true

                    try {
                        this.profile = await BackendService.getProfile()
                    } catch (e) {
                        this.isAuthenticated = false
                        localStorage.removeItem('token')
                        localStorage.removeItem('refreshToken')
                        return
                    }

                    localStorage.setItem('token', this.tokenPair.token)
                    localStorage.setItem('refreshToken', this.tokenPair.refreshToken)
                }
            }
        },
    },
})
