import { getResumes, Resume } from "../firebase/functions";
import { user_info_analyze } from "../analyze/page";
import styles from './options.module.css'
import Image from "next/image"

var resume_info:Resume[] = []
export default async function Options(){
    var user_resumes:Resume[] = await getResumes();
    resume_info = await getResumes();;
    var colors = ['#ff8400', '#ffbb00', '#ffdd00']
    var text_colors = ['black', 'black', 'black']

    return (
        <select className={styles.select}>
            <option value="">Select Your Resume...</option>
            {
                user_resumes.filter(resume => resume.uid == user_info_analyze?.uid).map((res) => (

                    <option value={res.id}>{res.filename.split('#')[1]}</option>

                ))
            }
        </select>



    )

}
export {resume_info}
