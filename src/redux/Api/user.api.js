import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utility/url';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getUserCounts: builder.query({
            query: () => 'user/counts'
        })
    })
});

export const { useGetUserCountsQuery } = userApi;