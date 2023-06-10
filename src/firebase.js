import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "apikey",
  authDomain: "netflix-clone-fd915.firebaseapp.com",
  projectId: "netflix-clone-fd915",
  storageBucket: "netflix-clone-fd915.appspot.com",
  messagingSenderId: "739913929058",
  appId: "1:739913929058:web:471814becd1d0323fb9c3b"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };
