import axios from "axios";
import endpoint from "../constants/endpoint";

// Do NOT statically import store / authSlice here — that creates a circular dependency:
// store → authSlice → authServices → apiService → store (TDZ: authReducer)

const axiosInstance = axios.create({
    baseURL: endpoint.BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 30000,
});

// Request interceptor to add the access token to the headers of each request
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("ACCESS_TOKEN");
        const isRefreshCall = config.url?.includes(endpoint.REFRESH_TOKEN);

        // ngrok browser warning bypass (only for ngrok URLs)
        if (config.baseURL?.includes("ngrok")) {
            config.headers["ngrok-skip-browser-warning"] = "1";
        }

        // Do not send expired access token on refresh
        if (accessToken && !isRefreshCall) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        // Let browser set multipart/form-data boundary
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        return config;
    },
    (error) => Promise.reject(error)
);



const isPublicAuthRequest = (url = "") =>
    [
        endpoint.LOGIN,
        endpoint.REGISTER,
        endpoint.FORGOT_PASSWORD,
        endpoint.RESET_PASSWORD,
    ].some((path) => url.includes(path));

// response interceptor to handle errors globally
// handle 401 Unauthorized error and refresh token logic here
axiosInstance.interceptors.response.use((response) => response,
    async (error) => {
        const originalRequest = error.config;

        // if we are getting 401 error and the request is not for refreshing token, then we will try to refresh the token
        const isRefreshCall = originalRequest.url?.includes(endpoint.REFRESH_TOKEN);

        // Public auth routes (login/register/forgot/reset) must not trigger session refresh / hard login redirect
        if (
            error.response?.status === 401 &&
            isPublicAuthRequest(originalRequest.url)
        ) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && isRefreshCall) {
            localStorage.removeItem("ACCESS_TOKEN");
            localStorage.removeItem("REFRESH_TOKEN");
            window.location.href = "/auth/login";
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("REFRESH_TOKEN");

            if (refreshToken) {
                try {
                    // Lazy import after modules are initialized — avoids circular TDZ crash
                    const { store } = await import("../utils/store");
                    const { refreshUserToken } = await import("../features/auth/authSlice");

                    const accessToken = await store
                        .dispatch(refreshUserToken())
                        .unwrap();

                    if (accessToken) {
                        // Token already saved inside the thunk
                        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                        return axiosInstance(originalRequest);
                    }

                    // Refresh returned empty — force logout path
                    localStorage.removeItem("ACCESS_TOKEN");
                    localStorage.removeItem("REFRESH_TOKEN");
                    window.location.href = "/auth/login";
                    return Promise.reject(error);
                } catch (refreshError) {
                    // Handle error when refreshing token
                    // remove token on failure
                    localStorage.removeItem("ACCESS_TOKEN");
                    localStorage.removeItem("REFRESH_TOKEN");
                    window.location.href = "/auth/login";
                    return Promise.reject(refreshError);
                }
            } else {
                window.location.href = "/auth/login"; // Redirect to login
                return Promise.reject(error);
            }
        } else {
            return Promise.reject(error);
        }

    }
)








export default axiosInstance;