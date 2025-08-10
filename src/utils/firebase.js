import { useSelector } from "react-redux";
import Loader from "@/components/loader/Loader";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, onMessage } from "firebase/messaging";
import firebase from "firebase/compat/app";

const FirebaseData = () => {
  const setting = useSelector((state) => state.Setting);
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);

  const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();

  let messaging;
  if (typeof window !== "undefined") {
    messaging = getMessaging(app);
  }

  try {
    onMessage(messaging, (payload) => {
      const data = payload?.data;
      console.log("Front Notification:", data);
      new Notification(data?.title, {
        body: data?.message,

        // icon: data?.image || setting?.setting?.web_settings?.web_logo,
      });
    });
  } catch (err) {
    console.log("Messaging Error:", err?.message);
  }

  return { auth, app, firebaseApp, messaging };
};

export default FirebaseData;
