
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosinstance } from "../../utility/axiosIntersepotr";

const initialState = {
    isloading: false,
    category: [],
    error: null
};

export const addCategory = createAsyncThunk(
    "category/addCategory",
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("desciption", data.desciption);

            if (data.category_img?.[0]) {
                formData.append("category_img", data.category_img[0]);
            }

            if (data.parent_id) {
                formData.append("parent_id", data.parent_id);
            }

            const response = await axiosinstance.post(
                "category/addcategory",
                formData
            );

            return response.data.data;
        } catch (error) {
            console.error(
                "Add Category Error:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.Message ||
                error.response?.data?.message ||
                error.message
            );
        }
    }
);

export const getCategory = createAsyncThunk(
    "category/getCategory",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosinstance.get("category/allcatgroy");
            return response.data.data;
        } catch (error) {
            console.error(
                "Get Category Error:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.Message ||
                error.response?.data?.message ||
                error.message
            );
        }
    }
);

export const updateCategroy = createAsyncThunk(
    "category/updateCategroy",
    async (data, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("desciption", data.desciption);

            if (data.category_img?.[0]) {
                formData.append("category_img", data.category_img[0]);
            }

            if (data.parent_id) {
                formData.append("parent_id", data.parent_id);
            }

            const response = await axiosinstance.put(
                `category/updatecategory/${data._id}`,
                formData
            );

            return response.data.data;
        } catch (error) {
            console.error(
                "Update Category Error:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.Message ||
                error.response?.data?.message ||
                error.message
            );
        }
    }
);

export const deletCategroy = createAsyncThunk(
    "category/deletCategroy",
    async (_id, { rejectWithValue }) => {
        try {
            await axiosinstance.delete(`category/deletecategory/${_id}`);
            return _id;
        } catch (error) {
            console.error(
                "Delete Category Error:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.Message ||
                error.response?.data?.message ||
                error.message
            );
        }
    }
);

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        clearCategoryError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategory.pending, (state) => {
                state.isloading = true;
                state.error = null;
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.isloading = false;
                state.category = Array.isArray(action.payload)
                    ? action.payload
                    : [];
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.isloading = false;
                state.error = action.payload || action.error.message;
            })

            .addCase(addCategory.pending, (state) => {
                state.isloading = true;
                state.error = null;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.isloading = false;

                if (action.payload?._id) {
                    const exists = state.category.some(
                        (item) => item._id === action.payload._id
                    );

                    if (!exists) {
                        state.category.push(action.payload);
                    }
                }
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.isloading = false;
                state.error = action.payload || action.error.message;
            })

            .addCase(updateCategroy.pending, (state) => {
                state.isloading = true;
                state.error = null;
            })
            .addCase(updateCategroy.fulfilled, (state, action) => {
                state.isloading = false;

                if (action.payload?._id) {
                    const index = state.category.findIndex(
                        (item) => item._id === action.payload._id
                    );

                    if (index !== -1) {
                        state.category[index] = action.payload;
                    }
                }
            })
            .addCase(updateCategroy.rejected, (state, action) => {
                state.isloading = false;
                state.error = action.payload || action.error.message;
            })

            .addCase(deletCategroy.pending, (state) => {
                state.isloading = true;
                state.error = null;
            })
            .addCase(deletCategroy.fulfilled, (state, action) => {
                state.isloading = false;
                state.category = state.category.filter(
                    (item) => item._id !== action.payload
                );
            })
            .addCase(deletCategroy.rejected, (state, action) => {
                state.isloading = false;
                state.error = action.payload || action.error.message;
            });
    }
});

export const { clearCategoryError } = categorySlice.actions;

export default categorySlice.reducer;



// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { createSlice } from "@reduxjs/toolkit";
// import { BASE_URL } from "../../utility/url";
// import { axiosinstance } from "../../utility/axiosIntersepotr";


// const initialState = {
//     isloading: false,
//     category: [],
//     error: null
// }
// console.log(initialState);

// export const addCategory = createAsyncThunk(
//     'category/addCategory',
//     async (data) => {
//         try {

//             console.log("Data: ", data);

//             const formData = new FormData();

//             formData.append("name", data.name)
//             formData.append("desciption", data.desciption)
//             formData.append("category_img", data.category_img[0])

//             if(data.parent_id){
//                 formData.append("parent_id", data.parent_id)
//             }

//             console.log("formdata", Object.fromEntries(formData.entries()));
            

//             const response = await axiosinstance.post("category/addcategory", formData);
//             console.log(response.data.data);

//             return response.data.data;
//         } catch (error) {
//             console.log(error);

//         }

//     }
// )

// export const getCategory = createAsyncThunk(
//     'category/getCategory',
//     async (_, {rejectWithValue}) => {
//         try {
//             const response = await axiosinstance.get("category/allcatgroy");
//             console.log(response);

//             const { data } = response;
//             console.log(data.data);

//             return data.data;

//         } catch (error) {
//             return rejectWithValue(error.message)
//         }
//     }
// )

// export const updateCategroy = createAsyncThunk(
//     'category/updateCategroy',
//     async (data) => {
//         try {
//             console.log("updatedData", data);

//             const formData = new FormData();

//             formData.append("name", data.name)
//             formData.append("desciption", data.desciption)
//             formData.append("category_img", data.category_img[0])

//             console.log("formdata", Object.fromEntries(formData.entries()));


//             const response = await axiosinstance.put(`category/updatecategory/${data._id}`, formData);
//             console.log(response);

//             return response.data.data;
//         } catch (error) {
//             console.log(error);
//         }

//     }   
// )

// export const deletCategroy = createAsyncThunk(
//     'category/deletCategroy',
//     async (_id) => {
//         try {
//             console.log("updated Data: ", _id);
//             const response = await axiosinstance.delete(`category/deletecategory/${_id}`);
//             console.log(response);

//             return _id
//         } catch (error) {
//             console.log(error);
//         }

//     }
// )

// const categorySlice = createSlice({
//     name: 'category',
//     initialState,
//     extraReducers: (builder) => {
//         builder.addCase(getCategory.pending, (state, action) => {
//             state.isloading = true
//         })

//         builder.addCase(getCategory.fulfilled, (state, action) => {
//             state.isloading = false
//             state.category = action.payload
//         })

//         builder.addCase(getCategory.rejected, (state, action) => {
//            state.isloading = false
//             state.category = []
//             state.error= action.payload
//         })

//          builder.addCase(addCategory.fulfilled, (state, action) => {
//             state.category.push(action.payload) 
//         })

//         builder.addCase(deletCategroy.fulfilled, (state, action) => {
//             state.category = state.category?.filter((v) => v._id !== action.payload);
//         })

//         builder.addCase(updateCategroy.fulfilled, (state, action) => {
//             console.log(state.category);

//             const Index = state.category?.findIndex((v) => v._id === action.payload._id);
        
//             console.log("category INDEX:",Index);

//             state.category[Index] = action.payload;
//         })        
//     }
// })


// export default categorySlice.reducer