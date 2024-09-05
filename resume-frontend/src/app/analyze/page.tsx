'use client'

import Link from "next/link";
import Image from "next/image"
import styles from "./page.module.css"
import { useEffect } from "react";

import {user_info} from "../navbar/navbar"
import { getResumes } from "../firebase/functions";

export interface Resume {
    id: string,
    uid?: string,
    filename: string,
    thumbnail: string,
    top_skills: string[],
    role: string
}

export default  function Analyze(){

    useEffect(()=>{
        window.scrollTo(0,0);
      },[])

    // const user_resumes = await getResumes(user_info);



    return(
        <div className={styles.total_container}>

            <div className={styles.left_col}>
                <div className={styles.profile_container}>
                    <div className={styles.logo}>
                        {
                            user_info?.photoURL ? (
                                <Image width={35} height={35} className={styles.user_photo} src={user_info?.photoURL} alt="orange abs"/>
                            ) :
                            (
                                <Image width={35} height={35} className={styles.user_photo} src="/logo.png" alt="orange abs"/>
                            )
                        }
                    </div>
                        <h1 className={styles.user_name}>
                            {user_info?.email?.split("@")[0]}
                        </h1>

                </div>

            </div>

            <div className={styles.right_col}>
            <div className={styles.profile_container}>
                  <h1 className={styles.user_name}>
                      Your Resumes
                  </h1>

                </div>
                <div className={styles.all_resume_cont}>
                  <div className={styles.upload_container}>

                    <label className={styles.resume_upload}>
                      <Image width={10} height={10} className={styles.user_photo} src='/plus.svg' alt="orange abs"/>
                      <input id="upload" className={styles.upload_input} type="file" accept="pdf/*"/>
                    </label>
                  </div>
                </div>

            </div>


        </div>
    )
}