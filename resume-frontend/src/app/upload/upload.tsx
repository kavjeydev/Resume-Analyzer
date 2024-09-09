import { getResumes, Resume } from "../firebase/functions";
import { user_info_analyze } from "../analyze/page";
import styles from './upload.module.css'
import Image from "next/image"

export default async function Upload(){
    var user_resumes:Resume[] = await getResumes();

    var colors = ['#ff8400', '#ffbb00', '#ffdd00']
    var text_colors = ['black', 'black', 'black']

    return (
            <div className={styles.all_resumes}>
            {
                user_resumes.map((res) => (

                    <div className={styles.one_resume_check}>
                        {
                            res.uid == user_info_analyze?.uid ? (
                                <div className={styles.with_title}>
                                    <div className={styles.one_resume} key={res.id}>
                                        <div className={styles.image_div}>
                                            <Image src={`https://storage.googleapis.com/quixotic-processed-thumbnails/${res.thumbnail.split('#')[0]}%23${res.thumbnail.split('#')[1]}`} alt='thumbnail' objectFit="cover" layout="fill"
                                                className={styles.thumbnail} />
                                        </div>

                                        <div className={styles.all_skills}>
                                            {
                                                res.top_skills.map((skill, index) => (

                                                    <div className={styles.skill_container} style={{backgroundColor: colors[index]}}>
                                                        <h1 className={styles.skill} style={{color: text_colors[index]}}>{skill}</h1>

                                                    </div>

                                                ))
                                            }
                                        </div>


                                    </div>
                                    <div className={styles.title_cont}>
                                        <h3 className={styles.title}>{res.filename.split('#')[1]}</h3>
                                    </div>

                                </div>
                            ) :
                            (
                                <div></div>
                            )
                        }
                    </div>

                ))
            }
            </div>


    )
}