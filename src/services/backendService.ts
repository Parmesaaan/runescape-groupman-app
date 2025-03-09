import {Credentials, Profile, Task, TaskType, TokenPair} from "../models";
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
      throw Error
    }
  }

  public static async login(credentials: Credentials): Promise<TokenPair> {
    try {
      const response = await axios.post(
        BASE_URL.concat(API_ROUTES.USERS.ACCESS.LOGIN),
        credentials
      )
      const { token, refreshToken } = response.data
      return { token, refreshToken } as TokenPair
    } catch (e) {
      console.error('Login error:', e)
      throw Error
    }
  }

  public static async refreshToken(refresh: string): Promise<TokenPair> {
    try {
      const response = await axios.post(
        BASE_URL.concat(API_ROUTES.USERS.ACCESS.REFRESH_TOKEN),
        { refreshToken: refresh }
      )
      const { token, refreshToken } = response.data
      return { token, refreshToken }
    } catch (e) {
      console.error("Refresh token error:", e)
      throw Error
    }
  }

  public static async getProfile(): Promise<Profile> {
    const store = useStore()
    const token = store.tokenPair?.token

    if (!token) {
      console.log('Cannot fetch profile, no auth token present')
      throw Error
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
      throw Error
    }
  }

  public static async createTask(taskType: TaskType, title: string, description?:string): Promise<Task> {
    const store = useStore()
    const token = store.tokenPair?.token

    if (!token) {
      console.log('Cannot create task, no auth token present')
      throw Error
    }

    try {
      const response = await axios.put(
        BASE_URL.concat(API_ROUTES.USERS.TASKS.CREATE_TASK),
        {
          title: title,
          description: description,
          taskType: taskType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      return response.data as Task
    } catch (e) {
      console.error('Update task error:', e)
      throw Error
    }
  }

  public static async updateTask(taskId: string, updates): Promise<Task> {
    const store = useStore()
    const token = store.tokenPair?.token

    if (!token) {
      console.log('Cannot update task, no auth token present')
      throw Error
    }

    try {
      const response = await axios.put(
        BASE_URL.concat(API_ROUTES.USERS.TASKS.UPDATE_TASK).replace(':taskId', taskId),
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      return response.data as Task
    } catch (e) {
      console.error('Update task error:', e)
      throw Error
    }
  }
}