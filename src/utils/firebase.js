// Import the functions you need from the SDKs you need
import { updateUserFCM } from "@redux/services/userApi"
import store from "@redux/store"
import firebaseConfig from "config/firebase"
import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
import { deleteToken, getMessaging, getToken, onMessage } from "firebase/messaging"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
export const analytics = getAnalytics(firebaseApp)
export const messaging = getMessaging(firebaseApp)

export const removeFirebaseToken = async () => await deleteToken(messaging)

export const onMessageListener = () =>
  new Promise(resolve => {
    onMessage(messaging, payload => {
      resolve(payload)
    })
  })

export const initializePushNotification = async user => {
  if (!user) return removeFirebaseToken()

  try {
    const firebase_key = await getToken(messaging, { vapidKey: import.meta.env.VITE_PUSH_NOTIFICATION_CERT_KEY })
    console.debug("current token for client: ", firebase_key)
    if (user.firebase_key !== firebase_key) await store.dispatch(updateUserFCM.initiate({ user_id: user.id, firebase_key }))

    onMessageListener()
      .then(payload => {
        enqueueSnackbar(payload.notification.body, { title: payload.notification.title })
        console.debug(payload)
      })
      .catch(err => console.error("push notification failed: ", err))
  } catch (error) {
    console.error("push notification failed: ", error)
  }
}
