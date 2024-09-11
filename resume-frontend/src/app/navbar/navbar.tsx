'use client'
import Link from "next/link";
import Image from "next/image"
import styles from "./navbar.module.css"
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { signOut } from "../firebase/firebase";

import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useRouter } from 'next/navigation'




var user_info: User | null = null;

export {user_info}

export default function Navbar(){

    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();


    const [validEmail, setValidEmail] = useState(false);

    function signOutRedirect(){
        router.push('/');
        signOut();

    }

    // useEffect(() => {
    const authHelper = onAuthStateChangedHelper((user) => {

        setUser(user);
        user_info = user;
        if(user?.email && validEmail == false){
            router.push('/analyze');
            setValidEmail(true);

        }
        else if(!user?.email && validEmail == true){
            router.push('/');

            setValidEmail(false);
        }

    })

    //     return () => authHelper();
    // })

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
                        <Link href="https://github.com/kavjeydev/Resume-Analyzer" className={styles.small_button} target="_blank">
                            Github
                        </Link>
                        <Link href="/faq" className={styles.small_button}>
                            FAQ
                        </Link>
                        {validEmail ? (
                            <Link href="/analyze" className={styles.small_button}>
                            Analyze ⭐
                            </Link>
                        ) : (
                            <h1 className={styles.disabled}>Analyze</h1>
                        )}

                    </div>

                </div>

                <div className={styles.right_side}>
                        {!validEmail ? (
                            <><Link href="/signin" className={styles.signin_button}>
                            Sign In
                            </Link>
                            <Link href="/signup" className={styles.signup_button}>
                                Sign Up
                            </Link>

                            </>

                        ) : (

                            <><button className={styles.signup_button} onClick={signOutRedirect}>
                                Sign Out
                            </button></>
                        )}

                    {/* <Link href="/signin" className={styles.signin_button}>
                        Sign In
                    </Link>
                    <Link href="/signup" className={styles.signup_button}>
                        Sign Up
                    </Link> */}
                </div>
            </nav>
        </div>
    )
}