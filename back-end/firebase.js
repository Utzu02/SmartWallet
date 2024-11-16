
import * as firebase from "firebase/app";
import admin from 'firebase-admin';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification, 
  sendPasswordResetEmail

} from "firebase/auth";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config({ path: './.env' });
const serviceAccount = JSON.parse((fs.readFileSync('./FirebaseService.json', 'utf-8')));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId:process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);



export {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  admin
};

