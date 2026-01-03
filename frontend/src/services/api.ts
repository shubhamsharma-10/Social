import axios from 'axios'
import type { LoginData, RegisterData } from '@/lib/types'

const API_BASE_URL = 'http://localhost:3000/api'

// Response types
type AuthResponse = {
    status: boolean
    message: string
    data: {
        accessToken: string
        refreshToken: string
    }
}

type UserResponse = {
    status: boolean
    data: {
        id: string
        email: string
        username: string
        displayName: string
    }
}

// Auth API with individual axios calls
export const authApi = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        console.log(data)
        const response = await axios.post(`${API_BASE_URL}/auth/login`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    },

    logout: async (refresh_token: string): Promise<{ status: boolean; message: string }> => {
        const response = await axios.post(`${API_BASE_URL}/auth/logout`, { refresh_token }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    },

    refreshToken: async (refresh_token: string): Promise<AuthResponse> => {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refresh_token }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    },

    getMe: async (): Promise<UserResponse> => {
        const tokens = localStorage.getItem('tokens')
        if (!tokens) {
            throw new Error('No access token')
        }

        const { accessToken } = JSON.parse(tokens)

        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        return response.data
    }
}
