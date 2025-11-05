import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    login: builder.query<any, void>({
      query: () => ({
        url: '/login',
        method: 'GET',
      }),
    }),
  }),
});

export const { useLoginQuery } = api;
