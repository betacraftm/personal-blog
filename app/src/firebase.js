/* eslint-disable no-undef */
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "personal-blog-7e367.firebaseapp.com",
  projectId: "personal-blog-7e367",
  storageBucket: "personal-blog-7e367.appspot.com",
  messagingSenderId: "133468867409",
  appId: "1:133468867409:web:2d8e7665a62d9326b82170",
};

export const app = initializeApp(firebaseConfig);
