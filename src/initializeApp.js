import { authUserForToken, unauthUser } from "@redux/reducerSlices/user/userAuthSlice"
import store from "@redux/store"
import axios from "axios"
import { getFirebaseToken, onMessageListener } from "config/firebase"
import { enqueueSnackbar } from "notistack"
import { API_ENDPOINT } from "./config/constants"

export class initializeApp {
  token //: string
  constructor() {
    this.token = localStorage.getItem("token")
    this.initializeAxios()
    this.checkAuth()
    this.initializePushNotification()
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

  initializePushNotification() {
    getFirebaseToken(token => {
      // store.dispatch(updateFCMToken())
    })

    onMessageListener()
      .then(payload => {
        enqueueSnackbar(payload.notification.body, { title: payload.notification.title })
        console.debug(payload)
      })
      .catch(err => console.error("push notification failed: ", err))
  }
}
