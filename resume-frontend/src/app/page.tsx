import Image from "next/image";
import styles from "./page.module.css"
import Link from "next/link";

export default function Home() {
  return (
    <div>

      <div className={styles.outer_div}>
        <div className={styles.header_div}>
          <Image width={110} height={110} className={styles.abstract} src="/header_resume.svg" alt="orange abs"/>
          <h1 className={styles.first}>Quixotic: <span className={styles.second}>Increase your interview rates</span></h1>
        </div>
        <div className={styles.paragraph_div}>
          <p>Get detailed insight for <span className={styles.emphasize}>every resume</span> and <span className={styles.emphasize}>every job application </span>
          and what skills you can add to stand out against the rest. You're no longer in the dark, know exactly how to <span className={styles.emphasize}>land interviews. </span> </p>
        </div>

        <div className={styles.border_div}>
          <Link className={styles.get_started} href='/signup'>
            Get Started For Free &nbsp;↗
          </Link>
        </div>


        <div className={styles.second_section_div}>
          <div className={styles.left_col}>
            <h1 className={styles.para_heading}>Upload resume. Paste job posting. Examine results.</h1>
            <div className={styles.paragraph_container}>


              <p className={styles.left_para}>Get detailed insight for <span className={styles.emphasize}>every resume</span> and <span className={styles.emphasize}>every job application </span>
              and what skills you can add to stand out against the rest. You're no longer in the dark, know exactly how to <span className={styles.emphasize}>land interviews. </span> </p>
              <p className={styles.left_para}>Get detailed insight for <span className={styles.emphasize}>every resume</span> and <span className={styles.emphasize}>every job application </span>
              and what skills you can add to stand out against the rest. </p>

            </div>


          </div>

          <div className={styles.right_col}>
            <Image width={350} height={350} className={styles.abstract} src="/howitworks.svg" alt="orange abs"/>
          </div>

        </div>


      </div>
    </div>
  );
}
