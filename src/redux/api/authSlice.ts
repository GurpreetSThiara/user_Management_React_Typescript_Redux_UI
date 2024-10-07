import { apiSlice } from "./apiSlice";

const authSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        login:builder.mutation({
            query:(body)=>({
                url:'/auth/login',
                body:body,
                method:'post'
               
            })
        })
    })
})

export const {useLoginMutation} = authSlice;

export default authSlice