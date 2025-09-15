import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCHnkaf830mQ5oNTBstceQhwwHtgxg70Wc",
  authDomain: "space-map-c869e.firebaseapp.com",
  databaseURL: "https://space-map-c869e-default-rtdb.firebaseio.com",
  projectId: "space-map-c869e",
  storageBucket: "space-map-c869e.appspot.com",
  messagingSenderId: "139081977460",
  appId: "1:139081977460:web:009f41689f0736a6ea0b21"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export { db };