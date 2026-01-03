import { useState, useEffect } from 'react'
import type { Post } from '@/lib/types'
import { postApi } from '@/services/api'
import PostCard from '@/components/PostCard'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

type MyPostsProps = {
    refreshTrigger?: number
}

export default function MyPosts({ refreshTrigger }: MyPostsProps) {
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchMyPosts = async () => {
        setIsLoading(true)
        setError('')
        try {
            const response = await postApi.getMyPosts()
            setPosts(response.data)
        } catch (err: any) {
            setError(err.message || 'Failed to load your posts')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMyPosts()
    }, [refreshTrigger])

    const handleDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return

        try {
            await postApi.deletePost(postId)
            setPosts(prev => prev.filter(p => p.id !== postId))
        } catch (err: any) {
            alert(err.message || 'Failed to delete post')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" className="mt-4" onClick={fetchMyPosts}>
                    Try Again
                </Button>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">You haven't posted anything yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {posts.map(post => (
                <PostCard
                    key={post.id}
                    post={post}
                    showDelete={true}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    )
}
