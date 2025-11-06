import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import type {UserProfile} from './features/userSlice';

const TOKEN_KEY = 'access_token';

export const authUtils = {
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, {
      expires: 1/48, // 30 minutes
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  decodeToken: (token: string): UserProfile | null => {
    try {
        return jwtDecode<UserProfile>(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = jwtDecode<UserProfile>(token);
      if (!decoded.exp) return true;

      // Check if token is expired (exp is in seconds, Date.now() is in ms)
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  isAuthenticated: (): boolean => {
    const token = authUtils.getToken();
    if (!token) return false;
    return !authUtils.isTokenExpired(token);
  }
};

