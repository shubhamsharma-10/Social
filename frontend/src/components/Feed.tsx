import { useState, useEffect } from 'react'
import type { Post } from '@/lib/types'
import { feedApi } from '@/services/api'
import PostCard from '@/components/PostCard'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchFeed = async (pageNum: number = 1) => {
        setIsLoading(true)
        setError('')
        try {
            const response = await feedApi.getFeed(pageNum, 10)
            if (pageNum === 1) {
                setPosts(response.data.posts)
            } else {
                setPosts(prev => [...prev, ...response.data.posts])
            }
            setTotalPages(response.data.pagination.totalPages)
            setPage(pageNum)
        } catch (err: any) {
            setError(err.message || 'Failed to load feed')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchFeed()
    }, [])

    const loadMore = () => {
        if (page < totalPages) {
            fetchFeed(page + 1)
        }
    }

    if (isLoading && posts.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error && posts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => fetchFeed()}>
                    Try Again
                </Button>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}

            {page < totalPages && (
                <div className="flex justify-center py-4">
                    <Button
                        variant="outline"
                        onClick={loadMore}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Load More'
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
