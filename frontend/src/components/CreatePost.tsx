import { useState, useRef } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { postApi } from '@/services/api'

type CreatePostProps = {
    onPostCreated: () => void
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
    const [content, setContent] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setImage(null)
        setPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async () => {
        if (!content.trim()) {
            setError('Please write something')
            return
        }
        if (!image) {
            setError('Please select an image')
            return
        }

        setError('')
        setIsLoading(true)

        try {
            await postApi.createPost(content, image)
            setContent('')
            setImage(null)
            setPreview(null)
            onPostCreated()
        } catch (err: any) {
            const errorData = err.response?.data?.error
            if (typeof errorData === 'string') {
                setError(errorData)
            } else if (typeof errorData === 'object' && errorData?.message) {
                setError(errorData.message)
            } else if (err.message) {
                setError(err.message)
            } else {
                setError('Failed to create post')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Create Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-md">
                        {error}
                    </div>
                )}
                <Textarea
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-24 resize-none"
                />

                {preview && (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full max-h-64 object-cover rounded-md"
                        />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={removeImage}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    ref={fileInputRef}
                    className="hidden"
                />
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                >
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Add Image
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !content.trim() || !image}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Posting...
                        </>
                    ) : (
                        'Post'
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
