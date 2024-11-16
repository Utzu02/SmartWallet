
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
const firebaseSecretKey = process.env.FIREBASE_SERVICE_ACCOUNT_BASE_64 || 'AAA';
console.log(process.env.FIREBASE_SERVICE_ACCOUNT_BASE_64 || 'AAA');
const serviceAccount = JSON.parse((fs.readFileSync('./FirebaseService.json', 'utf-8')));
console.log(serviceAccount);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId:process.env.MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
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

