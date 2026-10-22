import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'


export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getcontent: builder.query({
      query: () => 'content/allcontent',
      providesTags: ['content']
    }),
    addcontent: builder.mutation({
      query: (data) => ({
        url: 'content/addcontent',
        method: 'POST',
        body: data
      }),
      invalidatesTags:['content']    
    }),
    updatecontent: builder.mutation({
      query: (data) => ({
        url: `content/updatecontent/${data.get('_id')}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags:['content']
    }),
    deletecontent: builder.mutation({
      query: (id) => ({
        url: `content/deletecontent/${id}`,
        method: 'DELETE',
        body: id
      }),
      invalidatesTags: ['content']
    }),
   
  })
})


export const {
    useGetcontentQuery,
    useAddcontentMutation,
    useUpdatecontentMutation,
    useDeletecontentMutation
} = contentApi