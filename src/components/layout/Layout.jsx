import React, { PropsWithChildren, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { setPaymentSetting, setSetting } from "@/redux/slices/settingSlice";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "@/api/apiRoutes";
import { ToastContainer } from "react-toastify";
import { setShop } from "@/redux/slices/shopSlice";
import Loader from "../loader/Loader";
import Location from "../locationmodal/Location";
import { setFavoriteProductIds } from "@/redux/slices/FavoriteSlice";
import PushNotification from "../firebasenotification/PushNotification";
import LangFile from "@/utils/en.json";
import {
  setAvailableLanguages,
  setSelectedLanguage,
} from "@/redux/slices/languageSlice";
import { useRouter } from "next/router";
import MaintanceMode from "../error/MaintanceMode";

const Layout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Theme.theme);
  const setting = useSelector((state) => state.Setting);
  const language = useSelector((state) => state.Language.selectedLanguage);

  const [loading, setLoading] = useState(false);
  // const [showLocation, setShowLocation] = useState(false)

  useEffect(() => {
    document.documentElement.dir = language?.type;
  }, []);

  useEffect(() => {
    fetchSetting();
    fetchPaymentSetting();
    fetchLanguage();
  }, []);

  const fetchLanguage = async () => {
    try {
      const response = await api.getSystemLanguages({
        id: 0,
        isDefault: 0,
        systemType: 3,
      });
      if (response.status == 1) {
        if (response.data !== undefined) {
          if (response?.data?.length == 1) {
            try {
              const langRes = await api.getSystemLanguages({
                id: response?.data?.[0]?.id,
                isDefault: 1,
                systemType: 3,
              });
              if (langRes.status == 1) {
                document.documentElement.dir = langRes?.data?.type;
                dispatch(setSelectedLanguage({ data: langRes?.data }));
              } else {
                const language = {
                  id: 15,
                  name: "English",
                  code: "en",
                  type: "LTR",
                  system_type: 3,
                  is_default: 1,
                  json_data: LangFile,
                  display_name: "English",
                  system_type_name: "Website",
                };
                dispatch(setSelectedLanguage({ data: language }));
              }
            } catch (error) {
              console.log("error");
            }
          } else if (language == null) {
            const langId = response?.data?.find(
              (lang) => lang?.is_default == 1
            )?.id;
            const langRes = await api.getSystemLanguages({
              id: langId,
              isDefault: 1,
              systemType: 3,
            });
            document.documentElement.dir = langRes?.data?.type;
            dispatch(setSelectedLanguage({ data: langRes?.data }));
          }
          dispatch(setAvailableLanguages({ data: response.data }));
        } else {
          const language = {
            id: 15,
            name: "English",
            code: "en",
            type: "LTR",
            system_type: 3,
            is_default: 1,
            json_data: LangFile,
            display_name: "English",
            system_type_name: "Website",
          };
          dispatch(setSelectedLanguage({ data: language }));
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const fetchSetting = async () => {
    setLoading(true);
    try {
      const res = await api.getSetting();
      const setting = JSON.parse(atob(res.data));
      dispatch(setSetting({ data: setting }));
      dispatch(setFavoriteProductIds({ data: setting?.favorite_product_ids }));
      document.documentElement.style.setProperty(
        "--primary-color",
        setting?.web_settings?.color
      );
      if (setting?.favicon) {
        const link =
          document.querySelector("link[rel*='icon']") ||
          document.createElement("link");
        const oldLinks = document.querySelectorAll("link[rel*='icon']");
        oldLinks.forEach((el) => el.parentNode.removeChild(el));
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = setting.favicon;
        link.sizes = "16x16 32x32 64x64";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      document.documentElement.style.setProperty(
        "--light-primary-color",
        setting?.web_settings?.light_color
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const fetchPaymentSetting = async () => {
    setLoading(true);
    try {
      const res = await api.getPaymentSetting();
      dispatch(setPaymentSetting({ data: JSON.parse(atob(res.data)) }));
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  useEffect(() => {
    // Show loader on route change start
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    // Cleanup event listeners
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <section>
      {loading ? (
        <Loader screen="full" />
      ) : setting?.setting?.web_settings?.website_mode == 1 ? (
        <MaintanceMode
          message={setting?.setting?.web_settings?.website_mode_remark}
        />
      ) : (
        <PushNotification>
          <Header />
          {children}
          <Footer />
          <ToastContainer
            theme={theme}
            key="toastContainer"
            bodyClassName={"toast-body"}
            toastClassName="toast-container-className"
          />
        </PushNotification>
      )}
      {/* <Location showLocation={showLocation} setShowLocation={setShowLocation} /> */}
    </section>
  );
};

export default Layout;
