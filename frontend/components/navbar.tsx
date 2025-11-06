"use client"

import type React from "react"
import {useState} from "react"
import {Input} from "@/components/ui/input"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {useRouter} from "next/navigation"
import {Menu, X, Search} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {authUtils} from "@/lib/auth";
import {clearUser} from "@/lib/features/userSlice";
import UserAvatar from "@/components/shared/user-avatar";

interface NavbarProps {
    onSearch: (query: string) => void
}

export default function Navbar({onSearch}: NavbarProps) {
    const {profile} = useAppSelector((state) => state.user);
    const [searchInput, setSearchInput] = useState("")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()

    const dispatch = useAppDispatch();

    const handleLogout = () => {
        authUtils.removeToken();
        dispatch(clearUser());
        router.push('/signin');
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchInput(value)
        onSearch(value)
        if (value.trim()) {
            router.push(`/search?query=${encodeURIComponent(value)}`)
        }
    }

    const handleProfile = () => {
        router.push("/profile")
        setMobileMenuOpen(false)
    }

    const handleBrandClick = () => {
        router.push("/")
        setMobileMenuOpen(false)
    }

    return (
        <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={handleBrandClick}
                        className="flex items-center gap-2 hover:opacity-70 transition-opacity flex-shrink-0"
                    >
                        <div
                            className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <span
                            className="hidden md:inline font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Amader Network
            </span>
                    </button>

                    <div className="flex-1 max-w-xs md:max-w-md hidden sm:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder="Search posts, people..."
                                value={searchInput}
                                onChange={handleSearch}
                                className="pl-10 bg-background/50 border border-border rounded-lg h-10 text-sm placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
                        </button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <UserAvatar src={profile?.picture} fallback={profile?.name} />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleProfile}>Profile</DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <button
                        className="md:hidden p-2 hover:bg-input rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-border/50 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder="Search..."
                                value={searchInput}
                                onChange={handleSearch}
                                className="pl-10 bg-background/50 border border-border rounded-lg h-10 text-sm w-full"
                            />
                        </div>
                        <Button variant="ghost" className="w-full justify-start" onClick={handleProfile}>
                            Profile
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-destructive"
                                onClick={handleLogout}>
                            Sign Out
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    )
}
