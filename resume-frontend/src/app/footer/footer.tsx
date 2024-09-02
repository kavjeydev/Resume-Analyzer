'use client'

import Link from "next/link";
import Image from "next/image"
import styles from "./footer.module.css"
import { useEffect } from "react";

export default function Footer(){
    useEffect(()=>{
        window.scrollTo(0,0);
      },[])
    return(
        <div className={styles.total_container}>
            <div className={styles.footer_container}>
                <div className={styles.logo}>
                    <Image width={75} height={75} className={styles.abstract} src="/logo.png" alt="orange abs"/>
                    <h1 className={styles.logo_footer}>
                        Get more interviews by using AI the right way. Keeping job seekers out of the dark.
                    </h1>
                </div>
                <div className={styles.right_side}>
                    <div className={styles.support}>
                        <h1 className={styles.heading}>
                            Support
                        </h1>
                        <div className={styles.small_links}>
                            <h1 className={styles.para}>
                                <Link href="/faq">FAQ</Link>
                            </h1>
                            <h1 className={styles.para}>
                                <Link href="mailto: kavin11205@gmail.com">Email</Link>
                            </h1>

                        </div>

                    </div>

                    <div className={styles.use}>
                        <h1 className={styles.heading}>
                            Get Started
                        </h1>
                        <h1 className={styles.para}>
                            <Link href="/signin" ><span className={styles.emphasize}>Sign in</span> and get started for free now!</Link>
                        </h1>
                    </div>
                </div>



            </div>


            <div className={styles.line_container}>
                    <h1 className={styles.line}>
                        ─────────────────────────────────────────────────────────────────────────────────────────────────────────
                    </h1>

                    <div className={styles.under_line_content}>
                        <h1 className={styles.line_words}>
                            2024 Quixotic
                        </h1>
                        <div className={styles.social_media}>
                            <Link href="https://www.github.com/kavjeydev" target="_blank">
                                <Image width={30} height={30} className={styles.footer_logo} src="/github2.svg" alt="Github Logo"/>
                            </Link>
                            <Link href="https://www.linkedin.com/in/kavinjey" target="_blank">
                                <Image width={30} height={30} className={styles.footer_logo} src="/linkedin.svg" alt="Github Logo"/>
                            </Link>
                        </div>
                    </div>

            </div>
        </div>
    )
}