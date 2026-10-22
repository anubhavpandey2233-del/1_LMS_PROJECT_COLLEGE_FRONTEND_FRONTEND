import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'


export const quizContentApi = createApi({
    reducerPath: 'quizContentApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getquizContent: builder.query({
            query: () => 'quiz_content/allquiz_content',
            providesTags: ['quiz_content']
        }),
        addquizContent: builder.mutation({
            query: (data) => ({
                url: 'quiz_content/addquiz_content',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['quiz_content']
        }),
        updatequizContent: builder.mutation({
            query: (data) => ({
                url: `quiz_content/updatequiz_content/${data._id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['quiz_content']
        }),
        deletequizContent: builder.mutation({
            query: (id) => ({
                url: `quiz_content/deletequiz_content/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['quiz_content']
        }),

    })
})


export const {
    useGetquizContentQuery,
    useAddquizContentMutation,
    useUpdatequizContentMutation,
    useDeletequizContentMutation
} = quizContentApi