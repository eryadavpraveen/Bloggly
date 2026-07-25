import {
    createBlog, deleteBlogById, fetchAllPublicBlogs, fetchUserBlogs, fetchBlogBySlug, fetchBlogById, updateBlogById, publishBlogById, unPublishBlogById, likeBlogById,
    unlikeBlogById,
} from "@/src/services/blogService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { ShowErrorNotification, ShowSuccessNotification } from "../../utils/ShowToastNotification"



const initialState = {
    articles: [],
    currentArticle: null,
    isLoading: false,
    isLoadingWhileFetchingArticles: false,
    isLoadingWhileAdding: false,
    isLoadingWhileUpdating: false,
    isLoadingWhileDeleting: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalBlogs: 0,
        limit: 9,
        hasNextPage: false,
        hasPrevPage: false,
    },
    filters: {
        searchQuery: "",
        status: "all", // Default status filter
        sortBy: "newest", // Default sorting option
    },
}

// fetch all articles

export const fetchAllPublicArticles = createAsyncThunk(
    "blog/fetchAllPublicArticles",
    async ({ page = 1, limit = 9, searchQuery, sortBy }, thunkAPI) => {
        try {
            const data = await fetchAllPublicBlogs({ page, limit, searchQuery, sortBy });

            if (data.status.toLowerCase() === "success") {
                return {
                    articles: data.data,
                    pagination: data.pagination,
                };
            }

            return thunkAPI.rejectWithValue(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// fetch logged-in user articles
export const fetchUserArticles = createAsyncThunk(
    "blog/fetchUserArticles",
    async ({ page = 1, limit = 9, searchQuery, status, sortBy }, thunkAPI) => {
        try {
            const data = await fetchUserBlogs({ page, limit, searchQuery, status, sortBy });

            if (data.status.toLowerCase() === "success") {
                return {
                    articles: data.data,
                    pagination: data.pagination,
                };
            }

            return thunkAPI.rejectWithValue(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// create blog
export const createArticle = createAsyncThunk(
    "blog/createArticle",
    async (articleData, thunkAPI) => {
        try {
            const data = await createBlog(articleData);

            if (data && data.status === "success") {
                ShowSuccessNotification(data)
                thunkAPI.dispatch(fetchAllPublicArticles({ page: 1, limit: 9 }));
                return data.data;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );

        }
    }
);

// fetch blog by slug
export const fetchCurrentArticle = createAsyncThunk(
    "blog/fetchCurrentArticle",
    async (slug, thunkAPI) => {
        try {
            const data = await fetchBlogBySlug(slug);

            if (data && data.status === "Success") {
                return data.data[0];   // <-- Use the first element
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// fetch blog by id (for edit form)
export const fetchArticleById = createAsyncThunk(
    "blog/fetchArticleById",
    async (id, thunkAPI) => {
        try {
            const data = await fetchBlogById(id);

            if (data?.status?.toLowerCase() === "success") {
                return data.data;
            }

            return thunkAPI.rejectWithValue(data?.message || "Failed to fetch blog");
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// update blog by id
export const updateArticle = createAsyncThunk(
    "blog/updateArticle",
    async ({ id, articleData }, thunkAPI) => {
        try {
            const data = await updateBlogById(id, articleData);

            if (data?.status?.toLowerCase() === "success") {
                ShowSuccessNotification(data);
                return data.data;
            }

            return thunkAPI.rejectWithValue(data?.message || "Failed to update blog");
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);


// delete blog by id
export const deleteArticle = createAsyncThunk(
    "blog/deleteArticle",
    async (id, thunkAPI) => {
        try {
            const data = await deleteBlogById(id);

            if (data && data.status === "success") {
                ShowSuccessNotification(data)
                return id; // Return the deleted blog's ID
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// publish blog by id
export const publishArticle = createAsyncThunk(
    "blog/publishArticle",
    async (id, thunkAPI) => {
        try {
            const data = await publishBlogById(id);
            if (data && data.status === "success") {
                ShowSuccessNotification(data)
                thunkAPI.dispatch(fetchAllPublicArticles({ page: 1, limit: 9 }));
                return data.data;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// unpublish blog by id

export const unpublishArticle = createAsyncThunk(
    "blog/unpublishArticle",
    async (id, thunkAPI) => {
        try {
            const data = await unPublishBlogById(id);
            if (data && data.status === "success") {
                ShowSuccessNotification(data)
                thunkAPI.dispatch(fetchAllPublicArticles({ page: 1, limit: 9 }));
                return data.data;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const likeArticle = createAsyncThunk(
    "blog/likeArticle",
    async (id, thunkAPI) => {
        try {
            const data = await likeBlogById(id);
            const user = thunkAPI.getState().auth.user;
            const userId = user?._id || user?.id;

            if (data && data.status === "success") {
                return {
                    blogId: data.data.blogId,
                    totalLikes: data.data.totalLikes,
                    userId,
                };
            }

            return thunkAPI.rejectWithValue(data?.message || "Failed to like blog");
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const unlikeArticle = createAsyncThunk(
    "blog/unlikeArticle",
    async (id, thunkAPI) => {
        try {
            const data = await unlikeBlogById(id);
            const user = thunkAPI.getState().auth.user;
            const userId = user?._id || user?.id;

            if (data && data.status === "success") {
                return {
                    blogId: data.data.blogId,
                    totalLikes: data.data.totalLikes,
                    userId,
                };
            }

            return thunkAPI.rejectWithValue(data?.message || "Failed to unlike blog");
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const applyLikeState = (blog, { blogId, userId, liked }) => {
    if (!blog || String(blog._id) !== String(blogId)) return blog;

    const likes = Array.isArray(blog.likes) ? [...blog.likes] : [];
    const hasLiked = likes.some((id) => String(id) === String(userId));

    if (liked && !hasLiked && userId) {
        likes.push(userId);
    }

    if (!liked && hasLiked) {
        return {
            ...blog,
            likes: likes.filter((id) => String(id) !== String(userId)),
        };
    }

    return { ...blog, likes };
};

const blogSlice = createSlice({
    name: "article",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Public Articles
            .addCase(fetchAllPublicArticles.pending, (state) => {
                state.isLoadingWhileFetchingArticles = true;
                state.error = null;
            })
            .addCase(fetchAllPublicArticles.fulfilled, (state, action) => {
                state.isLoadingWhileFetchingArticles = false;
                state.articles = action.payload.articles;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchAllPublicArticles.rejected, (state, action) => {
                state.isLoadingWhileFetchingArticles = false;
                state.error = action.payload;
            })

            // Fetch User Articles
            .addCase(fetchUserArticles.pending, (state) => {
                state.isLoadingWhileFetchingArticles = true;
                state.error = null;
            })
            .addCase(fetchUserArticles.fulfilled, (state, action) => {
                state.isLoadingWhileFetchingArticles = false;
                state.articles = action.payload.articles;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchUserArticles.rejected, (state, action) => {
                state.isLoadingWhileFetchingArticles = false;
                state.error = action.payload;
            })

            // Create Blog
            .addCase(createArticle.pending, (state) => {
                state.isLoadingWhileAdding = true;
                state.error = null;
            }
            )
            .addCase(createArticle.fulfilled, (state, action) => {
                state.isLoadingWhileAdding = false;
                state.articles.push(action.payload);
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.isLoadingWhileAdding = false;
                state.error = action.payload;
            })
            // Fetch Current Article
            .addCase(fetchCurrentArticle.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCurrentArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentArticle = action.payload;
            })
            .addCase(fetchCurrentArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch Article By Id
            .addCase(fetchArticleById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchArticleById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentArticle = action.payload;
            })
            .addCase(fetchArticleById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update Article
            .addCase(updateArticle.pending, (state) => {
                state.isLoadingWhileUpdating = true;
                state.error = null;
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.isLoadingWhileUpdating = false;
                state.currentArticle = action.payload;
                state.articles = state.articles.map((article) =>
                    article._id === action.payload?._id ? action.payload : article
                );
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.isLoadingWhileUpdating = false;
                state.error = action.payload;
            })
            // delete blog by id
            .addCase(deleteArticle.pending, (state) => {
                state.isLoadingWhileDeleting = true;
                state.error = null;
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.isLoadingWhileDeleting = false;

                // Remove the deleted blog
                state.articles = state.articles.filter(
                    (article) => article._id !== action.payload
                );
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.isLoadingWhileDeleting = false;
                state.error = action.payload;
            })
            // publish blog by id
            .addCase(publishArticle.pending, (state) => {
                state.isLoadingWhileUpdating = true;
                state.error = null;
            })
            .addCase(publishArticle.fulfilled, (state, action) => {
                state.isLoadingWhileUpdating = false;
                state.articles = state.articles.map((article) =>
                    article._id === action.payload._id ? action.payload : article
                );
            })
            .addCase(publishArticle.rejected, (state, action) => {
                state.isLoadingWhileUpdating = false;
                state.error = action.payload;
            })
            // unpublish blog by id
            .addCase(unpublishArticle.pending, (state) => {
                state.isLoadingWhileUpdating = true;
                state.error = null;
            })
            .addCase(unpublishArticle.fulfilled, (state, action) => {
                state.isLoadingWhileUpdating = false;
                state.articles = state.articles.map((article) =>
                    article._id === action.payload._id ? action.payload : article
                );
            })
            .addCase(unpublishArticle.rejected, (state, action) => {
                state.isLoadingWhileUpdating = false;
                state.error = action.payload;
            })
            // like blog
            .addCase(likeArticle.fulfilled, (state, action) => {
                const payload = { ...action.payload, liked: true };
                state.articles = state.articles.map((article) =>
                    applyLikeState(article, payload)
                );
                state.currentArticle = applyLikeState(
                    state.currentArticle,
                    payload
                );
            })
            // unlike blog
            .addCase(unlikeArticle.fulfilled, (state, action) => {
                const payload = { ...action.payload, liked: false };
                state.articles = state.articles.map((article) =>
                    applyLikeState(article, payload)
                );
                state.currentArticle = applyLikeState(
                    state.currentArticle,
                    payload
                );
            })

    }

})
export const { setFilters } = blogSlice.actions;
export default blogSlice.reducer;
