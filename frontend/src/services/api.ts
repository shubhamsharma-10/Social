import axios from 'axios'
import type { LoginData, RegisterData, Post, PaginationData } from '@/lib/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'


const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

type AuthResponse = {
    status: boolean
    message: string
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

export const authApi = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data)
        return response.data
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data)
        return response.data
    },

    logout: async (): Promise<{ status: boolean; message: string }> => {
        const response = await api.post('/auth/logout')
        return response.data
    },

    refreshToken: async (): Promise<AuthResponse> => {
        const response = await api.post('/auth/refresh-token')
        return response.data
    },

    getMe: async (): Promise<UserResponse> => {
        const response = await api.get('/auth/me')
        return response.data
    }
}


export const feedApi = {
    getFeed: async (page: number = 1, limit: number = 20): Promise<FeedResponse> => {
        const response = await api.get('/feed', {
            params: { page, limit }
        })
        return response.data
    },

    getPostById: async (postId: string): Promise<PostResponse> => {
        const response = await api.get(`/feed/${postId}`)
        return response.data
    }
}


export const postApi = {
    createPost: async (content: string, image: File): Promise<PostResponse> => {
        const formData = new FormData()
        formData.append('content', content)
        formData.append('image', image)

        const response = await api.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    },

    getMyPosts: async (page: number = 1, limit: number = 10): Promise<PostsResponse> => {
        const response = await api.get('/posts', {
            params: { page, limit }
        })
        return response.data
    },

    getMyPostById: async (postId: string): Promise<PostResponse> => {
        const response = await api.get(`/posts/${postId}`)
        return response.data
    },

    updatePost: async (postId: string, content: string): Promise<PostResponse> => {
        const response = await api.put(`/posts/${postId}`, { content })
        return response.data
    },

    deletePost: async (postId: string): Promise<{ status: boolean; message: string }> => {
        const response = await api.delete(`/posts/${postId}`)
        return response.data
    }
}


export const likeApi = {
    toggleLike: async (postId: string): Promise<{ status: boolean; message: string; liked?: boolean }> => {
        const response = await api.post(`/like/${postId}`)
        return response.data
    },

    checkLike: async (postId: string): Promise<{ status: boolean; liked: boolean }> => {
        const response = await api.get(`/like/${postId}`)
        return response.data
    }
}
