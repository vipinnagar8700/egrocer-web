import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import Image from "next/image";
import { t } from "@/utils/translation"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import GoogleLogo from "@/assets/googleLogin.svg"
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoIosCloseCircle } from 'react-icons/io';
import * as api from "@/api/apiRoutes"
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthType } from '@/redux/slices/userSlice';
import FirebaseData from '@/utils/firebase';
import { signInWithPhoneNumber } from 'firebase/auth';


const Register = ({ showRegister, setShowRegister, setIsOTP, email, setEmail, inputType, setTimer, setShowLogin }) => {

    const { auth, app, messaging } = FirebaseData();
    const dispatch = useDispatch();
    const fcmToken = useSelector(state => state.User?.fcm_token)
    const setting = useSelector(state => state.Setting.setting)
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => {
        setCountryCode(process.env.NEXT_PUBLIC_COUNTRY_DIAL_CODE)
    }, [])
    const [name, setName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [phoneNumberWithoutCountryCode, setPhoneNumberWithoutCountryCode] = useState(null)
    const [password, setPassword] = useState("")
    const [countryCode, setCountryCode] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [errorType, setErrorType] = useState("");
    const [isPhoneOtp, setIsPhoneOtp] = useState(false);
    const [otp, setOtp] = useState(null);

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleShowConfirmPassword = () => {
        setShowConfirmPass(!showConfirmPass)
    }

    const handleUsernameChange = (e) => {
        setName(e.target.value)
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value)
    }

    const handlePhoneNumberChange = (value, data) => {
        const phoneWithoutDialCode = value.startsWith(data?.dialCode)
            ? value.slice(data.dialCode.length)
            : value;
        setPhoneNumber(`+${value}`);
        setPhoneNumberWithoutCountryCode(phoneWithoutDialCode);
        setCountryCode("+" + (data?.dialCode || ""));
    }

    const handleUserRegister = async (e) => {
        const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        e.preventDefault();

        try {
            if (!name) {
                setError(t("please_enter_name"))
                setErrorType("name")
                return;
            }
            else if (inputType == "email" && !emailRegexPattern.test(email)) {
                setError(t("please_enter_email"))
                setErrorType("email")
                return;
            } else if (!password) {
                setError(t("please_enter_password"))
                setErrorType("password")
                return;
            }
            else if (password.length < 6) {
                setError(t("password_length_msg"))
                setErrorType("password")
                return;
            } else if (!confirmPassword) {
                setError(t("please_enter_confirm_password"))
                setErrorType("confirmpassword")
                return;
            } else if (confirmPassword !== password) {
                setError(t("confirm_password_message"))
                setErrorType("confirmpassword")
                return;
            } else {
                if (inputType == "number") {
                    await handleSendOTP(e);
                    setError("")
                    setErrorType("")
                } else {
                    await handleEmailRegister(e)
                }
            }
        } catch (error) {
            console.log("error", error)
        }
    }



    const handleMobileRegister = async (e) => {
        const otpRes = await handleOtpVerification(e);
        if (!otpRes) {
            toast.error(t("invalid_otp"));
            return;
        }
        setIsLoading(true);
        e.preventDefault();
        try {
            const res = await api.registerUser({ id: phoneNumberWithoutCountryCode, name: name, email: email, mobile: phoneNumberWithoutCountryCode, type: 'phone', country_code: countryCode, password: password, fcm: fcmToken, phoneAuthType: true })
            if (res?.status == 1) {
                toast.success(t("succesfull_register_message"))
                handleCloseRegister();
                setIsLoading(false);
            } else {
                setIsLoading(false);
                toast.error(t(res?.message))
                setShowRegister(false);
                setIsPhoneOtp(false);
                setOtp(null)
                setPassword("")
                setConfirmPassword("")
                setPhoneNumber("")
                setPhoneNumberWithoutCountryCode("")
                setName("")
                setEmail("")
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleSendOTP = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (
            phoneNumber?.length < countryCode.length ||
            phoneNumber?.slice(1) === countryCode
        ) {
            setError("Please enter phone number!");
            setErrorType("phone")
            setIsLoading(false);
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
                    setIsLoading(false);
                    setIsPhoneOtp(true);
                    setShowLogin(false);
                } catch (error) {
                    setError(error.message);
                    console.log("error", error)
                    setIsLoading(false);
                    setIsPhoneOtp(false);
                }
            } else if (setting?.custom_sms_gateway_otp_based == 1) {
                try {
                    const res = await api.sendSms({
                        mobile: phoneNumberWithoutSpaces
                    });
                    if (res?.status == 1) {
                        // setTimer(90);
                        setIsPhoneOtp(true);
                        setIsLoading(false);
                        setShowRegister(false);
                    } else {
                        setError(t("custom_send_sms_error_message"));
                        setIsLoading(false);
                    }
                } catch (error) {
                    setPhoneNumber();
                    setError(t("custom_send_sms_error_message"));
                    setIsLoading(false);
                }
            } else {
                toast.error(t("Something went wrong"));
                setIsLoading(false);
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
            setIsLoading(true);
            try {
                const user = await window.confirmationResult.confirm(otp);
                setIsLoading(false);
                return true;
            } catch (error) {
                setIsLoading(false);
                return false;
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
                    res?.message ==
                    "OTP is valid, but no user found with this phone number."
                ) {
                    return false;
                } else if (response?.status == 1) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.log("error", error);
            }
        }
    };

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await api.registerUser({ id: email, name: name, email: email, mobile: phoneNumberWithoutCountryCode, type: 'email', country_code: countryCode, password: password, fcm: fcmToken })
            if (res.status == 1) {
                setIsLoading(false)
                dispatch(setAuthType({ data: "email" }))
                setShowRegister(false);
                toast.success(t(res?.message));
                setIsOTP(true);
                setOtp("")
                // setTimer(90)
                setPassword("")
                setName("")
                setPhoneNumberWithoutCountryCode("")
                setConfirmPassword("")
                setPhoneNumber("")
            } else {
                setIsLoading(false)
                // For failed to send verification email
                toast.error(res.message)
                setShowRegister(false);
                setPassword("")
                setName("")
                setConfirmPassword("")
                setPhoneNumber("")
                setPhoneNumberWithoutCountryCode("")
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleOtpChange = (e) => {
        const input = e.target.value;
        // Only allow digits, remove any special characters and limit to 6 characters
        const cleanedInput = input.replace(/[^0-9]/g, '').slice(0, 6);
        setOtp(cleanedInput);
    }

    const handleCloseRegister = (e) => {
        setName("")
        setEmail("")
        setPhoneNumber("")
        setOtp(null)
        setIsPhoneOtp(false)
        setPassword("")
        setConfirmPassword("")
        setShowRegister(false)
        setIsLoading(false)
    }

    return (
        <Dialog open={showRegister} >
            <DialogContent className="overflow-y-auto">
                <DialogHeader className="flex justify-between flex-row items-center">
                    <div className="">
                        <h1 className='text-3xl font-bold'>{t("register")}</h1>
                        {/* <Image src={setting?.web_settings?.web_logo} alt="logo" fill className="aspect-square w-full h-full object-cover" /> */}
                    </div>
                    <div>
                        <IoIosCloseCircle size={32} onClick={handleCloseRegister} />
                    </div>
                </DialogHeader>
                <div>
                    <div className="flex flex-col ">
                        <h5 className="text-[34px] font-bold textColor">{t("welcome")}</h5>
                        <span className="textColor text-xs">{t("signupMessage")}</span>
                    </div>
                    {
                        isPhoneOtp ? <div className='flex flex-col gap-1'>
                            <span className='font-bold text-base'>{t("otp")}<span className='text-red-500'>*</span></span>
                            <div className=''>
                                <input
                                    type="text"
                                    className='py-2 px-4 cardBorder outline-none rounded-sm w-full'
                                    placeholder={t("otpPlaceholder")}
                                    value={otp}
                                    onChange={handleOtpChange}
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    maxLength="6"
                                />
                            </div>
                        </div> : <div className='mt-8 flex flex-col gap-2'>
                            <div className='flex flex-col gap-1'>
                                <span className='font-bold text-base'>{t("name")}<span className='text-red-500'>*</span></span>
                                <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm' placeholder={t("please_enter_name")} value={name} onChange={handleUsernameChange} />
                                {error && errorType == "name" && <span className='text-xs text-red-500'>{error}</span>}
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='font-bold text-base'>{t("email")}{inputType == "email" ? <span className='text-red-500'>*</span> : <></>}</span>
                                <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm' placeholder={t("please_enter_email")} value={email} onChange={handleEmailChange} />
                                {error && errorType == "email" && <span className='text-xs text-red-500'>{error}</span>}
                            </div>
                            <div className='flex flex-col gap-1 pl-0'>
                                <span className='font-bold text-base'>{t("mobileNumber")}{inputType == "number" ? <span className='text-red-500'>*</span> : <></>}</span>
                                <PhoneInput
                                    inputStyle={{ direction: language?.type }}
                                    country={process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE}
                                    value={phoneNumber}
                                    onChange={(phone, data) => handlePhoneNumberChange(phone, data)}
                                    onCountryChange={(code) => setCountryCode(code)}
                                    className='w-full '
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='font-bold text-base'>{t("password")}<span className='text-red-500'>*</span></span>
                                <div className='relative w-full '>
                                    <input type={showPassword ? "text" : "password"} name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm w-full' placeholder={t("please_enter_password")} value={password} onChange={handlePasswordChange} />
                                    <span className='absolute right-3 top-3' onClick={handleShowPassword}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                                    {error && errorType == "password" && <span className='text-xs text-red-500'>{error}</span>}
                                </div>

                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='font-bold text-base'>{t("confirmPassword")}<span className='text-red-500'>*</span></span>
                                <div className='relative w-full '>
                                    <input type={showConfirmPass ? "text" : "password"} name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm w-full' placeholder={t("please_enter_confirm_password")} value={confirmPassword} onChange={handleConfirmPasswordChange} />
                                    <span className='absolute right-3 top-3' onClick={handleShowConfirmPassword}>{showConfirmPass ? <FaEyeSlash /> : <FaEye />}</span>
                                    {error && errorType == "confirmpassword" && <span className='text-xs text-red-500'>{error}</span>}
                                </div>
                            </div>


                        </div>}

                    <div className='mt-4 flex flex-col justify-center text-center gap-3'>
                        {isPhoneOtp ? <button onClick={handleMobileRegister} className="bg-[#29363F] py-2 px-4 text-white text-center rounded-sm text-xl font-normal" disabled={isLoading}>{isLoading ? t("loading") : t("register")}</button> : <button onClick={handleUserRegister} className="bg-[#29363F] py-2 px-4 text-white text-center rounded-sm text-xl font-normal" disabled={isLoading}>{isLoading ? t("loading") : t("verify")}</button>}
                        <span className='text-base font-medium'>{t("alreadyHaveAnAccount")} <span className='primaryColor underline ml-[2px] cursor-pointer' onClick={() => setShowRegister(false)}>{t("signIn")}</span></span>
                    </div>
                    <div className="flex items-center justify-between my-4 gap-2">
                        <hr className="flex-grow border-t-2 border-dashed border-gray-300" />
                        <span className=" text-[#4B6272] font-bold text-base">{t("or")}</span>
                        <hr className="flex-grow border-t-2 border-dashed border-gray-300" />
                    </div>
                    <div className="my-4">
                        <button className="w-full border-[1px] py-2  px-4 rounded-sm  gap-2 flex items-center justify-center text-base font-normal"><Image src={GoogleLogo} alt="Google logo" height={30} width={30} className="h-[30px] w-[30px] object-cover " /> {t("continue_with_google")}</button>
                    </div>
                    <div className="py-6 flex items-center justify-center">
                        <p className=" text-center ">
                            {t("agreement_updated_message")} {setting?.web_setting?.site_title} {t("terms_of_service")} {t("and")} {t("privacy_policy")}
                        </p>
                    </div>
                </div>
                <div id="recaptcha-container" style={{ display: "none" }}></div>
            </DialogContent>
        </Dialog >
    )
}

export default Register