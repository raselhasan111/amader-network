'use client';

import { ProfileCard } from './ProfileCard';
import { LogoutButton } from './LogoutButton';
import Navbar from "@/components/navbar";
import Feed from "@/components/feed";
import {useCallback, useState} from "react";
import SuggestedUsers from "@/components/suggested-users";

export function HomePage() {
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query)
    }, [])

  return (
      <div className="min-h-screen bg-background">
          <Navbar onSearch={handleSearch} />
          <div className="flex max-w-7xl mx-auto">
              <div className="flex-1 border-r border-border">
                  <Feed searchQuery={searchQuery} />
              </div>
              <aside className="w-80 p-6 hidden lg:block">
                  <SuggestedUsers />
              </aside>
          </div>
      </div>
  );
}

