import styles from "./page.module.css"
import Image from "next/image"
import Link from "next/link";

export default function Signin() {

  return (

    <div className={styles.outer_div}>
      <h1 className={styles.header_one}>Your journey to career success starts here!</h1>
      <div className={styles.closer_links}>
        <Link href="/" className={styles.signin_google }>
          <Image width={32} height={32} className={styles.logo} src="/google.png" alt="Google Logo"/>
          <h1 className={styles.header_three}>Sign up with Google</h1>
        </Link>
        <h1 className={styles.sign_email}>
        ─────── &nbsp; Or sign up with your email &nbsp; ───────
        </h1>

        <form className={styles.outer_form}>
          <label>Full Name</label>
          <input type="text" name="email" placeholder="example@email.com" className={styles.typing_field}/>
        </form>
        <form className={styles.outer_form}>
          <label>Password</label>
          <input type="password" name="password" placeholder="Password (at least 8 characters)" className={styles.typing_field}/>
        </form>
        <form className={styles.outer_form}>
          <label>Confirm password</label>
          <input type="password" name="password" placeholder="*********" className={styles.typing_field}/>
        </form>
        <button className={styles.submit} type="submit">Sign Up</button>

        <div className={styles.no_account}>
          <h1 className={styles.question}>Already have an account?</h1>
          <Link href='/signin' className={styles.action}>Sign In</Link>
        </div>
      </div>



    </div>
  );
}
