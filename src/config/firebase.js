// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZmKoRcY3VIupeHqrPLN3eyZwmsef9sHI",
  authDomain: "hallmate-93864.firebaseapp.com",
  projectId: "hallmate-93864",
  storageBucket: "hallmate-93864.firebasestorage.app",
  messagingSenderId: "941974705038",
  appId: "1:941974705038:web:75da5db8c6ddafd800cadf",
  measurementId: "G-00THRFMLDL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {app, auth}

// const analytics = getAnalytics(app);