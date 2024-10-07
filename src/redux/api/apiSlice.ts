import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api/v1/',
  credentials: 'include',        
});

export const apiSlice = createApi({
  baseQuery,
  endpoints: () => ({}),
  
});