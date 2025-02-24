import { redmineApi } from "@redux/services/redmineApi"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { removeFirebaseToken } from "utils/firebase"
import { login } from "../../services/userApi"

// authUserForToken
export const authUserForToken = createAsyncThunk("user/authUserForToken", async (token, { rejectWithValue }) => {
  try {
    const response = await axios.get("/my/account.json", { headers: { "X-Redmine-API-Key": token } })
    return response.data.user
  } catch (error) {
    const errorObj = Object.assign({}, error)
    const errorMessage = errorObj.response?.status === 401 ? "Invalid login credentials" : errorObj.response?.data
    return rejectWithValue(errorMessage)
  }
})

// Unauth user
export const unauthUser = createAsyncThunk("user/unauthUser", async (_, { dispatch }) => {
  console.debug("un auth user...")
  // localStorage.clear()
  const userTheme = localStorage.getItem("user_last_app_theme");
  localStorage.clear();
  if (userTheme) {
    localStorage.setItem("user_last_app_theme", userTheme);
  }
  dispatch(redmineApi.util.resetApiState())
  removeFirebaseToken()
})

const userAuthSlice = createSlice({
  name: "authUser",
  initialState: {
    authenticated: false,
    token: null,
    info: null,
    isLoading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(authUserForToken.pending, (state, action) => {
        state.isLoading = true
        state.authenticated = true
      })
      .addCase(authUserForToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.authenticated = true
        state.info = action.payload
        state.token = action.payload.api_key
      })
      .addCase(authUserForToken.rejected, (state, action) => {
        state.isLoading = false
        state.authenticated = false
        state.info = null
        state.token = null
        state.error = action.payload
      })
      .addCase(unauthUser.fulfilled, (state, action) => {
        state.authenticated = false
        state.info = null
        state.token = null
      })
      .addMatcher(login.matchFulfilled, (state, action) => {
        state.isLoading = false
        state.error = null
        state.authenticated = true
        state.info = action.payload
        state.token = action.payload.api_key
      })
      .addMatcher(login.matchRejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

// Exporting data for selectors
export const isAuthenticated = state => state.currentUser.authenticated
export const getCurrentUser = state => state.currentUser.info
export const getCurrentUserKey = state => state.currentUser.token
export const isLoading = state => state.currentUser.isLoading
export const isAdmin = state => state.currentUser.info?.admin

export default userAuthSlice.reducer
