# pro-kriyam

A easy to use project management system built using React, and under the hood it uses Redmine

# setup

1. rename `.env.example` to `.env` ant update API endpoints

## Firebase setup

1. create firebase project & create a web app under project settings page
1. create Cloud Messaging > web push certificate & update `.env` file `VITE_PUSH_NOTIFICATION_CERT_KEY` value
1. rename `/public/firebase-messaging-sw.js.example` to `firebase-messaging-sw.js` and update firebaseConfig, which you will find on firebase > project settings > general > Your App section

# build & deploy

use docker to build and deploy

```sh
docker-compose --env-file .env.production up --build
```

# snackbar

You can pass title as header of the snackbar

```js
enqueueSnackbar("This is a message!", { variant: "success", title: "This is a title" })
```
