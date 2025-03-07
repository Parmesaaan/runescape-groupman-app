import {Credentials, Profile, TokenPair} from "../models";
import axios from "axios";
import {API_ROUTES, BASE_URL} from "../constants";
import {useStore} from "../stores";

export class BackendService {
  public static async signup(credentials: Credentials) {
    try {
      await axios.post(
        BASE_URL.concat(API_ROUTES.USERS.ACCESS.SIGNUP),
        credentials
      )
    } catch (e) {
      console.error('Signup error:', e)
    }
  }

  public static async login(credentials: Credentials): Promise<TokenPair | null> {
    try {
      const response = await axios.post(
        BASE_URL.concat(API_ROUTES.USERS.ACCESS.LOGIN),
        credentials
      )
      const { token, refreshToken } = response.data
      return { token, refreshToken } as TokenPair
    } catch (e) {
      console.error('Login error:', e)
      return null
    }
  }

  public static async refreshToken(refresh: string): Promise<TokenPair | null> {
    try {
      const response = await axios.post(
        BASE_URL.concat(API_ROUTES.USERS.ACCESS.REFRESH_TOKEN),
        { refreshToken: refresh }
      )
      const { token, refreshToken } = response.data
      return { token, refreshToken }
    } catch (e) {
      console.error("Refresh token error:", e)
      return null
    }
  }

  public static async getProfile(): Promise<Profile | null> {
    const store = useStore()
    const token = store.tokenPair?.token

    if (!token) {
      console.log('Cannot fetch profile, no auth token present')
      return null
    }

    try {
      const response = await axios.get(BASE_URL.concat(API_ROUTES.USERS.GET_PROFILE), {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      return response.data as Profile
    } catch (e) {
      console.error('Get profile error:', e)
      return null
    }
  }
}