import { authUserForToken, unauthUser } from "@redux/reducerSlices/user/userAuthSlice"
import store from "@redux/store"
import axios from "axios"
import { API_ENDPOINT } from "./config/constants"

export class initializeApp {
  token //: string
  constructor() {
    this.token = localStorage.getItem("token")
    this.initializeAxios()
    this.checkAuth()
  }

  checkAuth() {
    if (this.token) {
      store.dispatch(authUserForToken(this.token)).unwrap()
    } else {
      store.dispatch(unauthUser())
    }
  }
  initializeAxios() {
    axios.defaults.baseURL = API_ENDPOINT
  }
}
