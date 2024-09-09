import {getFunctions, httpsCallable} from "firebase/functions";
import { functions } from "./firebase";
import { User } from "firebase/auth";
import { getApp, initializeApp } from "firebase/app";
import { firebaseConfig } from "./env";
import { collection, Firestore, getDocs, getFirestore, query, where } from "firebase/firestore";


const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');
const createUserFunction = httpsCallable(functions, 'createUser');

const getResumesFunction = httpsCallable(functions, 'getResumes');
const uploadResumeFunction = httpsCallable(functions, 'uploadResume')

export interface Video {
  id: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title: string,
  description?: string,
  thumbnail: string,

}

export interface Resume {
    id: string,
    uid?: string,
    filename: string,
    thumbnail: string,
    top_skills: string[],
    role: string,
    job_level: string
}

export interface Thumbnail {
    id?: string,
    uid?: string,
    filename?: string,
}

export async function getVideos() {
    const response: any = await getVideosFunction();
    console.log("RESPONSE", response)
    return response.data as Video[];
  }

// export async function getResumes(user_info: User | null){
//     const response: any = await getResumesFunction(user_info);
//     console.log("RESPONSE", response);

//     return response.data as Resume[];
// }

export async function createUser(){
    const response: any = await createUserFunction();
}


const app_init = (() => {
    try{
        return getApp();
    }
    catch(any){

          return initializeApp(firebaseConfig);
    }
})

export async function getResumes(){
    var user_resumes:any = [];
    // try{
        const app = app_init();
        const db = getFirestore(app);
        const resumeRef = collection(db, 'resumes');


    // Create a query against the collection.
        const q = query(resumeRef);

        // const resumes_uploaded_by_user = getResumes();

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc: any) => {
        // doc.data() is never undefined for query doc snapshots
            // if(doc.data().uid == user_info?.uid){
                // console.log(doc.id, " => ", doc.data().uid);
                user_resumes.push(doc.data());

            // }
            // console.log(user_resumes)
            return user_resumes as Resume[];

        });

        // }
        // catch{
        //     console.log('error getting resumes')
        // }
        return user_resumes as Resume[];

}


// export async function getThumbnails(){
//     // The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// // The ID of your GCS file
// const fileName = 'your-file-name';

// // The path to which the file should be downloaded
// const destFileName = '/local/path/to/file.txt';

// // Imports the Google Cloud client library
// const {Storage} = require('@google-cloud/storage');

// // Creates a client
// const storage = new Storage();

// async function downloadFile() {
//   const options = {
//     destination: destFileName,
//   };

//   // Downloads the file to the destination file path
//   await storage.bucket(bucketName).file(fileName).download(options);

//   console.log(
//     `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
//   );
// }

//     downloadFile().catch(console.error);
// }




