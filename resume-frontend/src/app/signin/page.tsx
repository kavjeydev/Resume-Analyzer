'use client'
import styles from "./page.module.css"
import Image from "next/image"
import Link from "next/link";
import { useEffect, useState } from "react";


import { onAuthStateChangedHelper,
  signInwithEmailPassword,
  signInWithGoogle, signInWithGoogleNonPersistent,
  signInWithGooglePersistent } from "../firebase/firebase";
  import { useRouter } from 'next/navigation'


export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  var staySignedIn = false;

  function reverseSignedIn(){

    staySignedIn = !staySignedIn;
    console.log(staySignedIn);
    return staySignedIn;
  }

  function signInWithGoogleProper(){


    signInWithGoogle(staySignedIn)

  }


  function quixoticUserSignIn(){
    console.log(email, password)
    signInwithEmailPassword(email, password);
  }



  useEffect(()=>{
    window.scrollTo(0,0);
  },[])



  return (

    <div className={styles.outer_div}>
      <h1 className={styles.header_one}>Welcome back!</h1>
      <div className={styles.closer_links}>
            <button className={styles.signin_google } onClick={signInWithGoogleProper}>
              <Image width={32} height={32} className={styles.logo} src="/google.png" alt="Google Logo"/>
              <h1 className={styles.header_three}>Sign in with Google</h1>
            </button>


        <h1 className={styles.sign_email}>
        ─────── &nbsp; Or sign in with your email &nbsp; ───────
        </h1>

        <form className={styles.outer_form}>
          <label>Email</label>
          <input type="email" name="email" placeholder="example@email.com" className={styles.typing_field} required onChange={e => { setEmail(e.currentTarget.value); }}/>
        </form>
        <form className={styles.outer_form}>
          <label>Password</label>
          <input type="password" name="password" placeholder="*********" className={styles.typing_field} required onChange={e => { setPassword(e.currentTarget.value); }}/>
        </form>

        <div className={styles.final_container}>
          <div className={styles.checkbox}>
            <input type="checkbox" name="stay_signed_in" className={styles.checkbox_input} onClick={reverseSignedIn}/>
            <label>Keep me signed in</label>
          </div>
          <Link href="/passwordreset" className={styles.question}>Forgot password?</Link>
        </div>
        <button className={styles.submit} type="submit" onClick={quixoticUserSignIn}>Sign In</button>

        <div className={styles.no_account}>
          <h1 className={styles.question}>Don't have an account?</h1>
          <Link href='/signup' className={styles.action}>Sign Up</Link>
        </div>
      </div>


    </div>
  );
}
