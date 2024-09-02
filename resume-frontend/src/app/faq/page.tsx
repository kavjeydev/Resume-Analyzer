'use client'

import { styleText } from "util";
import styles from './page.module.css'
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Footer from "../footer/footer";

export default function FAQ(){


  return(


    <div className={styles.external_div}>

      <div className={styles.header_div}>
        <div className={styles.header_with_icon}>
          <div className={styles.header_package}>

            <h1 className={styles.faq_header}>
              Frequently Asked Questions
            </h1>


            <p className={styles.header_para}>
              Can't find an answer here? Feel free to <Link href='/mailto: kavin11205@gmail.com' className={styles.emphasize_click}>email us</Link>.
            </p>

          </div>
        </div>

      </div>
      <div className={styles.all_questions}>
        <div className={styles.question_container} id="question_container">
            <h1 className={styles.question}>Is my data safe with Quixotic?</h1>
            <h1 className={styles.answer}>Yes! All data is private and meant for the user and the user only. No, the data is not sold. Feel free to black out
              any personal information as well, our algorithm does not use it.
            </h1>
        </div>

        <div className={styles.question_container}>
            <h1 className={styles.question}>How does this algorithm work?</h1>

            <h1 className={styles.answer}>All the code is available on the <Link href='https://www.github.com/kavjeydev/Resume-Analyzer' className={styles.emphasize_click} target="_blank">GitHub!</Link> </h1>
        </div>
        <div className={styles.question_container}>
            <h1 className={styles.question}>Does Quixotic store my resumes?</h1>
            <h1 className={styles.answer}>
                Yes, resumes are stored so the user can access them in the future but all information is confidential and any personal information can be
                removed as it doesn't affect the performance of this tool.
            </h1>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );

}