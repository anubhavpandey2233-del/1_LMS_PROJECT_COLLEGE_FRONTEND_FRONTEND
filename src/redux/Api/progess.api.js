import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'

export const progessApi = createApi({
    reducerPath: 'progessApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (build) => ({
        getAllprogess: build.query({
            query: () => 'progess/allporgess',
            providesTags: ['progess']
        }),
        addprogess: build.mutation({
            query: (data) => ({
                url: 'progess/addporgess',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['progess']
        }),
        updateprogess: build.mutation({
            query: (data) => ({
                url: `progess/updateporgess/${data._id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['progess']
        }),
        deleteprogess: build.mutation({
            query: (id) => ({
                url: `progess/deleteporgess/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['progess']
        }),
    }),
})

export const { useGetAllprogessQuery, useAddprogessMutation, useUpdateprogessMutation, useDeleteprogessMutation } = progessApi