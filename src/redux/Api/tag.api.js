import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'

export const tagApi = createApi({
    reducerPath: 'tagApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' }),
    endpoints: (builder) => ({
        gettag: builder.query({
            query: () => 'tag/alltag',
            providesTags: ['tag']
        }),
        addtag: builder.mutation({
            query: (data) => ({
                url: 'tag/addtag',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['tag']
        }),
        updatetag: builder.mutation({
            query: (data) => ({
                url: `tag/updatetag/${data._id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['tag']
        }),
        deletetag: builder.mutation({
            query: (id) => ({
                url: `tag/deletetag/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['tag']
        }),
    })
})


export const { useGettagQuery, useAddtagMutation, useUpdatetagMutation, useDeletetagMutation } = tagApi