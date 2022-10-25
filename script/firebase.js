import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBP9_inNsARAxSSkAOU58RTCmr0Lvfyi4w",
  authDomain: "library-c4cd5.firebaseapp.com",
  projectId: "library-c4cd5",
  storageBucket: "library-c4cd5.appspot.com",
  messagingSenderId: "211584137879",
  appId: "1:211584137879:web:754b9369377141715a87d2",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
