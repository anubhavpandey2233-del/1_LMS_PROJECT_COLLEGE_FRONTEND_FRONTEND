import axios from "axios";
import { BASE_URL } from "./url";

export const axiosinstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials : true
});

axiosinstance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
  { synchronous: true, runWhen: () => {} /* This function returns true */}
);

// Add a response interceptor
axiosinstance.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },async function onRejected(error) {
    console.log(error.response);
    
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    if(error.response && error.response.status === 401){
      const res = await axios.post(BASE_URL + "user/gereratenewToken", {}, {withCredentials:true})
      console.log(res);

      return axiosinstance(error.config);
    }
    
    return Promise.reject(error);
  });