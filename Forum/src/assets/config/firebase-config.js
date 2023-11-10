import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
    apiKey: 'AIzaSyCAW9RcjS4q9WB212O27DEYeh-OD3AnBZU',
    authDomain: 'forum-rado-ventsi.firebaseapp.com',
    projectId: 'forum-rado-ventsi',
    storageBucket: 'forum-rado-ventsi.appspot.com',
    messagingSenderId: '247101732604',
    appId: '1:247101732604:web:67eb2698743a9dcd2a8979',
    databaseURL:
        'https://forum-rado-ventsi-default-rtdb.europe-west1.firebasedatabase.app/',
};
export const app = initializeApp(firebaseConfig);
// the Firebase authentication handler
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);
export const storage = getStorage(app);

