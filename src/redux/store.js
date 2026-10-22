
import { configureStore } from '@reduxjs/toolkit'
import authReducers from './slice/auth.slice'
import alertReducers from './slice/alert.slice'
import categoryReducers from './slice/CategorySlice'
import { courseApi } from './Api/Course.api'
import { SectionApi } from './Api/Section.api'
import { quizApi } from './Api/quiz.api'
import { quizContentApi } from './Api/quizContent.api'
import { contentApi } from './Api/Content.api'
import { cartApi } from './Api/Cart.api'
import { coupanApi } from './Api/coupan.api'
import { paymentapi } from './Api/payment.api'
import { enrollmentapi } from './Api/enrollment.api'
import { progessApi } from './Api/progess.api'
import { certificateApi } from './Api/certificate.api'
import { reviewApi } from './Api/review.api'
import { WhistlistApi } from './Api/wishlist.api'
import { blogApi } from './Api/blog.api'
import { tagApi } from './Api/tag.api'
import { likeApi } from './Api/like.api'
import { commentApi } from './Api/blogComment.api'
import { userApi } from './Api/user.api'

export const store = configureStore({
  reducer: {
    auth: authReducers,
    alert: alertReducers,
    category: categoryReducers,
    [courseApi.reducerPath]: courseApi.reducer,
    [SectionApi.reducerPath]: SectionApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [quizContentApi.reducerPath]: quizContentApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [coupanApi.reducerPath]: coupanApi.reducer,
    [paymentapi.reducerPath]: paymentapi.reducer,
    [enrollmentapi.reducerPath]: enrollmentapi.reducer,
    [progessApi.reducerPath]: progessApi.reducer,
    [certificateApi.reducerPath]: certificateApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [WhistlistApi.reducerPath]: WhistlistApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [tagApi.reducerPath]: tagApi.reducer,
    [likeApi.reducerPath]: likeApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      courseApi.middleware,
      SectionApi.middleware,
      quizApi.middleware,
      quizContentApi.middleware,
      contentApi.middleware,
      cartApi.middleware,
      coupanApi.middleware,
      paymentapi.middleware,
      enrollmentapi.middleware,
      progessApi.middleware,
      certificateApi.middleware,
      reviewApi.middleware,
      WhistlistApi.middleware,
      blogApi.middleware,
      tagApi.middleware,
      likeApi.middleware,
      commentApi.middleware,
      userApi.middleware
    ),
})
