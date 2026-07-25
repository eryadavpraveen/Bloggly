import endpoint from "../constants/endpoint"
import { ShowErrorNotification } from "../utils/ShowToastNotification"
import apiService from "./apiService"

export const fetchAllComments = async ({ blogId, page = 1, limit = 5 }) => {
    try {
        const response = await apiService.get(
            endpoint.FETCH_ALL_COMMENTS.replace(":blogId", blogId),
            {
                params: {
                    page,
                    limit,
                },
            }
        );
        const data = response.data;
        return data;
    } catch (error) {
        ShowErrorNotification(error);
        throw error;
    }
};


export const createComment = async ({ blogId, content }) => {
    try {
        const response = await apiService.post(
            endpoint.CREATE_COMMENT.replace(":blogId", blogId),
            { content }
        );
        return response.data;
    } catch (error) {
        ShowErrorNotification(error);
        throw error;
    }
};

export const deleteComment = async ({ commentId }) => {
    try {
        const response = await apiService.delete(
            endpoint.DELETE_COMMENT.replace(":commentId", commentId)
        );
        return response.data;
    } catch (error) {
        ShowErrorNotification(error);
        throw error;
    }
};

export const updateComment = async ({ commentId, content }) => {
    try {
        const response = await apiService.put(
            endpoint.UPDATE_COMMENT.replace(":commentId", commentId),
            { content }
        );
        return response.data;
    } catch (error) {
        ShowErrorNotification(error);
        throw error;
    }
};