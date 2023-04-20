import React from "react"
// import DateAdapter from "@mui/lab/AdapterMoment"
// import LocalizationProvider from "@mui/lab/LocalizationProvider"
import { Provider as ReduxProvider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import store from "@redux/store"
import { initializeApp } from "./initializeApp"
// import reportWebVitals from "./reportWebVitals"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import ReactDOM from "react-dom/client"
new initializeApp()

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReduxProvider store={store}>
    {/* <LocalizationProvider dateAdapter={DateAdapter}> */}

    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
    {/* </LocalizationProvider> */}
  </ReduxProvider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
