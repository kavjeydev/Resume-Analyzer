import Image from "next/image";
import styles from "./page.module.css"
import Link from "next/link";
import Footer from "./footer/footer";
import Upload from "./upload/upload";

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


              <p className={styles.left_para}>
              Quixotic bridges the gap between job seekers and employers by ensuring that <span className={styles.emphasize}>qualifications and expectations align perfectly</span> by
              leveraging advanced algorithms and industry insights.</p>
              <p className={styles.left_para}>Simultaneously, we analyze job listings to identify
              <span className={styles.emphasize}> essential criteria and desired attributes</span> which enhances creates a more efficient hiring process for both parties.</p>

            </div>


          </div>

          <div className={styles.right_col}>
            <Image width={350} height={350} className={styles.abstract} src="/howitworks.svg" alt="orange abs"/>
          </div>

        </div>


        <div className={styles.third_section_div}>

            <h1 className={styles.para_heading_third}>See how Quixotic was created</h1>
            <div className={styles.paragraph_container_third}>


              <p className={styles.para_third}>
                Quixotic is created for the hopes of making job description tailored resumes a little bit easier.
                If you have any questions about how it works or what data it collects take a look at our <Link href="/faq" className={styles.para_third}>Check out the
                <span className={styles.emphasize_click}> FAQ</span></Link> or email us directly.
              </p>
              <Link href="https://github.com/kavjeydev/Resume-Analyzer" className={styles.para_third} target="_blank">Check out the
              <span className={styles.emphasize_click}> GitHub repository</span>. Everything is public!</Link>

            </div>


        </div>

        {/* <Upload /> */}
        <Footer />

      </div>
    </div>
  );
}
