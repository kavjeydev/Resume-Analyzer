import { getResumes, Resume } from "../firebase/functions";
import { user_info_analyze } from "../analyze/page";
import styles from './options.module.css'
import Image from "next/image"
import { useState } from "react";

var resume_info:Resume[] = []
var resumeName: any = '';
export default async function Options(){
    const [resName, setResName] = useState();
    var user_resumes:Resume[] = await getResumes();
    resume_info = await getResumes();;
    var colors = ['#ff8400', '#ffbb00', '#ffdd00']
    var text_colors = ['black', 'black', 'black']

    const setResumevar = (event:any) => {
        const value =  event.currentTarget.value;
        setResName(value)
        console.log('resname', event.currentTarget.value)
        resumeName = event.currentTarget.value;
        console.log('resname', event.target.value)
    }
    function setResume(value:any){
        setResName(value)

        resumeName = resName;
        console.log('resname', resumeName)
    }

    return (
        <select className={styles.select} value={resName} required onChange={setResumevar}>
            <option value="">Select Your Resume...</option>
            {
                user_resumes.filter(resume => resume.uid == user_info_analyze?.uid).map((res) => (

                    <option value={res.filename}>{res.filename.split('#')[1]}</option>

                ))
            }
        </select>



    )

}
export {resume_info, resumeName}
