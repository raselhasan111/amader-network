import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authUtils } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = authUtils.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => '/profile',
    }),
  }),
});

export const { useGetProfileQuery } = api;
