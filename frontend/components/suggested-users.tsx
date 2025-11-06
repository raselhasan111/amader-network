"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"

export default function SuggestedUsers() {
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set())

    const suggestedUsers = [
        {
            id: "1",
            name: "Sarah Anderson",
            handle: "@sarahande",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        },
        { id: "2", name: "Mike Chen", handle: "@mikechen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike" },
        {
            id: "3",
            name: "Emily Rodriguez",
            handle: "@emilyrodz",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
        },
        {
            id: "4",
            name: "James Wilson",
            handle: "@jameswilson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
        },
        { id: "5", name: "Lisa Park", handle: "@lisapark", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa" },
    ]

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

    return (
        <Card className="p-6 sticky top-20">
            <h2 className="text-xl font-bold text-foreground mb-6">Suggested for You</h2>
            <div className="space-y-4">
                {suggestedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                            <Avatar className="w-10 h-10">
                                <img src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            </Avatar>
                            <div className="min-w-0">
                                <p className="font-semibold text-foreground text-sm truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.handle}</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => handleFollow(user.id)}
                            variant={followedUsers.has(user.id) ? "outline" : "default"}
                            className="whitespace-nowrap text-xs"
                        >
                            {followedUsers.has(user.id) ? "Following" : "Follow"}
                        </Button>
                    </div>
                ))}
            </div>
        </Card>
    )
}
