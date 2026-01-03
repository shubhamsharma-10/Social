import { useState, useEffect } from 'react'
import type { Post } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Heart, MessageCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { likeApi } from '@/services/api'
import { useAuth } from '@/context/AuthContext'

type PostCardProps = {
    post: Post
    showDelete?: boolean
    onDelete?: (postId: string) => void
}

export default function PostCard({ post, showDelete = false, onDelete }: PostCardProps) {
    const { isAuthenticated } = useAuth()
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(post.likeCount)
    const [isLiking, setIsLiking] = useState(false)

    // Check if user has liked this post on mount
    useEffect(() => {
        if (isAuthenticated) {
            checkLikeStatus()
        }
    }, [post.id, isAuthenticated])

    const checkLikeStatus = async () => {
        try {
            const response = await likeApi.checkLike(post.id)
            setLiked(response.liked)
        } catch (error) {
            // Silently fail - user might not be logged in
        }
    }

    const handleLikeToggle = async () => {
        if (!isAuthenticated || isLiking) return

        setIsLiking(true)

        // Optimistic update
        const wasLiked = liked
        setLiked(!wasLiked)
        setLikeCount(prev => wasLiked ? prev - 1 : prev + 1)

        try {
            await likeApi.toggleLike(post.id)
        } catch (error) {
            // Revert on error
            setLiked(wasLiked)
            setLikeCount(prev => wasLiked ? prev + 1 : prev - 1)
        } finally {
            setIsLiking(false)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-3 p-4">
                <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(post.author.displayName || post.author.username)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-semibold text-sm">{post.author.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                        @{post.author.username} · {formatDate(post.createdAt)}
                    </p>
                </div>
                {showDelete && onDelete && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(post.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </CardHeader>

            <CardContent className="p-0">
                {post.imageUrl && (
                    <img
                        src={post.imageUrl}
                        alt="Post image"
                        className="w-full object-cover max-h-96"
                    />
                )}
                <p className="p-4 text-sm">{post.content}</p>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
                    onClick={handleLikeToggle}
                    disabled={!isAuthenticated || isLiking}
                >
                    <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.commentCount}</span>
                </Button>
            </CardFooter>
        </Card>
    )
}
