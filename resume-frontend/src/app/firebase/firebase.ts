// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useNavigate } from "react-router-dom";
import { redirect } from 'next/navigation'

import { getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User }
    from "firebase/auth"
import { getFunctions } from "firebase/functions";
import { useState } from "react";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBYxcy6FILx2V0HZ5rTHbep_v1HW2BH8Sk",
    authDomain: "quixotic-resume-analyzer.firebaseapp.com",
    projectId: "quixotic-resume-analyzer",
    storageBucket: "quixotic-resume-analyzer.appspot.com",
    messagingSenderId: "228127350714",
    appId: "1:228127350714:web:02935c11c3d0d212520783",
    measurementId: "G-NGHY2SW4TW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const functions = getFunctions();

// const analytics = getAnalytics(app);

const auth = getAuth(app);

export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut(){
    return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void){
    return onAuthStateChanged(auth, callback);
}