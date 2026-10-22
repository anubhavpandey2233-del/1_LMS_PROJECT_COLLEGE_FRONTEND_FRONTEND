import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { axiosinstance } from '../../utility/axiosIntersepotr';
import { setalert } from './alert.slice';

const initialState = {
    isLoading: false,
    user: null,
    errors: null
}

export const registerUser = createAsyncThunk(
    'auth',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            console.log(data);

            const response = await axiosinstance.post("user/register", data)

            console.log(response);

            if (response.data.sucess) {
                console.log(response.data);

                dispatch(setalert({ text: response.data.Message, variant: "success" }))
                return response.data.data
            }
        } catch (error) {
            console.log(error);
            dispatch(setalert({ text: error.response.data.Message, variant: "error" }))
            return rejectWithValue(error.response.data.Message)
        }

    }

)

export const VerifyUser = createAsyncThunk(
    'auth/verifyUser',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosinstance.post(
                'user/is_verify',
                data
            )

            console.log(response);

            if (response.data.sucess) {
                await dispatch(setalert({ text: response.data.Message, variant: "success" }))
                return response.data.data
            }

        } catch (error) {
            console.log(error);
            dispatch(setalert({ text: error.response.data.Message, variant: "error" }))
            return rejectWithValue(error.response.data.Message)
        }
    }
)

export const LoginUser = createAsyncThunk(
    'auth/LoginUser',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosinstance.post(
                'user/login',
                data
            )

            console.log(response);

            if (response.data.sucess) {
                dispatch(setalert({ text: response.data.Message, variant: "success" }))
                return response.data.data
            }

        } catch (error) {
            console.log(error?.response);
            dispatch(setalert({ text: error.response.data.Message, variant: "error" }))
            return rejectWithValue(error.response.data.Message)
        }
    }
)

export const LogoutUser = createAsyncThunk(
    'auth/LogoutUser',
    async (_id, { dispatch }) => {
        try {
            console.log("Idddddd:", _id);

            const response = await axiosinstance.post(
                'user/logout',
                { _id }
            )

            console.log(response);

            if (response.data.sucess) {
                dispatch(setalert({ text: response.data.Message, variant: "success" }))
                return response.data.data
            }

        } catch (error) {
            console.log(error);
        }
    }
)

export const CheackAuth = createAsyncThunk(
    'auth/CheackAuth',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosinstance.get(
                'user/checkAuth')

            console.log(response);

            return response.data
        } catch (error) {
            console.log(error.response);

            return rejectWithValue(error.response.data.Message)
        }
    }
)

export const ForgotPass = createAsyncThunk(
    'auth/ForgotPass',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosinstance.post(
                'user/forgot', data)

            console.log(response);

            if (response.data.sucess) {
                dispatch(setalert({ text: response.data.Message, variant: "success" }))
                return response.data.data
            }

        } catch (error) {
            console.log(error.response);

            return rejectWithValue(error.response.data.Message)
        }
    }
)

export const ResetPass = createAsyncThunk(
    'auth/ResetPass',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosinstance.post(
                'user/reset', data)

            console.log(response);

            if (response.data.sucess) {
                dispatch(setalert({ text: response.data.Message, variant: "success" }))
                return response.data.data
            }
        } catch (error) {
            console.log(error.response);

            return rejectWithValue(error.response.data.Message)
        }
    }
)

export const editProfile = createAsyncThunk(
    'user/edit-profile',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            console.log("updatedData", data);

            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("phone_no", data.phone_no);
            formData.append("about", data.about);
            formData.append("facebookID", data.facebookID);
            formData.append("twitterID", data.twitterID);
            formData.append("linkedInID", data.linkedInID);

            // Only append pfp if it is a File object (meaning user selected a new image)
            if (data.pfp instanceof File) {
                formData.append("pfp", data.pfp);
            }

            console.log("formdata", Object.fromEntries(formData.entries()));

            const response = await axiosinstance.put(`user/edit-profile/${data._id}`, formData);
            console.log(response);

            if (response.data.sucess) {
                dispatch(setalert({ text: response.data.Message, variant: "success" }))
                return response.data.data
            }

            return response.data.data;
        } catch (error) {
            console.log(error);
            const errMsg = error.response?.data?.Message || "Failed to update profile";
            dispatch(setalert({ text: errMsg, variant: "error" }));
            return rejectWithValue(errMsg);
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = { data: action.payload };
            state.errors = null;
        })
        builder.addCase(registerUser.pending, (state, action) => {
            state.isLoading = true;
            state.user = null;
            state.errors = null;
        })
        builder.addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.errors = action.payload;
        })

        builder.addCase(VerifyUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = { data: action.payload };
            state.errors = null;
        })

        builder.addCase(VerifyUser.pending, (state, action) => {
            state.isLoading = true;
            state.user = null;
            state.errors = null;
        })

        builder.addCase(VerifyUser.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.errors = action.payload;
        })

        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = { data: action.payload };
            state.errors = null;
        })
        builder.addCase(LoginUser.pending, (state, action) => {
            state.isLoading = true;
            state.user = null;
            state.errors = null;
        })
        builder.addCase(LoginUser.rejected, (state, action) => {
            console.log(action.payload);
            state.isLoading = false;
            state.user = null;
            state.errors = action.payload;
        })

        builder.addCase(CheackAuth.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.errors = null;
        })

        builder.addCase(CheackAuth.pending, (state, action) => {
            state.isLoading = true;
            state.user = null;
            state.errors = null;
        })

        builder.addCase(CheackAuth.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.errors = action.payload;
        })

        builder.addCase(LogoutUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.errors = null;
        })
        builder.addCase(LogoutUser.pending, (state, action) => {
            state.isLoading = true;
            state.user = null;
            state.errors = null;
        })
        builder.addCase(editProfile.pending, (state, action) => {
            state.isLoading = true;
            state.errors = null;
        })
        builder.addCase(editProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.errors = action.payload;
        })
        builder.addCase(editProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = { data: action.payload };
            state.errors = null;
        })
    }
})



export default authSlice.reducer