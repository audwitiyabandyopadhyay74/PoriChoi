"use client"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// import { useState } from "react";
// import { getPerformance } from "firebase/performance";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBhO91KP6Lu0nTEJBo7UTBr3X79cNJe4zQ",
    authDomain: "porichoi-9112d.firebaseapp.com",
    projectId: "porichoi-9112d",
    storageBucket: "porichoi-9112d.appspot.com",
    messagingSenderId: "702456184757",
    appId: "1:702456184757:web:4881a1e59f939069d4a3fc",
    measurementId: "G-KDX944BM03"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
// const perf = getPerformance(app);



export { auth, storage, firestore, app };