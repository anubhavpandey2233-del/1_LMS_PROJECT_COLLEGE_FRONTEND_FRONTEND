import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'

export const SectionApi = createApi({
    reducerPath: 'SectionApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (build) => ({
        getAllSection: build.query({
            query: () => 'section/allsection',
            providesTags: ['Section']
        }),
        addSection: build.mutation({
            query: (data) => ({
                url: 'section/addsection',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Section']
        }),
        updateSection: build.mutation({
            query: (data) => ({
                url: `section/updatesection/${data._id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Section']
        }),
        deleteSection: build.mutation({
            query: (id) => ({
                url: `section/deletesection/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Section']
        }),
    }),
})

export const { useGetAllSectionQuery, useAddSectionMutation, useUpdateSectionMutation, useDeleteSectionMutation } = SectionApi