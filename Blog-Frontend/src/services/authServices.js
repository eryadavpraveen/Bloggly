import endpoint from "../constants/endpoint"
import { ShowErrorNotification, ShowSuccessNotification } from "../utils/ShowToastNotification"
import apiService from "./apiService"

export const login = async ({ email, password }) => {
    try {
        const response = await apiService.post(endpoint.LOGIN, {
            email,
            password,
        })
        const data = response.data
        if (data.status === "success") {
            ShowSuccessNotification(data)
        }

        return data;
    } catch (error) {

        ShowErrorNotification(error)
        throw error;

    }
}

export const register = async ({ username, email, password }) => {
    try {
        const response = await apiService.post(endpoint.REGISTER, {
            username,
            email,
            password,
        })
        const data = response.data
        if (data.status === "success") {
            ShowSuccessNotification(data)
        }

        return data;
    } catch (error) {
        ShowErrorNotification(error)
        throw error;

    }

}

export const fetchUserProfile = async () => {
    try {
        const response = await apiService.get(
            endpoint.FETCH_USER_PROFILE,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
                },
            }
        );

        const data = response.data
        // if (data.status === "success") {
        //     ShowSuccessNotification(data)
        // }

        return data;
    } catch (error) {
        ShowErrorNotification(error)
        throw error;

    }

}

// refresh access token
export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await apiService.post(endpoint.REFRESH_TOKEN, {
            refreshToken,
        });
        return response.data;
    } catch (error) {
        // No toast — interceptor already redirects on failure
        throw error;
    }
};

// logout user
export const logout = async (refreshToken) => {
    try {
        const response = await apiService.post(endpoint.LOGOUT, {
            refreshToken,
        });

        const data = response.data;
        if (data.status === "success") {
            ShowSuccessNotification(data);
        }
        return data;
    } catch (error) {
        ShowErrorNotification(error);
        throw error;
    } finally {
        // Remove tokens from local storage if refresh token fails
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("REFRESH_TOKEN");
    }
};

// Forgot Password
export const forgotPassword = async ({ email }) => {
    try {
        const response = await apiService.post(endpoint.FORGOT_PASSWORD, {
            email,
        });

        const data = response.data;

        if (data.status === "success") {
            ShowSuccessNotification(data);
            return data;
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Reset Password
export const resetPassword = async ({ token, newPassword }) => {
    try {
        const response = await apiService.post(endpoint.RESET_PASSWORD, {
            token,
            newPassword,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

// Change Password (authenticated)
export const changePassword = async ({ oldPassword, newPassword }) => {
    try {
        const response = await apiService.post(endpoint.CHANGE_PASSWORD, {
            oldPassword,
            newPassword,
        });

        const data = response.data;

        if (data.status === "success") {
            ShowSuccessNotification(data);
        }

        return data;
    } catch (error) {
        throw error;
    }
};