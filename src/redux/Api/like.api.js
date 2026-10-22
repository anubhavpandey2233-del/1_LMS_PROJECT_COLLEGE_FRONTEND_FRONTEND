import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'

export const likeApi = createApi({
    reducerPath: 'likeApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getlike: builder.query({
            query: () => 'like/alllike',
            providesTags: ['like']
        }),
        addlike: builder.mutation({
            query: (data) => ({
                url: 'like/addlike',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['like']
        }),
        updatelike: builder.mutation({
            query: (data) => ({  
                url: `like/updatelike/${data._id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['like']
        }),
        deletelike: builder.mutation({
            query: (id) => ({
                url: `like/deletelike/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['like']
        }),

    })
})


export const {
    useGetlikeQuery,
    useAddlikeMutation,
    useUpdatelikeMutation,
    useDeletelikeMutation
} = likeApi