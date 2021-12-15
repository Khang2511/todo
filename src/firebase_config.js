import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDBAHyyN75fAxBlM0iLJDMYOsn9FLtzTjM",
    authDomain: "test-bf7bd.firebaseapp.com",
    databaseURL: "https://test-bf7bd-default-rtdb.firebaseio.com",
    projectId: "test-bf7bd",
    storageBucket: "test-bf7bd.appspot.com",
    messagingSenderId: "916411750969",
    appId: "1:916411750969:web:e382bca573ce2d5971cbe8",
    measurementId: "G-FXZE9QTBR8"
};

firebase.initializeApp(firebaseConfig)
 
const db = firebase.firestore();

export default db;