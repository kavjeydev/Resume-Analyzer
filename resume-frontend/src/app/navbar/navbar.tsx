import Link from "next/link";
import Image from "next/image"
import styles from "./navbar.module.css"

export default function Navbar(){
    return(
        <div className={styles.nav_container}>
            <nav className={styles.resume_navbar}>
                <div className={styles.left_side}>
                    <div className={styles.logo_cont}>
                        <Link href="/">
                            <Image width={150} height={50} className={styles.logo} src="/new_logo.png" alt="Quixotic Logo"/>
                        </Link>
                    </div>

                    <div className={styles.small_links_cont}>
                        <Link href="https://www.github.com/kavjeydev" className={styles.small_button} target="_blank">
                            Github ⭐
                        </Link>
                        <Link href="/faq" className={styles.small_button}>
                            FAQ
                        </Link>
                    </div>

                </div>

                <div className={styles.right_side}>
                    <Link href="/signin" className={styles.signin_button}>
                        Sign In
                    </Link>
                    <Link href="/signup" className={styles.signup_button}>
                        Sign Up
                    </Link>
                </div>
            </nav>
        </div>
    )
}