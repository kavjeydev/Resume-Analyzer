'use client'

import Link from "next/link";
import Image from "next/image"
import styles from "./page.module.css"
import { useEffect } from "react";

import {user_info} from "../navbar/navbar"
import { getResumes, uploadResume } from "../firebase/functions";

export default async function Analyze(){
    useEffect(()=>{
        window.scrollTo(0,0);
      },[])

    // const user_resumes = await getResumes(user_info);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (file) {
          handleUpload(file);
        }
      };

      const handleUpload = async (file: File) => {
        try {
          const response = await uploadResume(file);
          alert(`File uploaded successfully. Server responded with: ${JSON.stringify(response)}`);
        } catch (error) {
          alert(`Failed to upload file: ${error}`);
        }
      };


    return(
        <div className={styles.total_container}>
            <input id="upload" className={styles.uploadInput} type="file" accept="pdf/*"/>
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

            </div>

        </div>
    )
}