import { apiSlice } from "./apiSlice";


export interface IModel {
    name: string;
    fields: { [key: string]: string };
    relationships: { [key: string]: string };
  }
const adminModelSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // GET /models
        getModels: builder.query<IModel[], void>({
          query: () => '/models',
        
        }),

        getRecords:builder.query({
            query: ({name , page , limit}) => `/records/${name}?page=${page}&limit=${limit}`,
          
          }),
  
    
        // POST /models
        createModel: builder.mutation<IModel, Partial<IModel>>({
          query: (newModel) => ({
            url: '/models',
            method: 'POST',
            body: newModel,
          }),
 
        }),
    
        // POST /models/:modelName/fields
        addField: builder.mutation<void, { modelName: string; field: { name: string; type: string } }>({
          query: ({ modelName, field }) => ({
            url: `/models/${encodeURIComponent(modelName)}/fields`,
            method: 'POST',
            body: field,
          }),
          
        }),
    
        // POST /models/:modelName/relationships
        addRelationship: builder.mutation<void, { modelName: string; relationship: { name: string; model: string } }>({
          query: ({ modelName, relationship }) => ({
            url: `/models/${encodeURIComponent(modelName)}/relationships`,
            method: 'POST',
            body: relationship,
          }),
         
        }),
      }),
})

export const {
    useGetModelsQuery,
    useCreateModelMutation,
    useAddFieldMutation,
    useAddRelationshipMutation,
    useGetRecordsQuery
  } = adminModelSlice;