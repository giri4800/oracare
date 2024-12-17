import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBjrB-CnQS_XdOqlRAIOBIlB41xNbfQrOM",
  authDomain: "oracare-91da5.firebaseapp.com",
  projectId: "oracare-91da5",
  storageBucket: "oracare-91da5.firebasestorage.app",
  messagingSenderId: "10883966441",
  appId: "1:10883966441:web:3bc409c37920e420725778"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 