import { createSlice } from "@reduxjs/toolkit"
import { login, register, fetchUserProfile, refreshAccessToken, logout } from "@/src/services/authServices"
import { createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
    isAuthenticated: localStorage.getItem("ACCESS_TOKEN") ? true : false,
    user: null,
    isLoading: false,
    error: null
}


export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ Credentials, navigate }, thunkAPI) => {
        try {
            const data = await login({
                email: Credentials.email,
                password: Credentials.password,
            })
            if (data && data.status === "success") {
                const tokenData = data.data;
                localStorage.setItem("ACCESS_TOKEN", tokenData.accessToken);
                localStorage.setItem("REFRESH_TOKEN", tokenData.refreshToken);

                navigate("/dashboard")
                return data;
            }

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error.message || "Login Failed"
            );

        }
    }
)


export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async ({ Credentials, navigate }, thunkAPI) => {
        try {
            const data = await register({
                username: Credentials.username,
                email: Credentials.email,
                password: Credentials.password,
            })

            if (data && data.status === "success") {
                navigate("/auth/login")
                return data;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );

        }
    }
)

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, thunkAPI) => {
        try {
            const refreshToken = localStorage.getItem("REFRESH_TOKEN");
            if (!refreshToken) {
                return thunkAPI.rejectWithValue("No refresh token found");
            }
            await logout(refreshToken);
            return true;
        } catch (error) {
            return thunkAPI.rejectWithValue("Logout Failed");

        }
    }
)

export const refreshUserToken = createAsyncThunk(
    "auth/refreshUserToken",
    async (_, thunkAPI) => {
        try {
            const refreshToken = localStorage.getItem("REFRESH_TOKEN");
            if (!refreshToken) {
                return thunkAPI.rejectWithValue("No refresh token found");
            }
            const response = await refreshAccessToken(refreshToken);

            if (response && response.status === "success" && response.data.accessToken) {
                localStorage.setItem("ACCESS_TOKEN", response.data.accessToken);
                if (response.data.refreshToken) {
                    localStorage.setItem("REFRESH_TOKEN", response.data.refreshToken);
                }
                return response.data.accessToken;
            } else {
                return thunkAPI.rejectWithValue("Token refresh failed");
            }


        } catch (error) {
            // remove token on failure
            localStorage.removeItem("ACCESS_TOKEN");
            localStorage.removeItem("REFRESH_TOKEN");

            return thunkAPI.rejectWithValue("Token refresh failed");

        }
    }
)

export const fetchLoggedUser = createAsyncThunk(
    "auth/fetchLoggedUser",
    async (_, thunkAPI) => {
        try {
            const data = await fetchUserProfile();

            if (data && data.status === "success") {

                return data.data;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );

        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;

                if (!action.payload) return;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            })
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })


            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // fetch logged user
            .addCase(fetchLoggedUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLoggedUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(fetchLoggedUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // refresh access token case
            .addCase(refreshUserToken.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(refreshUserToken.fulfilled, (state) => {
                state.isLoading = false;
                // ACCESS_TOKEN already saved in the thunk; payload is a string, not { accessToken }
                state.isAuthenticated = true;
                // do NOT set state.user = action.payload (that would be the JWT string)
            })
            .addCase(refreshUserToken.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
            });
    }

})

export default authSlice.reducer;