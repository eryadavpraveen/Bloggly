import endpoint from "../constants/endpoint";
import { ShowErrorNotification } from "../utils/ShowToastNotification";
import apiService from "./apiService";

export const fetchPublicProfile = async (username, { page = 1, limit = 9 } = {}) => {
    try {
        const endpointUrl = endpoint.FETCH_PUBLIC_PROFILE.replace(
            ":username",
            encodeURIComponent(username)
        );
        const response = await apiService.get(endpointUrl, {
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        ShowErrorNotification(error);
        throw error;
    }
};
