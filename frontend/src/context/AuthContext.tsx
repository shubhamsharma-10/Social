import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authApi } from '@/services/api'
import type { LoginData, RegisterData } from '@/lib/types'

type User = {
    id: string
    email: string
    username: string
    displayName: string
}

type AuthContextType = {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (data: { email: string, password: string }) => Promise<void>
    register: (data: { email: string; username: string; displayName: string; password: string }) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const tokens = localStorage.getItem('tokens')
            if (!tokens) {
                setIsLoading(false)
                return
            }

            const response = await authApi.getMe()
            setUser(response.data)
        } catch (error) {
            localStorage.removeItem('tokens')
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (data: LoginData) => {
        const response = await authApi.login(data)
        localStorage.setItem('tokens', JSON.stringify(response.data))

        const userResponse = await authApi.getMe()
        setUser(userResponse.data)
    }

    const register = async (data: RegisterData) => {
        const response = await authApi.register(data)
        localStorage.setItem('tokens', JSON.stringify(response.data))

        const userResponse = await authApi.getMe()
        setUser(userResponse.data)
    }

    const logout = async () => {
        try {
            const tokens = localStorage.getItem('tokens')
            if (tokens) {
                const { refreshToken } = JSON.parse(tokens)
                await authApi.logout(refreshToken)
            }
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            localStorage.removeItem('tokens')
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
