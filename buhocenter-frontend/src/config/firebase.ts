import firebase from 'firebase';

const config = {
    apiKey: `${process.env.VUE_APP_BUHOCENTER_FIREBASE_API_KEY}`,
    authDomain: `${process.env.VUE_APP_BUHOCENTER_FIREBASE_AUTH_DOMAIN}`,
    databaseURL: `${process.env.VUE_APP_BUHOCENTER_FIREBASE_DB_URL}`,
    projectId: `${process.env.VUE_APP_BUHOCENTER_FIREBASE_PROJECT_ID}`,
    storageBucket: `${process.env.VUE_APP_BUHOCENTER_FIREBASE_STORAGE_BUCKET}`,
    messagingSenderId: `${process.env.VUE_APP_BUHOCENTER_FIREBASE_MS_ID}`,
    appId: `${process.env.VUE_APP_BUHOCENTER_FIREBASE_APP_ID}`,
    measurementId: `${process.env.VUE_APP_BUHOCENTER_FIREBASE_MEASUREMENT_ID}`,
};

firebase.initializeApp(config);

export default firebase;
