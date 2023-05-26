# pro-kriyam

A easy to use project management system built using React, and under the hood it uses Redmine

## Technologies Used

1. React.js
2. Vite.js
3. Redux-Toolkit
4. MUI

## Installation

1. Clone the repository: git clone [repository URL]
1. Navigate to the project directory: cd [project directory]
1. Install dependencies: npm install
1. Rename the [.env.example](.env.example) file to `.env.development` if you're working in a development environment, or `.env.production` if you're working in a production environment.
1. Open the renamed `.env` file and update the API endpoints with the appropriate values for your environment.

### Firebase setup

To integrate Firebase into your React project, follow these steps:

1.  Create a Firebase project:
    - Go to the Firebase Console and create a new project.
1.  Set up a Firebase web app:

    - In the Firebase project dashboard, click on "Add app" and select the web platform.
    - Register your app by providing a name for your web app.
    - Firebase will generate a configuration object with your app's credentials.
    - Copy the configuration object.

1.  Add the Firebase configuration to this project:

    - Rename the [firebase-messaging-sw.js.example](/public/firebase-messaging-sw.js.example) file to [firebase-messaging-sw.js](public/firebase-messaging-sw.js).
    - Open the renamed [firebase-messaging-sw.js](public/firebase-messaging-sw.js) file and update the configuration object.

    - Also rename the [firebase.js.example](/config/firebase.js.example) file to [firebase.js](/config/firebase.js).

    - Open the renamed [firebase-messaging-sw.js](public/firebase-messaging-sw.js) file and update the configuration object.

           ```javascript
           var firebaseConfig = {
             apiKey: "api-key",
             authDomain: "project-id.firebaseapp.com",
             projectId: "project-id",
             storageBucket: "project-id.appspot.com",
             messagingSenderId: "sender-id",
             appId: "app-id",
             measurementId: "G-measurement-id",
           }
           ```

### Firebase Cloud Messaging (FCM) Setup

To enable Firebase Cloud Messaging in your React project, follow these steps:

1. Set up Firebase:

   - If you haven't already, create a Firebase project in the Firebase Console.

   - Follow the previous instructions to set up a Firebase web app and obtain the necessary configuration values.

1. Enable Firebase Cloud Messaging:

   - In the Firebase project dashboard, go to the "Cloud Messaging" section.
   - Click on "Set up Firebase Cloud Messaging" and follow the instructions to enable FCM for your project.
   - Retrieve the Server Key or Legacy Server Key from the "Cloud Messaging" tab.

1. Copy web push certificate key & update the [.env](.env) file `VITE_PUSH_NOTIFICATION_CERT_KEY` value

### Build & Deploy

Use docker to build and deploy.

1. Run this command

   ```sh
   docker-compose --env-file .env.production up --build
   ```

## Components

### snackbar

You can pass title as header of the snackbar

```js
enqueueSnackbar("This is a message!", { title: "This is a title" /*...other_params*/ })
```

## Usage

1. Start the development server: npm start
1. Open the application in your browser at http://localhost:5173

## Contributing

Contributions are welcome! If you'd like to contribute to Pro Kriyam, please follow these steps:

1. Fork the repository
1. Create a new branch: git checkout -b my-new-branch
1. Make your changes and commit them: git commit -am 'Add some feature'
1. Push the changes to your branch: git push origin my-new-branch
1. Submit a pull request
