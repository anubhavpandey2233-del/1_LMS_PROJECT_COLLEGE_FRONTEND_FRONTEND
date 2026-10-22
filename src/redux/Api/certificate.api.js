import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../utility/url'

export const certificateApi = createApi({
    reducerPath: 'certificateApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (build) => ({
       
        addgenerateCertificate: build.mutation({
            query: (data) => ({
                url: 'certificate/genratecertificate',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['certificate']
        }),
       
    }),
})

export const { useAddgenerateCertificateMutation } = certificateApi