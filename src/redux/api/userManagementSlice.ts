import { apiSlice } from "./apiSlice";

const useManagementSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getAllUsers: builder.query({
            query: ({ page = 1, limit = 10 }) => `/admin/all?page=${page}&limit=${limit}`,
          }),

          getUserByUsername:builder.query({
            query: (username) => `/admin/userdata/${username}`,
          }),
    })
})

export const {useLazyGetAllUsersQuery , useGetUserByUsernameQuery} = useManagementSlice