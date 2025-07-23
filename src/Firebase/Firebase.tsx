// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCU5T4lP00PT9LuUPqhenYOu3RfSSEcJCY",
  authDomain: "ecommerce-app-6bec2.firebaseapp.com",
  databaseURL: "https://ecommerce-app-6bec2-default-rtdb.firebaseio.com",
  projectId: "ecommerce-app-6bec2",
  storageBucket: "ecommerce-app-6bec2.appspot.com", // sửa lại .app thành .app**spot.com**
  messagingSenderId: "391281174364",
  appId: "1:391281174364:web:1f9c145888ef7a1f5cc399",
  measurementId: "G-GZ3GHHGV3J"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
