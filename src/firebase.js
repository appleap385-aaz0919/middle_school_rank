import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC4KoZiw1yCmqcUwsnEF5p-ExshvupXfA4",
  authDomain: "fir-us-east-01.firebaseapp.com",
  projectId: "fir-us-east-01",
  storageBucket: "fir-us-east-01.firebasestorage.app",
  messagingSenderId: "650722036531",
  appId: "1:650722036531:web:0e8b6446e4390325878c46"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;
