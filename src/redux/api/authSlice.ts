import { apiSlice } from "./apiSlice";

const authSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        login:builder.mutation({
            query:(body)=>({
                url:'/auth/login',
                body:body,
                method:'post'
               
            })
        }),
        verifyAccessToken: builder.mutation({
            query:()=>({
                url:'/auth/token',
                
                method:'post',

               
            })
        })
    })
})

export const {useLoginMutation , useVerifyAccessTokenMutation} = authSlice;

export default authSlice