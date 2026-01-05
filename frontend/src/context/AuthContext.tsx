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
            // Cookies are sent automatically with credentials: true
            const response = await authApi.getMe()
            setUser(response.data)
        } catch (error) {
            // User not authenticated or token expired
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (data: LoginData) => {
        await authApi.login(data)
        // Cookies are set by the server automatically
        const userResponse = await authApi.getMe()
        setUser(userResponse.data)
    }

    const register = async (data: RegisterData) => {
        await authApi.register(data)
        // Cookies are set by the server automatically
        const userResponse = await authApi.getMe()
        setUser(userResponse.data)
    }

    const logout = async () => {
        try {
            await authApi.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
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
