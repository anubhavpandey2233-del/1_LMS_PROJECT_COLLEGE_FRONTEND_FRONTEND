import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'

export const paymentapi = createApi({
    reducerPath: 'paymentapi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getpayment: builder.query({
            query: () => 'payment/allpayment',
            providesTags: ['payment']
        }),
        createOrder: builder.mutation({
            query: (data) => ({
                url: 'payment/payment-creatOrder',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['payment']
        }),
        verifyPayment: builder.mutation({
            query: (data) => ({
                url: 'payment/payment-verify',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['payment']
        }),
    })
})


export const {
    useGetpaymentQuery,
    useCreateOrderMutation,
    useVerifyPaymentMutation,
} = paymentapi