import { getResumeInfo, ResumeInfo } from '../firebase/functions';
import styles from './general_info.module.css'
import { user_info_results } from '../results/page';



export default async function GeneralInfo(){
    var resume_info:ResumeInfo[] = await getResumeInfo();
    console.log('START')
    console.log(resume_info);


    return(
        <div className={styles.outer_container}>
            <div className={styles.left_col}>
                Somthing
            </div>
            <div className={styles.right_col}>
                {resume_info.map((res) => (
                    <div className={styles.test}>
                        {
                            res.uid == user_info_results?.uid ? (
                                <div className={styles.test}>
                                    {res.company_name}
                                </div>
                            ) : (
                                <div></div>
                            )
                        }

                    </div>
                ))}
            </div>
        </div>
    )
}