'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { setUser } from '@/lib/features/userSlice';
import { authUtils } from '@/lib/auth';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Check if token is valid
      if (authUtils.isTokenExpired(token)) {
        console.error('Received expired token');
        router.push('/signin?error=token_expired');
        return;
      }

      // Store token in cookie
      authUtils.setToken(token);

      // Decode token and populate Redux store
      const profile = authUtils.decodeToken(token);
      if (profile) {
        dispatch(setUser(profile));
        // Redirect to home
        router.push('/home');
      } else {
        console.error('Failed to decode token');
        router.push('/signin?error=invalid_token');
      }
    } else {
      // No token provided
      router.push('/signin?error=no_token');
    }
  }, [searchParams, router, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
        <p className="text-gray-600">Please wait while we complete your login.</p>
      </div>
    </div>
  );
}

