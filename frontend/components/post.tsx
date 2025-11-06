"use client"

import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"

interface PostProps {
    post: {
        id: string
        author: {
            id: string
            name: string
            avatar: string
        }
        content: string
        timestamp: Date
        image?: string
        reactions: {
            likes: number
            comments: number
            shares: number
        }
        liked: boolean
    }
    onLike: () => void
}

export default function Post({ post, onLike }: PostProps) {
    const timeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
        if (seconds < 60) return "now"
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    }

    return (
        <Card className="p-6 hover:bg-secondary/50 transition-colors cursor-pointer">
            <div className="flex gap-4">
                <Avatar className="w-12 h-12">
                    <img src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                </Avatar>

                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-foreground">{post.author.name}</h3>
                            <p className="text-sm text-muted-foreground">{timeAgo(post.timestamp)}</p>
                        </div>
                        <button className="text-muted-foreground hover:text-foreground">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.5 1.5H9.5V3h1V1.5zM15.5 4.5l-1.414 1.414.707.707L16.207 5.207 15.5 4.5zM18 9.5v1h1.5v-1H18zM15.5 15.5l-.707.707 1.414 1.414.707-.707-1.414-1.414zM10.5 18v1.5h1V18h-1zM4.5 15.5l-1.414-1.414-.707.707 1.414 1.414.707-.707zM1.5 9.5H0v1h1.5v-1zM4.5 4.5L3.086 5.914l.707.707L5.207 5.207 4.5 4.5z" />
                            </svg>
                        </button>
                    </div>

                    <p className="mt-4 text-foreground leading-relaxed">{post.content}</p>

                    <div className="mt-4 flex gap-4 text-sm text-muted-foreground border-t border-border pt-4">
                        <button
                            onClick={onLike}
                            className={`flex items-center gap-2 hover:text-primary transition-colors ${
                                post.liked ? "text-primary" : ""
                            }`}
                        >
                            <svg
                                className="w-5 h-5"
                                fill={post.liked ? "currentColor" : "none"}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            {post.reactions.likes}
                        </button>
                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            {post.reactions.comments}
                        </button>
                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            {post.reactions.shares}
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
