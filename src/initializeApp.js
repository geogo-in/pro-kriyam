import { authUserForToken, unauthUser } from "@redux/reducerSlices/user/userAuthSlice"
import store from "@redux/store"
import axios from "axios"
import { initializePushNotification } from "utils/firebase"
import { API_ENDPOINT } from "./config/constants"

export class initializeApp {
  token //: string
  constructor() {
    this.token = localStorage.getItem("token")
    this.initializeAxios()
    this.checkAuth()
  }

  async checkAuth() {
    if (this.token) {
      const user = await store.dispatch(authUserForToken(this.token)).unwrap()
      initializePushNotification(user)
    } else {
      store.dispatch(unauthUser())
    }
  }
  initializeAxios() {
    axios.defaults.baseURL = API_ENDPOINT
  }
}
