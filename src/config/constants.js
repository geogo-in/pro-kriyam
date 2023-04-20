// Place global constants here, Ex. API endpoint base URL, or some secret key etc.
const prod = import.meta.env.MODE === "production"
export const API_ENDPOINT = prod ? window._env_.PRODUCTION_API_ENDPOINT : import.meta.env.VITE_DEVELOPMENT_ENDPOINT
export const BASE_URL = prod ? window._env_.PRODUCTION_URL : "http://localhost:3000"
export const RESET_PASSWORD_URL = `${BASE_URL}/users/reset_password`
export const DEFAULT_SPRINT_DETAILS = { name: `New Sprint`, description: "This is the new sprint description.", goals: "This is the new sprint goals." }
export const EPIC_COLORS = ["#ef5350", "#e91e63", "#9c27b0", "#5c6bc0", "#2196f3", "#0097a7", "#43a047", "#607d8b", "#651fff", "#795548"]
export const ISSUE_STATUS_COLORS = ["#ffeb3b", "#b3e5fc", "#f8bbd0", "#a7ffeb", "#ffe0b2", "#c6ff00", "#D8B4FE"]
export const DEFAULT_ERROR_MSG = "Something went wrong!."

export const NEW_ISSUE_PRIORITY = "new"
export const NEW_ISSUE_TRACKER = "feature"
