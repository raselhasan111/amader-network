'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setUser } from '@/lib/features/userSlice';
import { authUtils } from '@/lib/auth';
import { HomePage } from '@/features/home/components/HomePage';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, profile } = useAppSelector((state) => state.user);

  useEffect(() => {
    // Check authentication
    if (!authUtils.isAuthenticated()) {
      authUtils.removeToken();
      router.push('/signin?error=authentication_required');
      return;
    }

    // If authenticated but store is empty, populate from token
    if (!isAuthenticated || !profile) {
      const token = authUtils.getToken();
      if (token) {
        const decodedProfile = authUtils.decodeToken(token);
        if (decodedProfile) {
          dispatch(setUser(decodedProfile));
        }
      }
    }
  }, [isAuthenticated, profile, router, dispatch]);

  // Show loading while checking auth
  if (!isAuthenticated || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <HomePage />;
}

