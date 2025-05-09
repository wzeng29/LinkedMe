// Import Firebase core and necessary services
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from './firebase.js'; // or wherever your Firebase config is
// Firebase configuration (your credentials)
const firebaseConfig = {
  apiKey: "AIzaSyDu4DBPq6ugvzTtZDMxEU64e9uxTqpgfKI",
  authDomain: "linkedme-ead28.firebaseapp.com",
  projectId: "linkedme-ead28",
  storageBucket: "linkedme-ead28.firebasestorage.app",
  messagingSenderId: "815313661905",
  appId: "1:815313661905:web:ca9a3fb461d79398eebaf0",
  measurementId: "G-YSW3RBMMEK"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export for use in other modules
export { app, db, storage, analytics };
