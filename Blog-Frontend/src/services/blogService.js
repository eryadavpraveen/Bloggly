import endpoint from "../constants/endpoint"
import { ShowErrorNotification, ShowSuccessNotification } from "../utils/ShowToastNotification"
import apiService from "./apiService"

export const fetchAllPublicBlogs = async ({ page, limit, searchQuery, sortBy }) => {
    try {
        // const url = `${endpoint.FETCH_ALL_ARTICLES}?page=${page}&limit=${limit}`;
        // const response = await apiService.get(url);
        // or
        const response = await apiService.get(endpoint.FETCH_ALL_ARTICLES, {
            params: {
                page: page,
                limit: limit,
                searchQuery: searchQuery,
                sortBy: sortBy
            }
        });
        const data = response.data;
        return data;
    } catch (error) {
        ShowErrorNotification(error);
        throw error;
    }
};

export const fetchUserBlogs = async ({ page, limit, searchQuery, status, sortBy }) => {
    try {
        const response = await apiService.get(endpoint.FETCH_USER_ARTICLES, {
            params: {
                page,
                limit,
                searchQuery,
                status,
                sortBy,
            },
        });
        const data = response.data;
        return data;
    } catch (error) {
        ShowErrorNotification(error);
        throw error;
    }
};


export const createBlog = async (jsonData) => {
    try {
        const formData = new FormData();
        formData.append("title", jsonData.title);
        formData.append("shortDescription", jsonData.shortDescription);
        formData.append("content", jsonData.content);
        formData.append("tags", JSON.stringify(jsonData.tags));
        formData.append("status", jsonData.status);

        if (jsonData.image) {
            formData.append("image", jsonData.image);
        }

        const response = await apiService.post(endpoint.CREATE_ARTICLE, formData);

        const data = response.data;
        return data;
    } catch (error) {
        ShowErrorNotification(error);
        throw error;
    }
};

export const fetchBlogBySlug = async (slug) => {
    try {
        //     FETCH_ARTICLE_BY_SLUG: "/blogs/:slug",
        const endpointUrl = endpoint.FETCH_ARTICLE_BY_SLUG.replace(":slug", slug);
        const response = await apiService.get(endpointUrl);
        const data = response.data;
        return data;
    } catch (error) {
        ShowErrorNotification(error);
        throw error;
    }
};


export const deleteBlogById = async (id) => {
    try {
        const endpointUrl = endpoint.DELETE_ARTICLE.replace(":BlogId", id);
        const response = await apiService.delete(endpointUrl);
        const data = response.data;
        return data;
    } catch (error) {
        throw error;
    }
}

export const publishBlogById = async (id) => {
    try {
        const endpointUrl = await apiService.post(endpoint.PUBLISH_ARTICLE, { blogId: id });
        const data = endpointUrl.data;
        return data;
    }
    catch (error) {
        ShowErrorNotification(error);
        throw error;
    }
}

export const unPublishBlogById = async (id) => {
    try {
        const endpointUrl = await apiService.post(endpoint.UNPUBLISH_ARTICLE, { blogId: id });
        const data = endpointUrl.data;
        return data;
    }
    catch (error) {
        ShowErrorNotification(error);
        throw error;
    }
}

export const updateBlogById = async (id, jsonData) => {
    try {
        const formData = new FormData();
        formData.append("title", jsonData.title);
        formData.append("shortDescription", jsonData.shortDescription);
        formData.append("content", jsonData.content);
        formData.append("tags", JSON.stringify(jsonData.tags));

        if (jsonData.image) {
            formData.append("image", jsonData.image);
        }

        const response = await apiService.put(
            endpoint.UPDATE_ARTICLE.replace(":BlogId", id),
            formData
        );
        const data = response.data;
        return data;
    } catch (error) {
        ShowErrorNotification(error);
        throw error;
    }
};

export const fetchBlogById = async (id) => {
    try {
        const response = await apiService.get(
            endpoint.FETCH_ARTICLE_BY_ID.replace(":BlogId", id)
        );
        const data = response.data;
        return data;
    } catch (error) {
        ShowErrorNotification(error);
        throw error;
    }
};

export const likeBlogById = async (id) => {
    try {
        const endpointUrl = endpoint.LIKE_ARTICLE.replace(":id", id);
        const response = await apiService.patch(endpointUrl);
        const data = response.data;
        return data;
    } catch (error) {
        throw error;
    }
};

export const unlikeBlogById = async (id) => {
    try {
        const endpointUrl = endpoint.UNLIKE_ARTICLE.replace(":id", id);
        const response = await apiService.patch(endpointUrl);
        const data = response.data;
        return data;
    } catch (error) {
        throw error;
    }
};
