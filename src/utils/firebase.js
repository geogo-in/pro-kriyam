// Import the functions you need from the SDKs you need
import firebaseConfig from "config/firebase"
import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
import { getMessaging, getToken, onMessage } from "firebase/messaging"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
export const analytics = getAnalytics(firebaseApp)
export const messaging = getMessaging(firebaseApp)

export const getFirebaseToken = setTokenFound => {
  return getToken(messaging, { vapidKey: import.meta.env.VITE_PUSH_NOTIFICATION_CERT_KEY })
    .then(currentToken => {
      if (currentToken) {
        console.debug("current token for client: ", currentToken)
        setTokenFound(true)
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.debug("No registration token available. Request permission to generate one.")
        setTokenFound(false)
        // shows on the UI that permission is required
      }
    })
    .catch(err => {
      console.error("An error occurred while retrieving token. ", err)
      // catch error while creating client token
    })
}

export const onMessageListener = () =>
  new Promise(resolve => {
    onMessage(messaging, payload => {
      resolve(payload)
    })
  })
