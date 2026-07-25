export default {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",

    // Auth Endpoints
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FETCH_USER_PROFILE: "/auth/profile",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",


    // Blog Endpoint
    FETCH_ALL_ARTICLES: "/blogs",
    FETCH_USER_ARTICLES: "/blogs/user",
    CREATE_ARTICLE: "/blogs",
    UPDATE_ARTICLE: "/blogs/:BlogId",
    DELETE_ARTICLE: "/blogs/:BlogId",
    FETCH_ARTICLE_BY_SLUG: "/blogs/:slug",
    FETCH_ARTICLE_BY_ID: "/blogs/id/:BlogId",
    PUBLISH_ARTICLE: "/blogs/publish/",
    UNPUBLISH_ARTICLE: "/blogs/unpublish/",
    LIKE_ARTICLE: "/blogs/like/:id",
    UNLIKE_ARTICLE: "/blogs/unlike/:id",




    // Comment Endpoint
    FETCH_ALL_COMMENTS: "/comments/:blogId",
    CREATE_COMMENT: "/comments/:blogId",
    UPDATE_COMMENT: "/comments/:commentId",
    DELETE_COMMENT: "/comments/:commentId",

    // User / public profile
    FETCH_PUBLIC_PROFILE: "/users/:username",
}