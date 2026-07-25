import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loginOpen: false,
};

const dialogSlice = createSlice({
    name: "dialog",
    initialState,
    reducers: {
        openLoginDialog: (state) => {
            state.loginOpen = true;
        },

        closeLoginDialog: (state) => {
            state.loginOpen = false;
        },
    },
});

export const {
    openLoginDialog,
    closeLoginDialog,
} = dialogSlice.actions;

export default dialogSlice.reducer;