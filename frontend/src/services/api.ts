import axios from 'axios'
import type { LoginData, RegisterData, Post, PaginationData } from '@/lib/types'

const API_BASE_URL = 'http://localhost:3000/api'

// Helper to get auth header
const getAuthHeader = () => {
    const tokens = localStorage.getItem('tokens')
    if (!tokens) {
        throw new Error('No access token')
    }
    const { accessToken } = JSON.parse(tokens)
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    }
}

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

type PostResponse = {
    status: boolean
    message: string
    data: Post
}

type PostsResponse = {
    status: boolean
    message: string
    data: Post[]
}

type FeedResponse = {
    status: boolean
    message: string
    data: {
        posts: Post[]
        pagination: PaginationData
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
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: getAuthHeader()
        })
        return response.data
    }
}

// Feed API - Public routes (no auth required)
export const feedApi = {
    getFeed: async (page: number = 1, limit: number = 20): Promise<FeedResponse> => {
        const response = await axios.get(`${API_BASE_URL}/feed`, {
            params: { page, limit },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    },

    getPostById: async (postId: string): Promise<PostResponse> => {
        const response = await axios.get(`${API_BASE_URL}/feed/${postId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    }
}

// Post API - Private routes (auth required)
export const postApi = {
    createPost: async (content: string, image: File): Promise<PostResponse> => {
        const tokens = localStorage.getItem('tokens')
        if (!tokens) {
            throw new Error('No access token')
        }
        const { accessToken } = JSON.parse(tokens)

        const formData = new FormData()
        formData.append('content', content)
        formData.append('image', image)

        const response = await axios.post(`${API_BASE_URL}/posts`, formData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
                // Don't set Content-Type, axios will set multipart/form-data
            }
        })
        return response.data
    },

    getMyPosts: async (page: number = 1, limit: number = 10): Promise<PostsResponse> => {
        const response = await axios.get(`${API_BASE_URL}/posts`, {
            params: { page, limit },
            headers: getAuthHeader()
        })
        return response.data
    },

    getMyPostById: async (postId: string): Promise<PostResponse> => {
        const response = await axios.get(`${API_BASE_URL}/posts/${postId}`, {
            headers: getAuthHeader()
        })
        return response.data
    },

    updatePost: async (postId: string, content: string): Promise<PostResponse> => {
        const response = await axios.put(`${API_BASE_URL}/posts/${postId}`, { content }, {
            headers: getAuthHeader()
        })
        return response.data
    },

    deletePost: async (postId: string): Promise<{ status: boolean; message: string }> => {
        const response = await axios.delete(`${API_BASE_URL}/posts/${postId}`, {
            headers: getAuthHeader()
        })
        return response.data
    }
}

// Like API - Private routes (auth required)
export const likeApi = {
    toggleLike: async (postId: string): Promise<{ status: boolean; message: string; liked?: boolean }> => {
        const response = await axios.post(`${API_BASE_URL}/like/${postId}`, {}, {
            headers: getAuthHeader()
        })
        return response.data
    },

    checkLike: async (postId: string): Promise<{ status: boolean; liked: boolean }> => {
        const response = await axios.get(`${API_BASE_URL}/like/${postId}`, {
            headers: getAuthHeader()
        })
        return response.data
    }
}
