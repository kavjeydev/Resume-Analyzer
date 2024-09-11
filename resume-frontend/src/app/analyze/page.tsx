'use client'


import Image from "next/image"
import styles from "./page.module.css"
import { Suspense, useEffect, useState } from "react";
import Upload from "../upload/upload";
import { getResumes } from "../firebase/functions";
import Client from "../client/client";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useRouter } from 'next/navigation'
import { User } from "firebase/auth";

import { resumeName } from "../options/options";
import { resume_info } from "../upload/upload";
import Options from "../options/options";

export interface Resume {
    id: string,
    uid?: string,
    filename: string,
    thumbnail: string,
    top_skills: string[],
    role: string
}
var user_info_analyze: User | null = null;
export {user_info_analyze}
export function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }

  console.log(uuidv4());



export default function Analyze(){
    const [user, setUser] = useState<User | null>(null);
    const [jobListing, setJobListing] = useState<any>(null);
    const router = useRouter();


    const [validEmail, setValidEmail] = useState(false);

    const authHelper = onAuthStateChangedHelper((user) => {
        user_info_analyze = user;
        setUser(user);

        if(user?.email && validEmail == false){
            console.log('jherre')

            setValidEmail(true);

        }
        else if(!user?.email && validEmail == true){
            router.push('/');

            setValidEmail(false);
        }

    })


    useEffect(()=>{

        window.scrollTo(0,0);
      },[])



    async function sendResumeForMatching(e:any){
        const form_data = new FormData();
        form_data.append('file', resumeName);
        form_data.append('listing', jobListing);

        const process_request = await fetch('http://127.0.0.1:8080/get-insight', {
            method: "POST",
            body: form_data,
        });
    }
    async function send_resume(e: any){
        const inputted_file = e.target.files[0];


        console.log(inputted_file)

        var blob = inputted_file.slice(0, inputted_file.size);
        var unique_identity = uuidv4();
        var newFile = new File([blob], `${user?.uid}-${unique_identity}#${inputted_file['name']}`);

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

            console.log('User Info', user?.uid)

            console.log(form_data)

            const process_request = await fetch('http://127.0.0.1:8080/process', {
                method: "POST",
                body: form_data,
            });

            if(process_request.ok){
                const process_request_json = await process_request.json();
                let process_url = process_request_json['output'];

                console.log("process url", process_url);

                alert("file Successfully uploaded");


            }


        }
        // rout er.push('/');
        router.refresh()

        e.target.value = null;
    }

    return(
        <div className={styles.total_container}>

            <div className={styles.left_col}>
                <div className={styles.profile_container}>
                    <div className={styles.logo}>
                        {
                            user?.photoURL ? (
                                <Image width={35} height={35} className={styles.user_photo} src={user?.photoURL} alt="orange abs"/>
                            ) :
                            (
                                <Image width={35} height={35} className={styles.user_photo} src="/icon.ico" alt="orange abs"/>
                            )
                        }
                    </div>
                        <h1 >
                            {user?.email?.split("@")[0]}
                        </h1>

                    </div>
                <div className={styles.upload_container} >
                    <label className={styles.resume_upload}>
                        <Image width={10} height={10} className={styles.user_photo} src='/plus.svg' alt="orange abs"/>
                        <input id="upload" className={styles.upload_input} type="file" accept="application/pdf" onChange={send_resume}/>


                    </label>

                </div>
                <form className={styles.links} name='analyze' onSubmit={sendResumeForMatching}>
                    <Suspense fallback={'Loading...'}><Options /></Suspense>
                    <input type="text" name="job " placeholder="Paste a job listing..." className={styles.typing_field} required onChange={e => { setJobListing(e.currentTarget.value); }}/>
                    <button  type="submit" className={styles.link} >
                        Match Resume with Listing ✨
                    </button>
                </form>

            </div>

            <div className={styles.right_col}>
                <div className={styles.profile_container}>
                  <h1 className={styles.user_name}>
                      Your Resumes
                  </h1>
                </div>
                <div className={styles.all_resume_cont}>

                  <Suspense fallback={'Loading...'}><Upload /></Suspense>

                </div>

            </div>


        </div>
    )
}