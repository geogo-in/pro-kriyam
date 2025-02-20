import { createSlice } from "@reduxjs/toolkit";

if (!localStorage.getItem("user_last_app_theme")) {
  localStorage.setItem("user_last_app_theme", "light");
}

const initialState = {
  isLight: localStorage.getItem("user_last_app_theme") === "light",
}

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state, action) => {
      state.isLight = !state.isLight;
      localStorage.setItem("user_last_app_theme", state.isLight ? "light" : "dark");
    },
    setTheme: (state, action) => {
      state.isLight = action.payload;
      localStorage.setItem("user_last_app_theme", action.payload ? "light" : "dark");
    },
  }
})

export const { toggleTheme } = themeSlice.actions

export default themeSlice.reducer