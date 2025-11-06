"use client"

import React, {useState, useEffect, useRef, useCallback} from "react"
import {Card} from "@/components/ui/card"
import {Textarea} from "@/components/ui/textarea"
import {Button} from "@/components/ui/button"
import Post from "@/components/post"
import {useAppSelector} from "@/lib/hooks";
import UserAvatar from "@/components/shared/user-avatar";

interface PostType {
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

interface FeedProps {
    searchQuery: string
}

export default function Feed({searchQuery}: FeedProps) {
    const {profile} = useAppSelector((state) => state.user);
    const [posts, setPosts] = useState<PostType[]>([])
    const [page, setPage] = useState(1)
    const observerTarget = useRef(null)
    const [postInput, setPostInput] = useState("")

    // Generate mock posts
    const generateMockPosts = useCallback((pageNum: number) => {
        const mockPosts: PostType[] = []
        const baseId = pageNum * 10
        const content = [
            "Just launched my new project! Check it out and let me know what you think.",
            "Beautiful sunset today 🌅",
            "Coffee and code - the perfect combination for a Friday morning ☕",
            "Excited to announce I'm speaking at the tech conference next month!",
            "Working on something cool. More updates coming soon...",
        ]

        for (let i = 0; i < 5; i++) {
            mockPosts.push({
                id: `${baseId + i}`,
                author: {
                    id: `user-${i}`,
                    name: `User ${i + 1}`,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
                },
                content: content[i % content.length],
                timestamp: new Date(Date.now() - Math.random() * 86400000),
                reactions: {
                    likes: Math.floor(Math.random() * 500) + 10,
                    comments: Math.floor(Math.random() * 100) + 5,
                    shares: Math.floor(Math.random() * 50),
                },
                liked: false,
            })
        }
        return mockPosts
    }, [])

    // Initial load
    useEffect(() => {
        setPosts(generateMockPosts(0))
    }, [generateMockPosts])

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && page > 0) {
                    setPage((prev) => prev + 1)
                }
            },
            {threshold: 0.1},
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => observer.disconnect()
    }, [page])

    // Load more posts
    useEffect(() => {
        if (page > 1) {
            const newPosts = generateMockPosts(page)
            setPosts((prev) => [...prev, ...newPosts])
        }
    }, [page, generateMockPosts])

    const handleCreatePost = () => {
        if (postInput.trim()) {
            const newPost: PostType = {
                id: `post-${Date.now()}`,
                author: {
                    id: profile?.id?.toString() || "",
                    name: profile?.name || "You",
                    avatar: profile?.picture || "",
                },
                content: postInput,
                timestamp: new Date(),
                reactions: {
                    likes: 0,
                    comments: 0,
                    shares: 0,
                },
                liked: false,
            }
            setPosts((prev) => [newPost, ...prev])
            setPostInput("")
        }
    }

    const handleLike = (postId: string) => {
        setPosts((prev) =>
            prev.map((post) =>
                post.id === postId
                    ? {
                        ...post,
                        liked: !post.liked,
                        reactions: {
                            ...post.reactions,
                            likes: post.liked ? post.reactions.likes - 1 : post.reactions.likes + 1,
                        },
                    }
                    : post,
            ),
        )
    }

    const filteredPosts = posts.filter(
        (post) =>
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="max-w-2xl mx-auto">
            {/* Create Post */}
            <Card className="p-6 mb-6 border-b">
                <div className="flex gap-4">
                    <UserAvatar src={profile?.picture} fallback={profile?.name}/>
                    <div className="flex-1">
                        <div className="flex flex-col gap-2">
                            <Textarea
                                placeholder="What's on your mind?"
                                value={postInput}
                                onChange={(e) => setPostInput(e.target.value)}
                                className="bg-background/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary resize-none min-h-24"
                                onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && handleCreatePost()}
                            />
                            <Button
                                onClick={handleCreatePost}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 self-end"
                            >
                                Post
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Posts Feed - now using Post component */}
            <div className="space-y-6">
                {filteredPosts.map((post) => (
                    <Post key={post.id} post={post} onLike={() => handleLike(post.id)}/>
                ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="h-4"/>
        </div>
    )
}
