import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import CreatePost from '@/components/CreatePost'
import Feed from '@/components/Feed'
import MyPosts from '@/components/MyPosts'
import { Home as HomeIcon, User, LogOut } from 'lucide-react'

type Tab = 'feed' | 'my-posts'

export default function Home() {
    const { user, logout } = useAuth()
    const [activeTab, setActiveTab] = useState<Tab>('feed')
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const handlePostCreated = () => {
        setRefreshTrigger(prev => prev + 1)
        // If on my-posts tab, it will auto-refresh
        // If on feed, user can refresh manually or we could switch tabs
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container max-w-2xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <h1 className="text-xl font-bold">Social</h1>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                @{user?.username}
                            </span>
                            <Button variant="ghost" size="icon" onClick={logout}>
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container max-w-2xl mx-auto px-4 py-6">
                {/* Create Post */}
                <div className="mb-6">
                    <CreatePost onPostCreated={handlePostCreated} />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={activeTab === 'feed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('feed')}
                        className="gap-2"
                    >
                        <HomeIcon className="h-4 w-4" />
                        Feed
                    </Button>
                    <Button
                        variant={activeTab === 'my-posts' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('my-posts')}
                        className="gap-2"
                    >
                        <User className="h-4 w-4" />
                        My Posts
                    </Button>
                </div>

                <Separator className="mb-6" />

                {/* Content */}
                {activeTab === 'feed' ? (
                    <Feed key={refreshTrigger} />
                ) : (
                    <MyPosts refreshTrigger={refreshTrigger} />
                )}
            </main>
        </div>
    )
}
