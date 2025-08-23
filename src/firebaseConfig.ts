import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCTI3qiIRGrnzKc0f6jJXGjL0tMUk9lZNM',
  authDomain: 'smartfarmiot-28e0f.firebaseapp.com',
  databaseURL: 'https://smartfarmiot-28e0f-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'smartfarmiot-28e0f',
  storageBucket: 'smartfarmiot-28e0f.firebasestorage.app',
  messagingSenderId: '1060521794829',
  appId: '1:1060521794829:web:1ee7d73135aeb26aaea444',
  measurementId: 'G-7HQ0JEWVZE',
}
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
export const fs = getFirestore(firebaseApp)

export const auth = getAuth(firebaseApp)
