import { getResumeInfo, ResumeInfo } from '../firebase/functions';
import styles from './general_info.module.css'
import { user_info_results } from '../results/page';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { useState } from 'react';






export default async function GeneralInfo(){
    const [salaryProgression, setSalaryProgression] = useState<string[]>([]);
    var colors = ['#ff8400', '#ffbb00', '#ffdd00']
    var text_colors = ['black', 'black', 'black']

    const inflationRates = [0.008, 0.007, 0.021, 0.021, 0.019, 0.023, 0.014, 0.07, 0.065, 0.034, 0.025];

    var inflationSalary = []




    var salaries:string[] = [];

    var salaries_int:number[] = [];


    var resume_info:ResumeInfo[] = await getResumeInfo();

    for(var i = 0; i < resume_info.length; i++){
        if(resume_info[i].uid == user_info_results?.uid){
            salaries = resume_info[i].ten_year_progression;
        }
        console.log('here')
    }

    console.log(salaries)

    salaries.forEach((salary) => {
        salaries_int.push(Number(salary.replace(/,/g, '')))
    })
    var salary:number = salaries_int[0];
    inflationSalary.push(salary);
    for(var i = 1; i < 10; i++){

        inflationSalary.push((inflationSalary[i - 1] * (1 + inflationRates[i])));
    }




    const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
        ssr: false,
      });
      const data = {
        labels: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [
          {
            label: 'Salary Progression',
            data: salaries_int,
            fill: true,
            borderColor: 'orange',
            tension: 0.1,
          },
          {
            label: 'Inflation',
            data: inflationSalary,
            fill: false,
            borderColor: 'red',
            tension: 0.1,
          },

        ],
      };

    const LineChart = () => {
        return (
          <div style={{ width: '700px', height: '400px' }}>
            <h1>Career Progression vs Inflation</h1>
            <Line data={data}/>
          </div>
        );
      };


    return(
        <div className={styles.outer_container}>
                {resume_info.map((res) => (
                    <div className={styles.inner_cont} onLoad={e => setSalaryProgression(res.ten_year_progression)}>
                        {
                            res.uid == user_info_results?.uid ? (
                                <div className={styles.left_container}>
                                    <div className={styles.salaries_container}>
                                        <div className={styles.level_role_resume}>
                                            <h1 className={styles.job_level}>{res.job_level}</h1>
                                            <h1 className={styles.role}>{res.role}</h1>
                                        </div>
                                        <div className={styles.listing_salary}>
                                            <h1 className={styles.job_level}>Listing Salary</h1>
                                            <h1 className={styles.role}>${res.listing_min_salary} - ${res.listing_max_salary}</h1>
                                        </div>
                                        <div className={styles.company_average_salary}>
                                            <h1 className={styles.job_level}>Company Avg Salary</h1>
                                            <h1 className={styles.role}>${res.company_role_min_salary} - ${res.company_role_min_salary}</h1>
                                        </div>
                                        <div className={styles.market_avg_salary}>
                                            <h1 className={styles.job_level}>Market Avg Salary</h1>
                                            <h1 className={styles.role}>${res.market_min_salary} - ${res.market_max_salary}</h1>
                                        </div>

                                    </div>

                                    <div className={styles.bottom_half}>
                                        <div className={styles.company_culture_container}>
                                            <div className={styles.company_name}>
                                                {res.company_name} Culture
                                            </div>
                                            <div className={styles.culture_list}>
                                                {
                                                    res.company_culture.map((culture) => (
                                                        <h1 className={styles.culture}>
                                                            {culture}
                                                        </h1>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.skills_and_graph}>
                                            <LineChart />
                                        </div>
                                    </div>


                                    <div className={styles.skill_container}>
                                        <div className={styles.tech_container}>
                                            <div className={styles.header}>
                                                Technical Skills Missing
                                            </div>
                                            <div className={styles.tech_skill_container} >
                                                {
                                                    res.ts_to_add.map((skill, index) => (

                                                            <div className={styles.tech_skill} style={{ backgroundColor: colors[index % 3], borderRadius: '5px' }}>
                                                                {skill}
                                                            </div>

                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.soft_container}>
                                                <div className={styles.header}>
                                                    Soft Skills Missing
                                                </div>
                                                <div className={styles.soft_skill_container} >
                                                {
                                                    res.ss_to_add.map((skill, index) => (

                                                            <div className={styles.soft_skill} style={{ backgroundColor: colors[index % 3], borderRadius: '5px' }}>
                                                                {skill}
                                                            </div>

                                                    ))
                                                }
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div></div>
                            )
                        }

                    </div>
                ))}
        </div>
    )
}