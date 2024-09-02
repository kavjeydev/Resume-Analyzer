'use client'
import styles from "./page.module.css"
import Image from "next/image"
import Link from "next/link";
import { useEffect } from "react";
import Footer from "../footer/footer";

export default function Signin() {
  useEffect(()=>{
    window.scrollTo(0,0);
  },[])

  return (

    <div className={styles.outer_div}>
      <h1 className={styles.header_one}>Welcome back!</h1>
      <div className={styles.closer_links}>
        <Link href="/" className={styles.signin_google }>
          <Image width={32} height={32} className={styles.logo} src="/google.png" alt="Google Logo"/>
          <h1 className={styles.header_three}>Sign in with Google</h1>
        </Link>
        <h1 className={styles.sign_email}>
        ─────── &nbsp; Or sign in with your email &nbsp; ───────
        </h1>

        <form className={styles.outer_form}>
          <label>Email</label>
          <input type="text" name="email" placeholder="example@email.com" className={styles.typing_field}/>
        </form>
        <form className={styles.outer_form}>
          <label>Password</label>
          <input type="password" name="password" placeholder="*********" className={styles.typing_field}/>
        </form>

        <div className={styles.final_container}>
          <div className={styles.checkbox}>
            <input type="checkbox" name="stay_signed_in" className={styles.checkbox_input}/>
            <label>Keep me signed in</label>
          </div>
          <Link href="/passwordreset" className={styles.question}>Forgot password?</Link>
        </div>
        <button className={styles.submit} type="submit">Sign In</button>

        <div className={styles.no_account}>
          <h1 className={styles.question}>Don't have an account?</h1>
          <Link href='/signup' className={styles.action}>Sign Up</Link>
        </div>
      </div>


    </div>
  );
}
