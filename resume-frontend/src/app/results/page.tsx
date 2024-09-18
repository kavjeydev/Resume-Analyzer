'use client'

import { Suspense, useState } from 'react'
import GeneralInfo from '../processed-info-general/general_info'
import {Tooltip} from "@nextui-org/tooltip";
import styles from './page.module.css'
import { User } from 'firebase/auth';
import { onAuthStateChangedHelper } from '../firebase/firebase';
import { useRouter } from 'next/navigation';


var user_info_results: User | null = null;
export {user_info_results}




export default function Results(){
    const [user, setUser] = useState<User | null>(null);
    const [validEmail, setValidEmail] = useState(false);
    const router = useRouter();

    const authHelper = onAuthStateChangedHelper((user) => {
        user_info_results = user;
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


    return (
        <div className={styles.outer_container}>
                <div className={styles.left_col}>
                    <div className={styles.header}>
                        Menu
                    </div>

                        <button className={styles.general}>
                            Skills Insight
                        </button>
                    <Tooltip
                    showArrow
                    placement="right"
                    content="Coming Soon"
                    classNames={{
                        base: [
                        // arrow color
                        "before:bg-neutral-400 dark:before:bg-white",
                        ],
                        content: [
                        "py-2 px-4 shadow-xl",
                        "text-black bg-gradient-to-br from-white to-neutral-400",
                        ],
                    }}
                    >
                    <button className={styles.other}>
                        Line by Line Insight
                    </button>
                    </Tooltip>
                    <Tooltip
                    showArrow
                    placement="right"
                    content="Coming Soon"
                    classNames={{
                        base: [
                        // arrow color
                        "before:bg-neutral-400 dark:before:bg-white",
                        ],
                        content: [
                        "py-2 px-4 shadow-xl",
                        "text-black bg-gradient-to-br from-white to-neutral-400",
                        ],
                    }}
                    >
                    <button className={styles.other}>
                        Match Score
                    </button>
                    </Tooltip>
                </div>
                <div className={styles.right_col}>
                    <Suspense fallback={'Loading...'}><GeneralInfo /></Suspense>
                </div>


        </div>
    )
}
