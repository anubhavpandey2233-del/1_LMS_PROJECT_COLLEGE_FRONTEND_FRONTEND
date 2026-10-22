// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'

// Define a service using a base URL and expected endpoints
export const WhistlistApi = createApi({
    reducerPath: 'WhistlistApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getWhistlist: builder.query({
            query: () => 'wishlist/allwishlist',
            providesTags: ['wishlist']
        }),
        addWhistlist: builder.mutation({
            query: (data) => ({
                url: 'wishlist/addwishlist',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['wishlist']
        }),
        updateWhistlist: builder.mutation({
            query: (data) => ({
                url: `wishlist/updatewishlist/${data._id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['wishlist']
        }),
        deleteWhistlist: builder.mutation({
            query: (id) => ({
                url: `wishlist/deletewishlist/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['wishlist']
        }),
    })
})


export const { useGetWhistlistQuery, useAddWhistlistMutation, useUpdateWhistlistMutation, useDeleteWhistlistMutation } = WhistlistApi