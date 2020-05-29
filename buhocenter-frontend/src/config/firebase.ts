import firebase from "firebase";

const config = {
    apiKey: "AIzaSyDAF-RBZ8PwnxOaYIaPV4s9Z7eqVPOFyNM",
    authDomain: "buhocenter.firebaseapp.com",
    databaseURL: "https://buhocenter.firebaseio.com",
    projectId: "buhocenter",
    storageBucket: "buhocenter.appspot.com",
    messagingSenderId: "205448199268",
    appId: "1:205448199268:web:5f12aa31eedf3694fa7371",
    measurementId: "G-4F0Q6HBPSE"
};

firebase.initializeApp(config);

export default firebase;
