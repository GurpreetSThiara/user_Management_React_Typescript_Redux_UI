import { apiSlice } from "./apiSlice";

const schemaSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getAllSchemas:builder.query({
            query: () => `/admin/schema/all`,
          }),
    })
})

export const {useLazyGetAllSchemasQuery,useGetAllSchemasQuery} = schemaSlice;

export default schemaSlice