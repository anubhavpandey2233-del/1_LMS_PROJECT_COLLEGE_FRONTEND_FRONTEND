
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'

export const reviewApi = createApi({
    reducerPath: 'reviewApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')

            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        }
    }),
    tagTypes: ['review'],
    endpoints: (build) => ({
        getAllreview: build.query({
            query: () => 'review/allreview',
            providesTags: ['review']
        }),

        addreview: build.mutation({
            query: (data) => ({
                url: 'review/addreview',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['review']
        }),

        updatereview: build.mutation({
            query: (data) => ({
                url: `review/updatereview/${data._id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['review']
        }),

        deletereview: build.mutation({
            query: (id) => ({
                url: `review/deletereview/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['review']
        }),
    }),
})

export const {
    useGetAllreviewQuery,
    useAddreviewMutation,
    useUpdatereviewMutation,
    useDeletereviewMutation
} = reviewApi
