'use client';

import { useAppSelector } from '@/lib/hooks';
import { authUtils } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProfileCard() {
  const { profile } = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    // Check token expiration on mount
    const checkAuth = () => {
      if (!authUtils.isAuthenticated()) {
        authUtils.removeToken();
        router.push('/signin?error=authentication_required');
      }
    };

    checkAuth();
  }, [router]);

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        {profile.picture && (
          <img
            src={profile.picture}
            alt={profile.name || 'User'}
            className="h-16 w-16 rounded-full"
          />
        )}
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {profile.name || 'User'}
          </h2>
          <p className="text-sm text-gray-600">{profile.email}</p>
          <p className="text-xs text-gray-400 mt-1">
            User ID: {profile.id}
          </p>
        </div>
      </div>
    </div>
  );
}

