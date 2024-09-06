'use client'

import Link from "next/link";
import Image from "next/image"
import styles from "./page.module.css"
import { useEffect, useState } from "react";
import {user_info} from "../navbar/navbar"
import { getResumes } from "../firebase/functions";
import { sign } from "crypto";
import { sendResponse } from "next/dist/server/image-optimizer";
import { collection, Firestore, getDocs, getFirestore, query, where } from "firebase/firestore";
import { getApp, initializeApp } from "firebase/app";
import Router from "next/router";
import { firebaseConfig } from "./env";


export interface Resume {
    id: string,
    uid?: string,
    filename: string,
    thumbnail: string,
    top_skills: string[],
    role: string
}

export function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }

  console.log(uuidv4());

export default function Analyze(){
    var user_resumes:any = [];


    const app_init = (() => {
        try{
            return getApp();
        }
        catch(any){

              return initializeApp(firebaseConfig);
        }
    })


    useEffect(()=>{
        window.scrollTo(0,0);
      },[])

    useEffect(() => {
        const result = async () => {
            try{
            const app = app_init();
            const db = getFirestore(app);
            const resumeRef = collection(db, 'resumes');


        // Create a query against the collection.
            const q = query(resumeRef);

            // const resumes_uploaded_by_user = getResumes();

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc: any) => {
            // doc.data() is never undefined for query doc snapshots
                if(doc.data().uid == user_info?.uid){
                    console.log(doc.id, " => ", doc.data().uid);
                    user_resumes.push(doc.data());

                }
                console.log(user_resumes)

            });

            Router.reload()
            }
            catch{
                console.log('error getting resumes')
            }
        }

        result();
    })
    console.log("RESULT", )
    async function send_resume(e: any){
        const inputted_file = e.target.files[0];


        console.log(inputted_file)

        var blob = inputted_file.slice(0, inputted_file.size);
        var unique_identity = uuidv4();
        var newFile = new File([blob], `${user_info?.uid}-${unique_identity}#${inputted_file['name']}`);

        console.log('New FIle', newFile)

        if(newFile === null){
            alert('no file')
        }
        else{
            const form_data = new FormData();
            form_data.append('file', newFile);

            console.log('File selected', newFile['name']);

            // inputted_file['name'] = user_info?.uid + '.pdf';

            console.log('Updated File selected', form_data);

            console.log('User Info', user_info?.uid)

            console.log(form_data)

            const process_request = await fetch('http://127.0.0.1:8080/process', {
                method: "POST",
                body: form_data,
            });

            if(process_request.ok){
                const process_request_json = await process_request.json();
                let process_url = process_request_json['output'];

                console.log("process url",process_url);
                alert("file Successfully uploaded");
            }


        }

        e.target.value = null;
    }

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
                        {user_resumes.length}                    <label className={styles.resume_upload}>
                      <Image width={10} height={10} className={styles.user_photo} src='/plus.svg' alt="orange abs"/>
                      <input id="upload" className={styles.upload_input} type="file" accept="pdf/*" onChange={send_resume}/>


                    </label>
                  </div>
                </div>

            </div>


        </div>
    )
}