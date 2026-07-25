import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dialogReducer from "../features/dialog/dialogSlice";
import articleReducer from "../features/blog/blogSlice";
import commentReducer from "../features/comment/commentSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dialog: dialogReducer,
        article: articleReducer,
        comment: commentReducer,
    },
});

export default store;