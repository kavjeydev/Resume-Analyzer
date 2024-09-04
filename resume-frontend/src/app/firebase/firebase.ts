// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useNavigate } from "react-router-dom";
import { redirect } from 'next/navigation'

import { getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User,
    setPersistence,
    browserSessionPersistence,
    browserLocalPersistence,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    AuthErrorCodes}
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

export function signInWithGoogle(persistent: boolean){
    if(persistent){
        signInWithGooglePersistent();
    }
    else{
        signInWithGoogleNonPersistent();
    }
  }

export function signInWithGooglePersistent() {
    setPersistence(auth, browserLocalPersistence).then(() => {
        return signInWithPopup(auth, new GoogleAuthProvider());
    })
}

export function signInWithGoogleNonPersistent() {
    setPersistence(auth, browserSessionPersistence).then(() => {
        return signInWithPopup(auth, new GoogleAuthProvider());
    })
}

export function signOut(){
    return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void){
    return onAuthStateChanged(auth, callback);
}

export function signInwithEmailPassword(email: string, password: string){
    return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        console.log(userCredential.user);
    })
    .catch((err) => {
        if (err.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
            alert("Account with these credentials does not exist.");
          } else if (err.code === AuthErrorCodes.INVALID_EMAIL){
            alert("Invalid Email.")
          }
          else {
            console.log(err.code);
            alert(err.code);
          }
    });
}


export function signUpwithEmailPassword(email: string, password: string){
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        console.log(userCredential.user);
        // ...
      })
      .catch((err) => {
        if (err.code === AuthErrorCodes.WEAK_PASSWORD) {
        alert("The password is too weak.");
      } else if (err.code === AuthErrorCodes.EMAIL_EXISTS) {
        alert("The email address is already in use.");
      } else {
        console.log(err.code);
        alert(err.code);
      }
      });
}