'use client'

import styles from "./page.module.css"
import Image from "next/image"
import Link from "next/link";
import { useState } from "react";
import { signInWithGoogleNonPersistent, signUpwithEmailPassword } from "../firebase/firebase";

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function quixoticUserSignUp(){
    console.log(email, password);
    if(password != confirmPassword){
      alert("Passwords must match");
    }
    else{
      signUpwithEmailPassword(email, password)
    }

  }

  return (

    <div className={styles.outer_div}>
      <h1 className={styles.header_one}>Your journey to career success starts here!</h1>
      <div className={styles.closer_links}>
        <Link href="/" className={styles.signin_google } onClick={signInWithGoogleNonPersistent}>
          <Image width={32} height={32} className={styles.logo} src="/google.png" alt="Google Logo"/>
          <h1 className={styles.header_three}>Sign up with Google</h1>
        </Link>
        <h1 className={styles.sign_email}>
        ─────── &nbsp; Or sign up with your email &nbsp; ───────
        </h1>

        <form className={styles.outer_form}>
          <label>Email</label>
          <input type="text" name="email" placeholder="example@email.com" className={styles.typing_field} onChange={e => { setEmail(e.currentTarget.value); }}/>
        </form>
        <form className={styles.outer_form}>
          <label>Password</label>
          <input type="password" name="password" placeholder="Password (at least 8 characters)" className={styles.typing_field} onChange={e => { setPassword(e.currentTarget.value); }}/>
        </form>
        <form className={styles.outer_form}>
          <label>Confirm password</label>
          <input type="password" name="password" placeholder="*********" className={styles.typing_field} onChange={e => { setConfirmPassword(e.currentTarget.value); }}/>
        </form>
        <button className={styles.submit} type="submit" onClick={quixoticUserSignUp}>Sign Up</button>

        <div className={styles.no_account}>
          <h1 className={styles.question}>Already have an account?</h1>
          <Link href='/signin' className={styles.action}>Sign In</Link>
        </div>
      </div>



    </div>
  );
}
