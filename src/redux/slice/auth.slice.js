
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosinstance } from '../../utility/axiosIntersepotr';
import { setalert } from './alert.slice';

const initialState = {
  isLoading: false,
  user: null,
  errors: null
};

const getErrorMessage = (error) => {
  return error?.response?.data?.Message ||
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong';
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosinstance.post('user/register', data);

      if (response.data.sucess) {
        dispatch(setalert({
          text: response.data.Message,
          variant: 'success'
        }));

        return response.data.data;
      }

      return rejectWithValue(response.data.Message || 'Registration failed');
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setalert({ text: message, variant: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const VerifyUser = createAsyncThunk(
  'auth/verifyUser',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosinstance.post('user/is_verify', data);

      if (response.data.sucess) {
        dispatch(setalert({
          text: response.data.Message,
          variant: 'success'
        }));

        return response.data.data;
      }

      return rejectWithValue(response.data.Message || 'Verification failed');
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setalert({ text: message, variant: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const LoginUser = createAsyncThunk(
  'auth/LoginUser',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosinstance.post('user/login', data);

      if (response.data.sucess) {
        dispatch(setalert({
          text: response.data.Message,
          variant: 'success'
        }));

        return response.data.data;
      }

      return rejectWithValue(response.data.Message || 'Login failed');
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setalert({ text: message, variant: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const LogoutUser = createAsyncThunk(
  'auth/LogoutUser',
  async (_id, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosinstance.post('user/logout', { _id });

      if (response.data.sucess) {
        dispatch(setalert({
          text: response.data.Message,
          variant: 'success'
        }));

        return response.data.data;
      }

      return rejectWithValue(response.data.Message || 'Logout failed');
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setalert({ text: message, variant: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const CheackAuth = createAsyncThunk(
  'auth/CheackAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get('user/checkAuth');

      if (response.data.sucess) {
        return response.data;
      }

      return rejectWithValue(response.data.Message || 'Authentication failed');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const ForgotPass = createAsyncThunk(
  'auth/ForgotPass',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosinstance.post('user/forgot', data);

      if (response.data.sucess) {
        dispatch(setalert({
          text: response.data.Message,
          variant: 'success'
        }));

        return response.data.data;
      }

      return rejectWithValue(response.data.Message || 'Request failed');
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setalert({ text: message, variant: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const ResetPass = createAsyncThunk(
  'auth/ResetPass',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosinstance.post('user/reset', data);

      if (response.data.sucess) {
        dispatch(setalert({
          text: response.data.Message,
          variant: 'success'
        }));

        return response.data.data;
      }

      return rejectWithValue(response.data.Message || 'Password reset failed');
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setalert({ text: message, variant: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const editProfile = createAsyncThunk(
  'user/edit-profile',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('phone_no', data.phone_no);
      formData.append('about', data.about);
      formData.append('facebookID', data.facebookID);
      formData.append('twitterID', data.twitterID);
      formData.append('linkedInID', data.linkedInID);

      if (data.pfp instanceof File) {
        formData.append('pfp', data.pfp);
      }

      const response = await axiosinstance.put(
        `user/edit-profile/${data._id}`,
        formData
      );

      if (response.data.sucess) {
        dispatch(setalert({
          text: response.data.Message,
          variant: 'success'
        }));

        return response.data.data;
      }

      return rejectWithValue(response.data.Message || 'Profile update failed');
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setalert({ text: message, variant: 'error' }));
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.errors = null;
    }
  },

  extraReducers: (builder) => {

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { data: action.payload };
        state.errors = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });

    // Verify User
    builder
      .addCase(VerifyUser.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(VerifyUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { data: action.payload };
        state.errors = null;
      })
      .addCase(VerifyUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });

    // Login
    builder
      .addCase(LoginUser.pending, (state) => {
        state.isLoading = true;
        state.user = null;
        state.errors = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { data: action.payload };
        state.errors = null;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.errors = action.payload;
      });

    // Check Authentication
    builder
      .addCase(CheackAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CheackAuth.fulfilled, (state, action) => {
        state.isLoading = false;

        state.user = action.payload?.data
          ? action.payload
          : { data: action.payload };

        state.errors = null;
      })
      .addCase(CheackAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.errors = action.payload;
      });

    // Logout
    builder
      .addCase(LogoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LogoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.errors = null;
      })
      .addCase(LogoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });

    // Forgot Password
    builder
      .addCase(ForgotPass.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(ForgotPass.fulfilled, (state) => {
        state.isLoading = false;
        state.errors = null;
      })
      .addCase(ForgotPass.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });

    // Reset Password
    builder
      .addCase(ResetPass.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(ResetPass.fulfilled, (state) => {
        state.isLoading = false;
        state.errors = null;
      })
      .addCase(ResetPass.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });

    // Edit Profile
    builder
      .addCase(editProfile.pending, (state) => {
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { data: action.payload };
        state.errors = null;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });
  }
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;




// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { axiosinstance } from '../../utility/axiosIntersepotr';
// import { setalert } from './alert.slice';

// const initialState = {
//     isLoading: false,
//     user: null,
//     errors: null
// }

// export const registerUser = createAsyncThunk(
//     'auth',
//     async (data, { dispatch, rejectWithValue }) => {
//         try {
//             console.log(data);

//             const response = await axiosinstance.post("user/register", data)

//             console.log(response);

//             if (response.data.sucess) {
//                 console.log(response.data);

//                 dispatch(setalert({ text: response.data.Message, variant: "success" }))
//                 return response.data.data
//             }
//         } catch (error) {
//             console.log(error);
//             dispatch(setalert({ text: error.response.data.Message, variant: "error" }))
//             return rejectWithValue(error.response.data.Message)
//         }

//     }

// )

// export const VerifyUser = createAsyncThunk(
//     'auth/verifyUser',
//     async (data, { dispatch, rejectWithValue }) => {
//         try {
//             const response = await axiosinstance.post(
//                 'user/is_verify',
//                 data
//             )

//             console.log(response);

//             if (response.data.sucess) {
//                 await dispatch(setalert({ text: response.data.Message, variant: "success" }))
//                 return response.data.data
//             }

//         } catch (error) {
//             console.log(error);
//             dispatch(setalert({ text: error.response.data.Message, variant: "error" }))
//             return rejectWithValue(error.response.data.Message)
//         }
//     }
// )

// export const LoginUser = createAsyncThunk(
//     'auth/LoginUser',
//     async (data, { dispatch, rejectWithValue }) => {
//         try {
//             const response = await axiosinstance.post(
//                 'user/login',
//                 data
//             )

//             console.log(response);

//             if (response.data.sucess) {
//                 dispatch(setalert({ text: response.data.Message, variant: "success" }))
//                 return response.data.data
//             }

//         } catch (error) {
//             console.log(error?.response);
//             dispatch(setalert({ text: error.response.data.Message, variant: "error" }))
//             return rejectWithValue(error.response.data.Message)
//         }
//     }
// )

// export const LogoutUser = createAsyncThunk(
//     'auth/LogoutUser',
//     async (_id, { dispatch }) => {
//         try {
//             console.log("Idddddd:", _id);

//             const response = await axiosinstance.post(
//                 'user/logout',
//                 { _id }
//             )

//             console.log(response);

//             if (response.data.sucess) {
//                 dispatch(setalert({ text: response.data.Message, variant: "success" }))
//                 return response.data.data
//             }

//         } catch (error) {
//             console.log(error);
//         }
//     }
// )

// export const CheackAuth = createAsyncThunk(
//     'auth/CheackAuth',
//     async (_, { dispatch, rejectWithValue }) => {
//         try {
//             const response = await axiosinstance.get(
//                 'user/checkAuth')

//             console.log(response);

//             return response.data
//         } catch (error) {
//             console.log(error.response);

//             return rejectWithValue(error.response.data.Message)
//         }
//     }
// )

// export const ForgotPass = createAsyncThunk(
//     'auth/ForgotPass',
//     async (data, { dispatch, rejectWithValue }) => {
//         try {
//             const response = await axiosinstance.post(
//                 'user/forgot', data)

//             console.log(response);

//             if (response.data.sucess) {
//                 dispatch(setalert({ text: response.data.Message, variant: "success" }))
//                 return response.data.data
//             }

//         } catch (error) {
//             console.log(error.response);

//             return rejectWithValue(error.response.data.Message)
//         }
//     }
// )

// export const ResetPass = createAsyncThunk(
//     'auth/ResetPass',
//     async (data, { dispatch, rejectWithValue }) => {
//         try {
//             const response = await axiosinstance.post(
//                 'user/reset', data)

//             console.log(response);

//             if (response.data.sucess) {
//                 dispatch(setalert({ text: response.data.Message, variant: "success" }))
//                 return response.data.data
//             }
//         } catch (error) {
//             console.log(error.response);

//             return rejectWithValue(error.response.data.Message)
//         }
//     }
// )

// export const editProfile = createAsyncThunk(
//     'user/edit-profile',
//     async (data, { dispatch, rejectWithValue }) => {
//         try {
//             console.log("updatedData", data);

//             const formData = new FormData();

//             formData.append("name", data.name);
//             formData.append("phone_no", data.phone_no);
//             formData.append("about", data.about);
//             formData.append("facebookID", data.facebookID);
//             formData.append("twitterID", data.twitterID);
//             formData.append("linkedInID", data.linkedInID);

//             // Only append pfp if it is a File object (meaning user selected a new image)
//             if (data.pfp instanceof File) {
//                 formData.append("pfp", data.pfp);
//             }

//             console.log("formdata", Object.fromEntries(formData.entries()));

//             const response = await axiosinstance.put(`user/edit-profile/${data._id}`, formData);
//             console.log(response);

//             if (response.data.sucess) {
//                 dispatch(setalert({ text: response.data.Message, variant: "success" }))
//                 return response.data.data
//             }

//             return response.data.data;
//         } catch (error) {
//             console.log(error);
//             const errMsg = error.response?.data?.Message || "Failed to update profile";
//             dispatch(setalert({ text: errMsg, variant: "error" }));
//             return rejectWithValue(errMsg);
//         }
//     }
// )

// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     extraReducers: (builder) => {
//         builder.addCase(registerUser.fulfilled, (state, action) => {
//             state.isLoading = false;
//             state.user = { data: action.payload };
//             state.errors = null;
//         })
//         builder.addCase(registerUser.pending, (state, action) => {
//             state.isLoading = true;
//             state.user = null;
//             state.errors = null;
//         })
//         builder.addCase(registerUser.rejected, (state, action) => {
//             state.isLoading = false;
//             state.user = null;
//             state.errors = action.payload;
//         })

//         builder.addCase(VerifyUser.fulfilled, (state, action) => {
//             state.isLoading = false;
//             state.user = { data: action.payload };
//             state.errors = null;
//         })

//         builder.addCase(VerifyUser.pending, (state, action) => {
//             state.isLoading = true;
//             state.user = null;
//             state.errors = null;
//         })

//         builder.addCase(VerifyUser.rejected, (state, action) => {
//             state.isLoading = false;
//             state.user = null;
//             state.errors = action.payload;
//         })

//         builder.addCase(LoginUser.fulfilled, (state, action) => {
//             state.isLoading = false;
//             state.user = { data: action.payload };
//             state.errors = null;
//         })
//         builder.addCase(LoginUser.pending, (state, action) => {
//             state.isLoading = true;
//             state.user = null;
//             state.errors = null;
//         })
//         builder.addCase(LoginUser.rejected, (state, action) => {
//             console.log(action.payload);
//             state.isLoading = false;
//             state.user = null;
//             state.errors = action.payload;
//         })

//         builder.addCase(CheackAuth.fulfilled, (state, action) => {
//             state.isLoading = false;
//             state.user = action.payload;
//             state.errors = null;
//         })

//         builder.addCase(CheackAuth.pending, (state, action) => {
//             state.isLoading = true;
//             state.user = null;
//             state.errors = null;
//         })

//         builder.addCase(CheackAuth.rejected, (state, action) => {
//             state.isLoading = false;
//             state.user = null;
//             state.errors = action.payload;
//         })

//         builder.addCase(LogoutUser.fulfilled, (state, action) => {
//             state.isLoading = false;
//             state.user = null;
//             state.errors = null;
//         })
//         builder.addCase(LogoutUser.pending, (state, action) => {
//             state.isLoading = true;
//             state.user = null;
//             state.errors = null;
//         })
//         builder.addCase(editProfile.pending, (state, action) => {
//             state.isLoading = true;
//             state.errors = null;
//         })
//         builder.addCase(editProfile.rejected, (state, action) => {
//             state.isLoading = false;
//             state.errors = action.payload;
//         })
//         builder.addCase(editProfile.fulfilled, (state, action) => {
//             state.isLoading = false;
//             state.user = { data: action.payload };
//             state.errors = null;
//         })
//     }
// })



// export default authSlice.reducer