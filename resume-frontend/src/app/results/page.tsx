'use client'

import { Suspense, useState } from 'react'
import GeneralInfo from '../processed-info-general/general_info'
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
                    Somthing
                </div>
                <div className={styles.right_col}>
                    <Suspense fallback={'Loading...'}><GeneralInfo /></Suspense>
                </div>


        </div>
    )
}
