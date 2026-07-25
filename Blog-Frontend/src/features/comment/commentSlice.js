import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
    fetchAllComments as fetchAllCommentsApi,
    createComment as createCommentApi,
    deleteComment as deleteCommentApi,
    updateComment as updateCommentApi,
} from "@/src/services/commentService"
import { ShowSuccessNotification } from "@/src/utils/ShowToastNotification"

export const COMMENT_LIMIT = 5;

const initialState = {
    comments: [],
    isLoading: false,
    isLoadingWhileAdding: false,
    isLoadingWhileDeleting: false,
    isLoadingWhileUpdating: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        pageSize: COMMENT_LIMIT,
        hasNextPage: false,
        hasPrevPage: false,
    },
}

// fetch comments by blog id (paginated)
export const fetchAllComments = createAsyncThunk(
    "comment/fetchAllComments",
    async ({ page = 1, limit = COMMENT_LIMIT } = {}, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const blogId = state.article.currentArticle?._id;

            if (!blogId) {
                return thunkAPI.rejectWithValue("Blog ID is not available");
            }

            const data = await fetchAllCommentsApi({ blogId, page, limit });

            if (data?.status?.toLowerCase() === "success") {
                return {
                    comments: data.data ?? [],
                    pagination: data.pagination,
                };
            }

            return thunkAPI.rejectWithValue(data?.message || "Failed to fetch comments");
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);


// add comment to a blog
export const addComment = createAsyncThunk(
    "comment/addComment",
    async ({ content }, thunkAPI) => {
        try {
            const blogId = thunkAPI.getState().article.currentArticle?._id;

            if (!blogId) {
                return thunkAPI.rejectWithValue("Blog ID is not available");
            }

            if (!content?.trim()) {
                return thunkAPI.rejectWithValue("Comment content is required");
            }

            const data = await createCommentApi({
                blogId,
                content: content.trim(),
            });

            if (data?.status?.toLowerCase() === "success") {
                ShowSuccessNotification(data);
                // refresh first page so new comment appears (sorted newest first)
                await thunkAPI.dispatch(
                    fetchAllComments({ page: 1, limit: COMMENT_LIMIT })
                );
                return data.data;
            }

            return thunkAPI.rejectWithValue(data?.message || "Failed to add comment");
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);


// delete comment by id
export const deleteComment = createAsyncThunk(
    "comment/deleteComment",
    async ({ commentId }, thunkAPI) => {
        try {
            if (!commentId) {
                return thunkAPI.rejectWithValue("Comment ID is required");
            }

            const data = await deleteCommentApi({ commentId });

            if (data?.status?.toLowerCase() === "success") {
                ShowSuccessNotification(data);

                const { comments, pagination } = thunkAPI.getState().comment;
                const isLastOnPage = comments.length === 1;
                const currentPage = pagination.currentPage || 1;
                // if last item on page 2+, go back one page
                const nextPage =
                    isLastOnPage && currentPage > 1
                        ? currentPage - 1
                        : currentPage;

                await thunkAPI.dispatch(
                    fetchAllComments({ page: nextPage, limit: COMMENT_LIMIT })
                );

                return commentId;
            }

            return thunkAPI.rejectWithValue(
                data?.message || "Failed to delete comment"
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// update comment by id
export const updateComment = createAsyncThunk(
    "comment/updateComment",
    async ({ commentId, content }, thunkAPI) => {
        try {
            if (!commentId) {
                return thunkAPI.rejectWithValue("Comment ID is required");
            }
            if (!content?.trim()) {
                return thunkAPI.rejectWithValue("Comment content is required");
            }

            const data = await updateCommentApi({
                commentId,
                content: content.trim(),
            });

            if (data?.status?.toLowerCase() === "success") {
                ShowSuccessNotification(data);

                const { pagination } = thunkAPI.getState().comment;
                await thunkAPI.dispatch(
                    fetchAllComments({
                        page: pagination.currentPage || 1,
                        limit: COMMENT_LIMIT,
                    })
                );

                return { commentId, content: content.trim() };
            }

            return thunkAPI.rejectWithValue(
                data?.message || "Failed to update comment"
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        resetComments: (state) => {
            state.comments = [];
            state.pagination = initialState.pagination;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchAllComments cases
            .addCase(fetchAllComments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comments = action.payload.comments;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchAllComments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // addComment cases
            .addCase(addComment.pending, (state) => {
                state.isLoadingWhileAdding = true;
                state.error = null;
            })
            .addCase(addComment.fulfilled, (state) => {
                state.isLoadingWhileAdding = false;
            })
            .addCase(addComment.rejected, (state, action) => {
                state.isLoadingWhileAdding = false;
                state.error = action.payload;
            })
            // deleteComment cases
            .addCase(deleteComment.pending, (state) => {
                state.isLoadingWhileDeleting = true;
                state.error = null;
            })
            .addCase(deleteComment.fulfilled, (state) => {
                state.isLoadingWhileDeleting = false;
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.isLoadingWhileDeleting = false;
                state.error = action.payload;
            })
            // updateComment cases
            .addCase(updateComment.pending, (state) => {
                state.isLoadingWhileUpdating = true;
                state.error = null;
            })
            .addCase(updateComment.fulfilled, (state) => {
                state.isLoadingWhileUpdating = false;
            })
            .addCase(updateComment.rejected, (state, action) => {
                state.isLoadingWhileUpdating = false;
                state.error = action.payload;
            });
    },
});

export const { resetComments } = commentSlice.actions;
export default commentSlice.reducer;
