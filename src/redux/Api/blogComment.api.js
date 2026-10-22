import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'

export const commentApi = createApi({
    reducerPath: 'commentApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getcomment: builder.query({
            query: () => 'comment/allcomment',
            providesTags: ['comment']
        }),
        addcomment: builder.mutation({
            query: (data) => ({
                url: 'comment/addcomment',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['comment']
        }),
        updatecomment: builder.mutation({
            query: (data) => ({  
                url: `comment/updatecomment/${data._id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['comment']
        }),
        deletecomment: builder.mutation({
            query: (id) => ({
                url: `comment/deletecomment/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['comment']
        }),

    })
})


export const {
    useGetcommentQuery,
    useAddcommentMutation,
    useUpdatecommentMutation,
    useDeletecommentMutation
} = commentApi