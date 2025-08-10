import { setFcmToken } from "@/redux/slices/userSlice";
import FirebaseData from "@/utils/firebase";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const PushNotification = ({ children }) => {
  const dispatch = useDispatch();
  const [notification, setNotification] = useState("");
  const [token, setToken] = useState("");
  const { messaging, app, firebaseApp } = FirebaseData();

  const messagingInstance = async () => {
    try {
      const isSupportedBrowser = await isSupported();
      if (isSupportedBrowser) {
        return getMessaging(firebaseApp);
      } else {
        createStickyNote();
        return null;
      }
    } catch (err) {
      console.error("Error checking messaging support:", err);
      return null;
    }
  };
  const fetchToken = async () => {
    try {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        const messaging = await messagingInstance();
        // console.log("Messaging:-", messaging);
        if (!messaging) {
          console.error("Messaging not supported.");
          return;
        }
        const permission = await Notification.requestPermission();
        // console.log("Permission:", permission);
        if (permission === "granted") {
          getToken(messaging)
            .then((currentToken) => {
              if (currentToken) {
                setToken(currentToken);
                dispatch(setFcmToken({ data: currentToken }));
              } else {
                // setTokenFound(false);
                toast.error(t("permissionRequired"));
              }
            })
            .catch((err) => {
              console.error("Error retrieving token:", err);
              // If the error is "no active Service Worker", try to register the service worker again
              if (err.message.includes("no active Service Worker")) {
                registerServiceWorker();
              }
            });
        } else if (permission === "default") {
          // registerServiceWorker();
        } else {
          // setTokenFound(false);
          // toast.error('Permission is required for notifications.');
        }
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
    }
  };

  const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registration successful with scope: ",
            registration.scope
          );
          // After successful registration, try to fetch the token again
          fetchToken();
        })
        .catch((err) => {
          console.log("Service Worker registration failed: ", err);
        });
    }
  };
  const handleFetchToken = async () => {
    await fetchToken();
  };

  useEffect(() => {
    handleFetchToken();
  }, []);

  return <div>{children}</div>;
};

export default PushNotification;
