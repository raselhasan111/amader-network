"use client"

import {useState, useMemo} from "react"
import Navbar from "@/components/navbar"
import {Avatar} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import Post from "@/components/post"
import {useRouter, useSearchParams} from "next/navigation"

interface User {
    id: string
    name: string
    avatar: string
    bio: string
    followers: number
}

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

export default function SearchResultsPage() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('query') || "";
    const [activeTab, setActiveTab] = useState<"people" | "posts">("posts")
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set())

    const mockUsers: User[] = useMemo(
        () => [
            {
                id: "user-1",
                name: "Alex Johnson",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
                bio: "Product Designer | Tech Enthusiast",
                followers: 1250,
            },
            {
                id: "user-2",
                name: "Sarah Chen",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
                bio: "Full Stack Developer | Open Source",
                followers: 2340,
            },
            {
                id: "user-3",
                name: "James Wilson",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user3",
                bio: "Creative Director | Design Lover",
                followers: 890,
            },
            {
                id: "user-4",
                name: "Emma Davis",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user4",
                bio: "Data Scientist | AI Enthusiast",
                followers: 1890,
            },
        ],
        [],
    )

    const mockPosts: PostType[] = useMemo(
        () => [
            {
                id: "post-1",
                author: {
                    id: "user-1",
                    name: "Alex Johnson",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1"
                },
                content: `Excited to share my latest project! Just launched a new design system that's already getting amazing feedback from the team.`,
                timestamp: new Date(Date.now() - 3600000),
                reactions: {likes: 234, comments: 45, shares: 12},
                liked: false,
            },
            {
                id: "post-2",
                author: {
                    id: "user-2",
                    name: "Sarah Chen",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2"
                },
                content: `Just completed a course on advanced React patterns. The knowledge compounding is real! Feeling excited to apply these to my projects.`,
                timestamp: new Date(Date.now() - 7200000),
                reactions: {likes: 456, comments: 89, shares: 34},
                liked: false,
            },
            {
                id: "post-3",
                author: {
                    id: "user-3",
                    name: "James Wilson",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user3"
                },
                content: `Beautiful morning for creative work. Coffee in hand, ideas flowing. What's everyone working on today?`,
                timestamp: new Date(Date.now() - 10800000),
                reactions: {likes: 189, comments: 32, shares: 8},
                liked: false,
            },
        ],
        [],
    )

    const filteredUsers = mockUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery?.toLowerCase()) || user.bio.toLowerCase().includes(searchQuery?.toLowerCase()),
    )

    const filteredPosts = mockPosts.filter(
        (post) =>
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const handleFollow = (userId: string) => {
        setFollowedUsers((prev) => {
            const updated = new Set(prev)
            if (updated.has(userId)) {
                updated.delete(userId)
            } else {
                updated.add(userId)
            }
            return updated
        })
    }

    const handleSearch = (newQuery: string) => {
        if (newQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(newQuery)}`)
        } else {
            router.push("/")
        }
    }

    const handleLike = () => {
        // Like functionality
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar onSearch={handleSearch}/>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Search results for <span className="text-primary">"{searchQuery}"</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Found {filteredPosts.length} posts and {filteredUsers.length} people
                    </p>
                </div>

                <div className="flex gap-2 mb-8 border-b border-border/30">
                    <button
                        onClick={() => setActiveTab("posts")}
                        className={`px-4 py-3 font-medium relative transition-all ${
                            activeTab === "posts"
                                ? "text-primary border-b-2 border-primary"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Posts
                    </button>
                    <button
                        onClick={() => setActiveTab("people")}
                        className={`px-4 py-3 font-medium relative transition-all ${
                            activeTab === "people"
                                ? "text-primary border-b-2 border-primary"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        People
                    </button>
                </div>

                {activeTab === "posts" && (
                    <div className="space-y-6">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => <Post key={post.id} post={post} onLike={() => handleLike()}/>)
                        ) : (
                            <Card className="p-8 text-center border border-border/30 bg-card/50">
                                <p className="text-muted-foreground">No posts found matching your search.</p>
                            </Card>
                        )}
                    </div>
                )}

                {activeTab === "people" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <Card
                                    key={user.id}
                                    className="p-6 border border-border/30 hover:border-primary/40 transition-colors bg-card/50"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-4 flex-1">
                                            <Avatar className="w-12 h-12 flex-shrink-0">
                                                <img src={user.avatar || "/placeholder.svg"} alt={user.name}/>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    {user.followers.toLocaleString()} followers
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleFollow(user.id)}
                                            variant={followedUsers.has(user.id) ? "secondary" : "default"}
                                            className="flex-shrink-0"
                                            size="sm"
                                        >
                                            {followedUsers.has(user.id) ? "Following" : "Follow"}
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-8 col-span-full text-center border border-border/30 bg-card/50">
                                <p className="text-muted-foreground">No people found matching your search.</p>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
