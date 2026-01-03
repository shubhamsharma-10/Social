export type RegisterData = {
    email: string
    username: string
    displayName: string
    password: string
}

export type LoginData = {
    email: string
    password: string
}

export type Author = {
    id: string
    username: string
    displayName: string
}

export type Post = {
    id: string
    content: string
    imageUrl: string | null
    authorId: string
    author: Author
    likeCount: number
    commentCount: number
    createdAt: string
    updatedAt: string
}

export type CreatePostData = {
    content: string
    image: File
}

export type PaginationData = {
    page: number
    limit: number
    total: number
    totalPages: number
}