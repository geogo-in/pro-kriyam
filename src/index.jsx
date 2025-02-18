import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import store from "@redux/store"
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider as ReduxProvider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./assets/styles/index.css"
import { initializeApp } from "./initializeApp"
new initializeApp()

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReduxProvider store={store}>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </LocalizationProvider>
  </ReduxProvider>
)
