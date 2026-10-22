import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'

export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getcart: builder.query({
            query: () => 'cart/allcart',
            providesTags: ['cart']
        }),
        addcart: builder.mutation({
            query: (data) => ({
                url: 'cart/addcart',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['cart']
        }),
        updatecart: builder.mutation({
            query: (data) => ({  
                url: `cart/updatecart/${data._id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['cart']
        }),
        deletecart: builder.mutation({
            query: (id) => ({
                url: `cart/deletecart/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['cart']
        }),

    })
})


export const {
    useGetcartQuery,
    useAddcartMutation,
    useUpdatecartMutation,
    useDeletecartMutation
} = cartApi