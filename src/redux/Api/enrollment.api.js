import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'

export const enrollmentapi = createApi({
    reducerPath: 'enrollmentapi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getenrollment: builder.query({
            query: () => 'enrollment/allenrollment',
            providesTags: ['enrollment']
        }),
        addenrollment: builder.mutation({
            query: (data) => ({
                url: 'enrollment/addenrollment',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['enrollment']
        }),
        updateenrollment: builder.mutation({
            query: (data) => ({  
                url: `enrollment/updateenrollment/${data._id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['enrollment']
        }),
        deleteenrollment: builder.mutation({
            query: (id) => ({
                url: `enrollment/deleteenrollment/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['enrollment']
        }),

    })
})


export const {
    useGetenrollmentQuery,
    useAddenrollmentMutation,
    useUpdateenrollmentMutation,
    useDeleteenrollmentMutation
} = enrollmentapi