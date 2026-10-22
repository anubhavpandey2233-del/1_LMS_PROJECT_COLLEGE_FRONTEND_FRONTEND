import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'

export const coupanApi = createApi({
    reducerPath: 'coupanApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getCoupan: builder.query({
            query: () => 'coupan/allcoupan',
            providesTags: ['coupan']
        }),
        addCoupan: builder.mutation({
            query: (data) => ({
                url: 'coupan/addcoupan',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['coupan']
        }),
        updateCoupan: builder.mutation({
            query: (data) => ({  
                url: `coupan/updatecoupan/${data._id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['coupan']
        }),
        deleteCoupan: builder.mutation({
            query: (id) => ({
                url: `coupan/deletecoupan/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['coupan']
        }),

    })
})


export const {
    useGetCoupanQuery,
    useAddCoupanMutation,
    useUpdateCoupanMutation,
    useDeleteCoupanMutation,
} = coupanApi