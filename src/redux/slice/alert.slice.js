import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    text : '',
    variant : ''
}

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers : {
        setalert : (state , action) => {
            state.text = action.payload.text;
            state.variant = action.payload.variant;
        },
        resetalert : (state , action) => {
             state.text = '';
            state.variant = '';
        }
    }
})

export const { setalert , resetalert} = alertSlice.actions;
export default alertSlice.reducer;