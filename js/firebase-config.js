// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyC2k8pfLN7GsHRjR0TjA7XWbv1gAu-Yy1Q",
  authDomain: "rash-premium.firebaseapp.com",
  projectId: "rash-premium",
  storageBucket: "rash-premium.firebasestorage.app",
  messagingSenderId: "707837381992",
  appId: "1:707837381992:web:da27c427cef2a0d0315add",
  measurementId: "G-EH6WNH9TPZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
