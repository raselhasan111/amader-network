'use client';

import { useAppDispatch } from '@/lib/hooks';
import { clearUser } from '@/lib/features/userSlice';
import { authUtils } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    authUtils.removeToken();
    dispatch(clearUser());
    router.push('/signin');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
    >
      Sign Out
    </button>
  );
}

