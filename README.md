# pro-kriyam

A easy to use project management system built using React, and under the hood it uses Redmine

# setup

1. Rename [.env.example](.env.example) to `.env.development`/`.env.production` and update API endpoints

## Firebase setup

1. Create firebase project & create a web app under project settings page
1. Create Cloud Messaging > web push certificate & update [.env](.env) file `VITE_PUSH_NOTIFICATION_CERT_KEY=` value
1. Rename [firebase-messaging-sw.js.example](/public/firebase-messaging-sw.js.example) to [firebase-messaging-sw.js](public/firebase-messaging-sw.js) and update `firebaseConfig` as shown below., which you will find on firebase > project settings > general > Your App section

```
const firebaseConfig = {
  apiKey: 'apiKey',
  authDomain: 'authDomain',
  projectId: 'projectId',
  storageBucket: 'storageBucket',
  messagingSenderId: 'messagingSenderId',
  appId: 'appId'
}
```

# Build & Deploy

Use docker to build and deploy, run

```sh
docker-compose --env-file .env.production up --build
```

# Components

## snackbar

You can pass title as header of the snackbar

```js
enqueueSnackbar("This is a message!", { title: "This is a title" /*...other_params*/ })
```
