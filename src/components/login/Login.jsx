"use client";
import react, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import { t } from "@/utils/translation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GoogleLogo from "@/assets/googleLogin.svg";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import {
  addtoGuestCart,
  setCart,
  setCartProducts,
  setCartSubTotal,
  setGuestCartTotal,
  setIsGuest,
} from "@/redux/slices/cartSlice";
import {
  setAuthId,
  setAuthType,
  setCurrentUser,
} from "@/redux/slices/userSlice";
import { FaRegEye, FaRegEyeSlash, FaRegEnvelope } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
} from "firebase/auth";
import FirebaseData from "@/utils/firebase";
import * as api from "@/api/apiRoutes";
import { setTokenThunk } from "@/redux/thunk/loginthunk";
import NewUserModal from "../newusermodal/NewUserModal";
import { IoIosCloseCircle } from "react-icons/io";
import Register from "../register/Register";
import { setSetting } from "@/redux/slices/settingSlice";
import ForgetPasswordModal from "../forgetpasswordmodal/ForgetPasswordModal";

export function Login({ showLogin, setShowLogin, setMobileActiveKey }) {
  const city = useSelector((state) => state.City.city);
  const cart = useSelector((state) => state.Cart);
  const setting = useSelector((state) => state.Setting.setting);
  const language = useSelector(state => state.Language.selectedLanguage);
  const fcmToken = useSelector((state) => state.User?.fcm_token);
  const { auth, app, messaging } = FirebaseData();
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const defaultCountry = process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE || "in";

  const [userName, setUserName] = useState("");
  const [showNewUser, setShowNewUser] = useState(false);
  const [isOTP, setIsOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [otp, setOtp] = useState(null);
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const [inputType, setInputType] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const [phoneNumberWithoutCountryCode, setPhoneNumberWithoutCountryCode] =
    useState("");
  const [Uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(90);
  const [otpDisabled, setOtpDisabled] = useState(true);
  const [error, setError] = useState("");
  const [userAuthType, setUserAuthType] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [phonePassword, setPhonePassword] = useState("")
  const [forgotPasswordType, setForgotPasswordType] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputType]);

  useEffect(() => {
    setCountryCode(process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE);
  }, []);
  useEffect(() => {
    if (showLogin === true && showRegister === false) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE == "true") {
        setInputType("number");
        dispatch(setAuthType({ data: "number" }))
        setPhoneNumber(`+919876543210`);
        setCountryCode(defaultCountry);
        setPhoneNumberWithoutCountryCode("9876543210");
        setOtp("123456");
      }
      // else if(process.env.NEXT_PUBLIC_DEMO_MODE == "true" && inputType == "email"){
      //   setInputType("number");
      //   dispatch(setAuthType({ data: "number" }))
      //   setPhoneNumber(`+919876543210`);
      //   setCountryCode(defaultCountry);
      //   setPhoneNumberWithoutCountryCode("9876543210");
      //   setOtp("123456");
      // }
    }
    if (setting?.phone_login == 1) {
      setInputType("number");
    }
    else if (setting?.email_login == 1) {
      setInputType("email");
    }
  }, [showLogin]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpDisabled(false);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (showLogin) {
      generateRecaptcha();
    }
    return () => {
      recaptchaClear();
    };
  }, [showLogin]);

  const recaptchaClear = async () => {
    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      } catch (error) {
        console.error("Error clearing ReCAPTCHA verifier:", error);
      }
    }
    if (recaptchaContainer) {
      recaptchaContainer.innerHTML = "";
      console.log("ReCAPTCHA container cleared");
    }
  };

  const generateRecaptcha = async () => {
    await recaptchaClear();
    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (!recaptchaContainer) {
      console.error("Container element 'recaptcha-container' not found.");
      return null;
    }
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        recaptchaContainer,
        {
          size: "invisible",
        }
      );
      return window.recaptchaVerifier;
    } catch (error) {
      console.error("Error initializing RecaptchaVerifier:", error.message);
      return null;
    }
  };

  const handleShowRegister = (type) => {
    setShowRegister(true);
    setInputType(type);

    setError("")
  };

  const handleEmailChange = (value, data) => {
    setInputType("email");
    setEmail(value);
    setOtp("");
    setPhoneNumber("");
    setCountryCode("");
  };

  const handlePhoneNoChange = (value, data) => {
    setInputValue(value);
    setInputType("number");
    dispatch(setAuthType({ data: "phone" }));
    const dialCode = data?.dialCode || "";
    const phoneWithoutDialCode = value.startsWith(dialCode)
      ? value.slice(dialCode.length)
      : value;
    setPhoneNumber(`+${value}`);
    setPhoneNumberWithoutCountryCode(phoneWithoutDialCode);
    setCountryCode("+" + dialCode);
    setOtp("");
  };
  const handleSendOTP = async (e) => {
    setLoading(true);
    setOtpDisabled(true);
    e.preventDefault();
    if (
      phoneNumber?.length < countryCode.length ||
      phoneNumber?.slice(1) === countryCode
    ) {
      setError("Please enter phone number!");
      setLoading(false);
    } else {
      const phoneNumberWithoutSpaces = `${phoneNumber}`.replace(/\s+/g, "");
      if (setting?.firebase_authentication == 1) {
        try {
          const confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumberWithoutSpaces,
            window.recaptchaVerifier
          );
          window.confirmationResult = confirmationResult;
          setTimer(90);
          setIsOTP(true);
          setLoading(false);
        } catch (error) {
          console.log("error", error)
          setPhoneNumber();
          setError(error.message);
          setLoading(false);
          setIsOTP(false);
        }
      } else if (setting?.custom_sms_gateway_otp_based == 1) {
        try {
          const res = await api.sendSms({
            mobile: phoneNumberWithoutSpaces
          });
          if (res?.status == 1) {
            setTimer(90);
            setIsOTP(true);
            setLoading(false);
          } else {
            setError(t("custom_send_sms_error_message"));
            setLoading(false);
          }
        } catch (error) {
          setPhoneNumber();
          setError(t("custom_send_sms_error_message"));
          setLoading(false);
        }
      } else {
        toast.error(t("Something went wrong"));
        setLoading(false);
      }
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    if (otp == "") {
      toast.error(t("otp_required"));
      return;
    }
    if (setting?.firebase_authentication == 1) {
      setLoading(true);
      try {
        const user = await window.confirmationResult.confirm(otp);
        dispatch(setAuthId({ data: user.user.id }));
        setUid(user.user.id);
        const loginResponse = await loginApiCall(
          user.user,
          phoneNumberWithoutCountryCode,
          fcmToken,
          "phone"
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(t("invalid_otp"));
      }
    } else if (setting?.custom_sms_gateway_otp_based == 1) {
      const mobileNo = phoneNumber?.split(" ")?.[1];
      try {
        const response = await api.verifyOTP({
          mobile: phoneNumberWithoutCountryCode,
          country_code: `+${countryCode}`,
          otp: otp,
        });
        if (
          response?.status == 1 &&
          response?.message ==
          t("otp_valid_but_user_invalid")
        ) {
          setShowNewUser(true);
          setShowLogin(false);
          setIsOTP(false);
          dispatch(setAuthType({ data: "phone" }));
          setPhoneNumber(mobileNo);
          setUserName("");
          setEmail("");
        } else if (response?.status == 1) {
          const tokenSet = await dispatch(
            setTokenThunk(res?.data?.access_token)
          );
          await getCurrentUser();
          dispatch(setAuthType({ data: "phone" }));
          if (res?.data?.user?.status == 1) {
            dispatch(setIsGuest({ data: false }));
          }
          await handleFetchSetting();
          if (
            cart?.isGuest === true &&
            cart?.guestCart?.length !== 0 &&
            res?.data?.user?.status == 1
          ) {
            await addToBulkCart(res?.data.access_token);
          }
          await fetchCart();
          setError("");
          setOtp("");
          setPhoneNumber("");
          setLoading(false);
          setIsOTP(false);
          setShowLogin(false);
        } else {
          toast.error()
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const handleFetchSetting = async () => {
    try {
      const res = await api.getSetting();
      const parsedSetting = JSON.parse(atob(res.data))
      dispatch(setSetting({ data: parsedSetting }));
    } catch (error) {
      console.log("error", error);
    }
  };

  const getProductData = (cartData) => {
    const cartProducts = cartData?.cart?.map((product) => {
      return {
        product_id: product?.product_id,
        product_variant_id: product?.product_variant_id,
        qty: product?.qty,
      };
    });
    return cartProducts;
  };

  const fetchCart = async () => {
    const latitude = city?.latitude || setting?.default_city?.latitude;
    const longitude = city?.longitude || setting?.default_city?.longitude;
    try {
      const response = await api.getCart({
        latitude: latitude,
        longitude: longitude,
      });
      if (response.status === 1) {
        dispatch(setCart({ data: response.data }));
        const productsData = getProductData(response.data);
        dispatch(setCartProducts({ data: productsData }));
        dispatch(setCartSubTotal({ data: response?.data?.sub_total }));
      } else {
        dispatch(setCart({ data: null }));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const loginApiCall = async (user, id, fcm, type) => {
    setLoading(true)
    try {
      dispatch(setAuthId({ data: Uid, type }));
      const isPhoneAuthPassword = setting?.phone_auth_password == 1 ? true : false;
      const res = await api.login({ id: id, fcm, type, phoneAuthType: isPhoneAuthPassword, password: phonePassword });
      if (res.status === 1) {
        if (res?.status == 1 && res?.message == "user_deactivated") {
          toast.error(t("user_deactivated"))
          setLoading(false);
          setShowLogin(false)
          return;
        } else {
          const tokenSet = await dispatch(setTokenThunk(res?.data?.access_token));
          await getCurrentUser();
          dispatch(setAuthType({ data: type }));
          if (res?.data?.user?.status == 1) {
            dispatch(setIsGuest({ data: false }));
          }
          await handleFetchSetting();
          if (
            cart?.isGuest === true &&
            cart?.guestCart?.length !== 0 &&
            res?.data?.user?.status == 1
          ) {
            await addToBulkCart(res?.data.access_token);
          }
          await fetchCart();
          setError("");
          setOtp("");
          setPhoneNumber("");
          setLoading(false);
          setIsOTP(false);
          setShowLogin(false);
          setShowRegister(false);
        }
      } else if (res.message == "user_exist_with_email") {
        toast.error(t("user_exist_with_email"));
        setLoading(false)
      } else if (res.message == "user_exist_password_blank") {
        setIsErrorMessage(t("forget_password_note"))
        handleShowForgotPassword("phone")
        setLoading(false)
      } else if (res.message == "invalid_password") {
        setError(t("password_not_valid"));
        setPhonePassword("")
        setLoading(false)
      } else if (res.message == "user_not_exist" && isPhoneAuthPassword == true) {
        setError(t("user_not_exist"))
        setLoading(false)
      } else {
        setUserAuthType(type);
        setEmail(user?.providerData?.[0]?.email);
        setUserName(user?.providerData?.[0]?.displayName);
        setPhoneNumber(user?.providerData?.[0]?.phoneNumber);
        setShowNewUser(true);
        setShowLogin(false);
        setLoading(false)
      }
    } catch (error) {
      console.error("error", error);
      setLoading(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await api.getUser();
      dispatch(setCurrentUser({ data: response.user }));
      toast.success("You're successfully Logged In");
    } catch (error) {
      console.log("error", error);
    }
  };

  const handlePasswordShow = () => {
    setShowPassword(!showPassword);
  };

  const handleShowForgotPassword = (type) => {
    setPhonePassword("")
    // setShowLogin(false);
    setForgotPasswordType(type);
    setShowForgetPassword(true);
  };

  const handleHideLogin = async () => {
    await recaptchaClear();
    setIsOTP(false);
    setShowLogin(false);
    setError("");
    setInputValue("");
    setInputType("");
    setLoading(false);
    setMobileActiveKey(1);
    setEmail("");
    setPassword("");
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credentials = GoogleAuthProvider.credentialFromResult(result);
      const user = result?.user;
      dispatch(setAuthType({ data: "google" }));
      const response = await loginApiCall(user, user?.providerData[0].email, fcmToken, "google");
    } catch (error) {
      if (error?.message?.includes("auth/popup-closed-by-user")) {
        toast.error(t("popup_closed_by_user"))
      }
    }
  };

  const handleEmailLogin = async (e) => {
    setLoading(true);

    if (e != undefined) {
      e.preventDefault();
    }
    if (!email || !password) {
      setError(t("email_password_mandatory"))
      setLoading(false);
      return
    }
    try {
      const res = await api.login({
        id: email,
        type: "email",
        password: password,
        fcm: fcmToken
      });
      if (res.status === 1) {
        if (res?.status == 1 && res?.message == "user_deactivated") {
          toast.error(t("user_deactivated"))
          setLoading(false)
          setShowLogin(false)
          return;
        } else {
          const tokenSet = await dispatch(setTokenThunk(res?.data?.access_token));
          await getCurrentUser();
          dispatch(setAuthType({ data: "email" }));
          if (res?.data?.user?.status == 1) {
            dispatch(setIsGuest({ data: false }));
          }
          await handleFetchSetting();
          if (
            cart?.isGuest === true &&
            cart?.guestCart?.length !== 0 &&
            res?.data?.user?.status == 1
          ) {
            await addToBulkCart(res?.data.access_token);
          }
          await fetchCart();
          setError("");
          setOtp("");
          setPhoneNumber("");
          setLoading(false);
          setIsOTP(false);
          setShowRegister(false);
          setShowLogin(false);
        }

      } else {
        setLoading(false);
        if (res.message == "email_not_verified") {
          setIsOTP(true);
          toast.error(t("email_not_verified"));
          setOtp("");
        } else if (res.message == "user_does_not_exist") {
          setError(t("user_does_not_exist"));
          // setInputValue("")
          setPassword("");
        } else {
          setError(t("password_not_valid"));
          // setInputValue("")
          setPassword("");
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleEmailVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await api.verifyEmail({ email: email, code: otp });
      if (res.status == 1) {
        const tokenSet = await dispatch(setTokenThunk(res?.data?.access_token));
        await getCurrentUser();
        dispatch(setAuthType({ data: "email" }));
        if (res?.data?.user?.status == 1) {
          dispatch(setIsGuest({ data: false }));
        }
        await handleFetchSetting();
        if (
          cart?.isGuest === true &&
          cart?.guestCart?.length !== 0 &&
          res?.data?.user?.status == 1
        ) {
          await addToBulkCart(res?.data?.access_token);
        }
        await fetchCart();
        // props.setShow(false)
        setIsOTP(false);
        setShowLogin(false);
      } else {
        setError(res.message);
        toast.error(res.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const addToBulkCart = async () => {
    try {
      const variantIds = cart?.guestCart?.map((p) => p.product_variant_id);
      const quantities = cart?.guestCart?.map((p) => p.qty);
      const response = await api.addToBulkCart({
        variant_ids: variantIds.join(","),
        quantities: quantities.join(","),
      });
      if (response.status == 1) {
        dispatch(setGuestCartTotal({ data: 0 }));
        dispatch(addtoGuestCart({ data: [] }));
        dispatch(setCartSubTotal({ data: response.sub_total }));
      } else {
        console.log("Error while adding bulk products");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    if (setting?.phone_auth_password == 1) {
      if (
        phoneNumber?.length < countryCode.length ||
        phoneNumber?.slice(1) === countryCode
      ) {
        setError(t("please_enter_phone_number"));
        setLoading(false);
        return
      } else if (!phonePassword) {
        setError(t("please_enter_password"))
        return
      } else {
        loginApiCall(null, phoneNumberWithoutCountryCode, fcmToken, "phone")
      }
    } else {
      handleSendOTP(e)
    }
  }

  const renderPhoneInput = () => (
    <>
      {error ? <p className="text-center text-xs text-red-500 my-2 font-semibold">{error}</p> : <></>
      }
      <form onSubmit={handlePhoneLogin}>
        <div className="flex flex-col gap-4">
          <PhoneInput
            inputStyle={{ direction: language?.type }}
            country={
              defaultCountry
            }
            value={phoneNumber}
            onChange={(phone, data) =>
              handlePhoneNoChange(phone, data)
            }
            onCountryChange={(code) => setCountryCode(code)}
            inputProps={{
              name: "phone",
              required: true,
              autoFocus: true,
            }}
          />
          {setting?.phone_auth_password == 1 && (
            <form className="flex flex-col relative">
              <input
                type={showPassword ? "text" : "password"}
                value={phonePassword}
                onChange={(e) => setPhonePassword(e.target.value)}
                className="border-[#CACACA] border-[1px] py-2 px-4 rounded-sm w-full "
                placeholder={t("passwordMessage")}
              />
              <div
                className="absolute right-[10px] top-[12px]"
                onClick={handlePasswordShow}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </div>
              <div className="text-base font-medium leading-6 mt-2 text-right">
                <p
                  className="cursor-pointer"
                  onClick={(e) => handleShowForgotPassword("phone")}
                >
                  {t("forget_password_?")}
                </p>
              </div>
            </form>)}
        </div>
        <button
          disabled={loading}
          type="submit"
          className="bg-[#29363F] disabled:bg-[#29363A] w-full px-4 py-2 text-white rounded-sm text-xl font-normal mt-4"
        >
          {loading ? t("loading") : t("continue")}
        </button>
        {setting?.phone_auth_password == 1 &&
          <h2 className="mt-1 block md:flex justify-start md:justify-center gap-0 md:gap-1 text-base font-medium text-center">
            {t("registerMsg")}
            <p
              onClick={() => handleShowRegister('number')}
              className="primaryColor text-base font-medium underline ml-[2px] cursor-pointer"
            >
              {t("registerNow")}
            </p>
          </h2>
        }
      </form>
    </>
  )

  const renderEmailInput = () => (
    <>
      {error ? <p className="text-center text-xs text-red-500 my-2 font-semibold">{error}</p> : <></>}

      <form className="relative" onSubmit={handleEmailLogin}>
        <input
          value={email}
          onChange={(e) =>
            handleEmailChange(e.target.value, {})
          }
          className="border-black border-[1px] py-2 px-4 rounded-sm w-full "
          placeholder={t("email_placeholder")}
          ref={inputRef}
        />

        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-black border-[1px] py-2 px-4 rounded-sm w-full mt-4"
          placeholder={t("passwordMessage")}
        />
        <div
          className="absolute right-[10px] top-[72px]"
          onClick={handlePasswordShow}
        >
          {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
        </div>
        <div className="text-base font-medium leading-6 mt-2 text-right">
          <p
            className="cursor-pointer"
            onClick={(e) => handleShowForgotPassword("email")}
          >
            {t("forget_password_?")}
          </p>
        </div>
        <button
          disabled={loading}
          type="submit"
          className="bg-[#29363F] disabled:bg-[#29363A] w-full px-4 py-2 text-white rounded-sm text-xl font-normal mt-4"
        >
          {loading ? t("loading") : t("continue")}
        </button>
        <h2 className="mt-1 block md:flex justify-start md:justify-center gap-0 md:gap-1 text-base font-medium text-center">
          {t("registerMsg")}
          <p
            onClick={() => handleShowRegister('email')}
            className="primaryColor text-base font-medium underline ml-[2px] cursor-pointer"
          >
            {t("registerNow")}
          </p>
        </h2>
      </form>
    </>
  )

  return (
    <>
      <Dialog open={showLogin}>
        <DialogContent className="overflow-y-auto overflow-x-hidden">
          <DialogHeader className="flex justify-between items-center flex-row">
            <div>

              <h1 className='text-3xl font-bold'>{t("login")}</h1>
            </div>
            {/* <div className="relative aspect-square object-cover h-[68px] w-[72px]">
              <Image
                src={setting?.web_settings?.web_logo}
                alt="logo"
                fill
                className="aspect-square w-full h-full object-cover"
              />
            </div> */}
            <div>
              <IoIosCloseCircle size={32} onClick={() => handleHideLogin()} />
            </div>
          </DialogHeader>
          <div className="">
            <div className="my-6">
              {isOTP ? (
                <>
                  <div className="flex flex-col ">
                    <h5 className="text-[22px] text-wrap font-bold textColor">
                      {t("enter_verification_code")}
                    </h5>
                    <span className="flex flex-col text-start item-start ">
                      {t("otp_send_message")}
                      <p className="font-weight-bold py-2">
                        {inputType == "email" ? (
                          <div className="flex gap-2">{t('email')}: {email}</div>
                        ) : (
                          <div className="flex gap-2">{t("phone")}: {phoneNumber}</div>
                        )}
                      </p>
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col ">
                  <h5 className="text-[40px] font-bold textColor">
                    {t("welcome")}
                  </h5>
                  {(setting?.email_login == 1 || setting?.phone_login == 1) && (
                    <span className="textColor text-xs">
                      {t("login_message")}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div>
              {isOTP ? (
                <form
                  onSubmit={
                    inputType == "email"
                      ? handleEmailVerify
                      : handleOtpVerification
                  }
                >
                  <div className="overflow-auto p-0 flex items-center justify-center flex-col ">
                    {error ? <p className="text-center text-xs text-red-500">{error}</p> : <></>}
                    <OtpInput
                      className=" mx-auto items-center flex flex-wrap justify-center p-0"
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      inputType="number"
                      renderInput={(props) => (
                        <input
                          {...props}
                          className="border border-gray-300 mx-1 md:mx-2 rounded-sm  bg text-center 
                                      p-2 w-10 md:w-[62px] mt-6 "
                          style={{
                            fontSize: "16px",
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="mt-8 flex justify-center ">
                    <button
                      className="w-full bg-[#29363F] text-white text-xl py-2 rounded-sm"
                      type="submit"
                    >
                      {loading == true ? t("loading") : t("login")}
                    </button>
                  </div>
                  {inputType == "number" && <div className="mt-2 text-center">
                    <div className="text-base font-medium flex gap-1 justify-center my-2">
                      <button onClick={handleSendOTP} disabled={otpDisabled}>
                        {timer === 0 ? (
                          `Resend OTP`
                        ) : (
                          <>
                            {t("resetOtpIn")} <strong> {formatTime(timer)} </strong>{" "}
                          </>
                        )}
                      </button>
                    </div>
                  </div>}

                </form>
              ) : (
                <>
                  <div
                    className="my-4 flex flex-col gap-2 "
                  >
                    {setting?.email_login == 1 && setting?.phone_login == 1 ? (
                      inputType == "number" ?
                        renderPhoneInput()
                        :
                        renderEmailInput()
                    ) : setting?.phone_login == 1 ? (
                      renderPhoneInput()
                    ) : setting?.email_login == 1 ? (
                      renderEmailInput()
                    ) : (
                      <></>
                    )}
                  </div>



                  {setting?.google_login == 1 &&
                    (setting?.email_login == 1 || setting?.phone_login == 1) ? (
                    <div className="flex items-center justify-between my-4 gap-2">
                      <hr className="flex-grow border-t-2 border-dashed border-gray-300" />
                      <span className=" text-[#4B6272] font-bold text-base">
                        {t("or")}
                      </span>
                      <hr className="flex-grow border-t-2 border-dashed border-gray-300" />
                    </div>
                  ) : (
                    <></>
                  )}
                  {setting?.google_login == 1 && (
                    <>
                      <div className="my-4">
                        <button
                          onClick={handleGoogleLogin}
                          className="w-full border-[1px] py-2  px-4 rounded-sm  gap-2 flex items-center justify-center text-base font-normal"
                        >
                          <Image
                            src={GoogleLogo}
                            alt="Google logo"
                            height={30}
                            width={30}
                            className="h-[30px] w-[30px] object-cover "
                          />{" "}
                          {t("continue_with_google")}
                        </button>
                      </div>
                    </>
                  )}
                  {setting?.email_login == 1 && inputType == "number" && (
                    <>
                      <div className="my-4">
                        <button
                          onClick={() => {
                            setError("")
                            setInputType("email")
                          }}
                          // onClick={handleGoogleLogin}
                          className="w-full border-[1px] py-2  px-4 rounded-sm  gap-2 flex items-center justify-center text-base font-normal"
                        >
                          <FaRegEnvelope size={30} className="h-[30px] w-[30px]" />
                          {" "}
                          {t("continue_with_email")}
                        </button>
                      </div>
                    </>
                  )}
                  {setting?.phone_login == 1 && inputType == "email" && (
                    <>
                      <div className="my-4">
                        <button
                          onClick={() => {
                            setInputType("number");
                            setEmail("");
                            setPassword("");
                            setError("");
                          }}
                          // onClick={handleGoogleLogin}
                          className="w-full border-[1px] py-2  px-4 rounded-sm  gap-2 flex items-center justify-center text-base font-normal"
                        >
                          <FiPhone size={30} className="h-[30px] w-[30px]" />
                          {" "}
                          {t("continue_with_phone")}
                        </button>
                      </div>
                    </>
                  )}
                  <div className="py-6 flex items-center justify-center">
                    <p className=" text-center ">
                      {t("agreement_updated_message")} {setting?.web_setting?.site_title} {t("terms_of_service")} {t("and")} {t("privacy_policy")}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div id="recaptcha-container" style={{ display: "none" }}></div>
        </DialogContent >
      </Dialog >
      <NewUserModal
        showNewUser={showNewUser}
        setShowNewUser={setShowNewUser}
        setPhoneNumberWithoutCountryCode={setPhoneNumberWithoutCountryCode}
        setEmail={setEmail}
        setUserName={setUserName}
        userName={userName}
        email={email}
        phoneNumberWithoutCountryCode={phoneNumberWithoutCountryCode}
        countryCode={countryCode}
        setIsOTP={setIsOTP}
      />
      <Register
        setShowRegister={setShowRegister}
        showRegister={showRegister}
        setIsOTP={setIsOTP}
        email={email}
        setEmail={setEmail}
        setOtp={setOtp}
        inputType={inputType}
        setTimer={setTimer}
        setShowLogin={setShowLogin}
      />
      <ForgetPasswordModal
        showForgetPassword={showForgetPassword}
        setShowForgetPassword={setShowForgetPassword}
        forgotPasswordType={forgotPasswordType}
        isErrorMessage={isErrorMessage}
      />
    </>
  );
}

export default Login;
