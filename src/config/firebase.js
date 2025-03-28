// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentSingleTabManager,
} from "firebase/firestore";

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";

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
  measurementId: "G-00THRFMLDL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize storage
const storage = getStorage(app);

// Initialize messaging
const messaging = getMessaging(app);

// Add the public key generated from the console here.


const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BLBENVKOKZwMkcoKdJsg07oMSpX9zsR4Ayup_-_c2aISRY-daOwJpQexUSv-oMX25DglKE7ZxqMiuYrV2KouaZU",
    });
    console.log("Token:", token);
  }
  
  // if (permission === 'granted') {
    //   const token = await getToken(messaging);
    //   console.log('Token:', token);
    // }
  };

// Handle incoming messages 
  onMessage(messaging, (payload) => {
  console.log("Received foreground message: ", payload);

  // Display an in-app notification
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || "/icons/icon-192x192.png", // Fallback icon
  };

  

  // Use a library like Toastify or a custom implementation to show in-app notifications
  // showInAppNotification(notificationTitle, notificationOptions.body);
  toast(notificationTitle, {autoClose: 5000, position: "top-right"}); // toastify notification
});


// Initialize authentication
const auth = getAuth(app);

// Set authentication persistence to LOCAL
// This keeps the user logged in even when the browser is closed
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Track authentication state in localStorage for offline access
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, store essential data in localStorage
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLoginTime: new Date().getTime(),
    };
    localStorage.setItem("authUser", JSON.stringify(userData));
  } else {
    // User is signed out, remove from localStorage
    localStorage.removeItem("authUser");
  }
});

// Initialize Firestore with persistence enabled and unlimited cache size
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    tabManager: persistentSingleTabManager(),
  }),
});

// Helper function to get current user even when offline
const getCurrentUser = () => {
  // Try to get from Firebase Auth first
  const firebaseUser = auth.currentUser;

  if (firebaseUser) {
    return firebaseUser;
  }

  // If offline, check localStorage
  const storedUser = localStorage.getItem("authUser");
  if (storedUser) {
    return JSON.parse(storedUser);
  }

  return null; // No user authenticated
};

// Helper function to check if the device is online
const isOnline = () => {
  return navigator.onLine;
};

// Listen for online/offline events
window.addEventListener("online", () => {
  console.log("App is online");
  // Could trigger sync operations here
});

window.addEventListener("offline", () => {
  console.log("App is offline");
  // Could show offline notification here
});

export {
  storage,
  db,
  ref,
  generateToken,
  uploadBytes,
  getDownloadURL,
  app,
  auth,
  getCurrentUser,
  isOnline,
};

// const analytics = getAnalytics(app);
