import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

export default function Home() {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome, {user?.displayName}!</h1>
                        <p className="text-muted-foreground">@{user?.username}</p>
                    </div>
                    <Button variant="outline" onClick={logout}>
                        Sign Out
                    </Button>
                </div>

                <div className="p-6 border rounded-lg">
                    <p className="text-muted-foreground text-center">
                        Your feed will appear here once social features are implemented.
                    </p>
                </div>
            </div>
        </div>
    )
}
