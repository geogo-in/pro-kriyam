import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import themeSlice from "./reducerSlices/theme/themeSlice"
import projectUiSlice from "./reducerSlices/ui/projectUiSlice"
import userAuthSlice from "./reducerSlices/user/userAuthSlice"
import { redmineApi } from "./services/redmineApi"

const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [redmineApi.reducerPath]: redmineApi.reducer,
    currentUser: userAuthSlice,
    projectUi: projectUiSlice,
    theme: themeSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(redmineApi.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

export default store
