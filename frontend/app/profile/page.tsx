"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {authUtils} from "@/lib/auth";
import {clearUser} from "@/lib/features/userSlice";

export default function ProfilePage() {
    const { profile } = useAppSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: profile?.name || "",
    })
    const router = useRouter()

    const dispatch = useAppDispatch();

    const handleLogout = () => {
        authUtils.removeToken();
        dispatch(clearUser());
        router.push('/signin');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <div className="min-h-screen bg-background">
            <nav className="bg-card border-b border-border">
                <div className="max-w-2xl mx-auto px-6 py-4">
                    <button onClick={() => router.push("/")} className="text-primary hover:underline text-sm font-semibold">
                        ← Back to Feed
                    </button>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto p-6">
                <Card className="p-8">
                    <div className="text-center mb-8">
                        <img
                            src={profile?.picture || "/placeholder.svg"}
                            alt={profile?.name}
                            className="w-24 h-24 rounded-full mx-auto mb-4"
                        />
                        <h1 className="text-3xl font-bold text-foreground mb-2">{profile?.name}</h1>
                        <p className="text-muted-foreground">{profile?.email}</p>
                    </div>

                    <div className="space-y-6">
                        {isEditing ? (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="bg-secondary text-foreground"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        Save Changes
                                    </Button>
                                    <Button onClick={() => setIsEditing(false)} variant="outline">
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    Edit Profile
                                </Button>
                            </>
                        )}

                        <div className="border-t border-border pt-6">
                            <Button onClick={handleLogout} variant="outline" className="w-full text-destructive bg-transparent">
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
