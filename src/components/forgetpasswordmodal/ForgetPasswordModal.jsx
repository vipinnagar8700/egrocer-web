import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import { IoIosCloseCircle } from 'react-icons/io'
import { t } from '@/utils/translation'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import * as api from "@/api/apiRoutes"
import { toast, ToastContainer } from 'react-toastify'
import PhoneInput from "react-phone-input-2";
import { useSelector } from 'react-redux'
import { signInWithPhoneNumber } from 'firebase/auth'
import FirebaseData from '@/utils/firebase'



const ForgetPasswordModal = ({ showForgetPassword, setShowForgetPassword, forgotPasswordType, isErrorMessage }) => {

    const { auth, app, messaging } = FirebaseData();

    const language = useSelector(state => state.Language.selectedLanguage);
    const defaultCountry = process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE || "in";
    const setting = useSelector((state) => state.Setting.setting);
    const [stage, setStage] = useState(0)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [countryCode, setCountryCode] = useState(null);
    const [phoneNumberWithoutCountryCode, setPhoneNumberWithoutCountryCode] =
        useState("");
    const [error, setError] = useState("");

    const handleOtpChange = (e) => {
        setOtp(e.target.value)
    }


    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value)
    }
    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleShowConfirmPassword = () => {
        setShowConfirmPass(!showConfirmPass)
    }

    const handleShowModal = () => {
        setStage(0)
        setLoading(false);
        setPhoneNumber(null)
        setEmail(null)
        setShowForgetPassword(false)
    }

    const handleForgetPassword = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            const res = await api.forgotPasswordOTP({ email: email });
            if (res.status == 1) {
                setStage(1);
                toast.success(t("verification_mail_sent_successfully"))
                setLoading(false)
            } else {
                if (res.message == "email_is_not_registered") {
                    toast.error(t("email_is_not_registered"))
                    setLoading(false)
                } else {
                    setLoading(false)
                    toast.error(res.message)
                }
            }
        } catch (error) {
            setLoading(false)
            console.log("error", error)
        }
    }

    const handleSendOTP = async (e) => {
        setLoading(true);
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
                    // setTimer(90);
                    setLoading(false);
                    setStage(1)
                } catch (error) {
                    console.log("error from send otp", error);
                    setPhoneNumber();
                    setError(error.message);
                    setLoading(false);
                    // setIsOTP(false);
                }
            } else if (setting?.custom_sms_gateway_otp_based == 1) {
                try {
                    const res = await api.sendSms({
                        mobile: phoneNumberWithoutSpaces,
                    });

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
                setLoading(false);
                return true;
            } catch (error) {
                return false;
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

    const handleEmailResetPassword = async (e) => {
        setLoading(true)
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
                toast.error(t("confirm_password_message"))
                setLoading(false)
                return
            }
            const res = await api.forgotPassword({ email: email, otp: otp, password: password, confirmPassword: confirmPassword })
            if (res.status == 1) {
                setConfirmPassword("")
                setOtp("")
                setPassword("")
                setEmail("")
                setShowForgetPassword(false)
                toast.success(res.message)
                setStage(0);
                setLoading(false)
            } else {
                setLoading(false)
                setStage(1);
                toast.error(res.message)
            }

        } catch (error) {
            setLoading(false)
            console.log("error", error)
        }
    }

    const handlePhoneNoChange = async (value, data) => {
        const dialCode = data?.dialCode || "";
        const phoneWithoutDialCode = value.startsWith(dialCode)
            ? value.slice(dialCode.length)
            : value;
        setPhoneNumber(`+${value}`);
        setPhoneNumberWithoutCountryCode(phoneWithoutDialCode);
        setCountryCode("+" + dialCode);
    }

    const verifyUser = async (e) => {
        e.preventDefault();
        try {
            const res = await api.verifyUserByPhoneNum({ mobile: phoneNumberWithoutCountryCode, countryCode: countryCode, type: "phone" });
            if (res?.message == "user_already_exist") {
                handleSendOTP(e);
            } else {
                setShowForgetPassword(false)
                setPhoneNumber("")
                toast.error(t("user_already_exist_message"))
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleMobilePasswordChange = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
                toast.error(t("confirm_password_message"))
                setLoading(false)
                return
            }
            const otpRes = await handleOtpVerification(e);
            if (otpRes == false) {
                toast.error(t("invalid_otp"))
                setLoading(false)
                setPassword("")
                setConfirmPassword("")
                return;
            }
            const res = await api.forgotPassword({ phone: phoneNumberWithoutCountryCode, otpMethod: "firebase", type: forgotPasswordType, password: password, confirmPassword })
            if (res.status == 1) {
                toast.success(res.message)
                setOtp(null)
                setPassword("")
                setConfirmPassword("")
                setShowForgetPassword(false)
                setStage(0)
            } else {
                toast.error(res.message)
                setOtp(null)
                setPassword("")
                setConfirmPassword("")
                setShowForgetPassword(false)
                setStage(0)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleResetPassword = async (e) => {
        if (forgotPasswordType == "email") {
            handleEmailResetPassword(e)
        } else {
            handleMobilePasswordChange(e)
        }
    }

    return (
        <Dialog open={showForgetPassword}>
            <DialogContent>
                <DialogHeader className="flex justify-between items-center flex-row">
                    <h1 className='font-bold text-xl'>{t("forget_password")}</h1>
                    <div>
                        <IoIosCloseCircle size={32} onClick={() => handleShowModal()} />
                    </div>
                </DialogHeader>
                <div>
                    {
                        stage == 0 ? <div className='flex flex-col w-full gap-4'>
                            <div className='flex flex-col gap-1'>
                                {isErrorMessage && <p className='text-red-500 font-semibold text-sm'>{t("forget_password_note")}</p>}
                                {forgotPasswordType == "email" ? <> <label htmlFor="email" className='font-semibold'>{t("email")}<span className='text-red-500'>*</span></label>
                                    <input type="email" placeholder={t("emailPlaceholder")} className='p-2 cardBorder rounded-sm outline-none' value={email} onChange={handleEmailChange} /></> : <>
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
                                </>}

                            </div>
                            {forgotPasswordType == "email" ? <button className='primaryBackColor rounded-sm text-white font-medium text-base py-2 ' onClick={handleForgetPassword} disabled={loading}>
                                {loading ? t("loading") : t("get_mail")}
                            </button> : <button className='primaryBackColor rounded-sm text-white font-medium text-base py-2 ' onClick={verifyUser} disabled={loading}>
                                {loading ? t("loading") : t("verify_user")}
                            </button>}

                        </div> : <div className='flex flex-col w-full gap-4'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col gap-1'>
                                    <span className='font-bold text-base'>{t("otp")}<span className='text-red-500'>*</span></span>
                                    <div className=''>
                                        <input type="number" className='py-2 px-4 cardBorder outline-none rounded-sm w-full' placeholder={t("otpPlaceholder")} value={otp} onChange={handleOtpChange} />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <span className='font-bold text-base'>{t("password")}<span className='text-red-500'>*</span></span>
                                    <div className='relative w-full '>
                                        <input type={showPassword ? "text" : "password"} name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm w-full' placeholder={t("please_enter_password")} value={password} onChange={handlePasswordChange} />
                                        <span className='absolute right-3 top-3' onClick={handleShowPassword}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                                    </div>

                                </div>
                                <div className='flex flex-col gap-1'>
                                    <span className='font-bold text-base'>{t("confirmPassword")}<span className='text-red-500'>*</span></span>
                                    <div className='relative w-full '>
                                        <input type={showConfirmPass ? "text" : "password"} name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm w-full' placeholder={t("please_enter_confirm_password")} value={confirmPassword} onChange={handleConfirmPasswordChange} />
                                        <span className='absolute right-3 top-3' onClick={handleShowConfirmPassword}>{showConfirmPass ? <FaEyeSlash /> : <FaEye />}</span>
                                    </div>
                                </div>
                                <button className='primaryBackColor rounded-sm text-white font-medium text-base py-2' onClick={handleResetPassword} disabled={loading}>
                                    {loading ? t("loading") : t("reset_password")}
                                </button>
                            </div>
                        </div>
                    }
                    <div id="recaptcha-container" style={{ display: "none" }}></div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ForgetPasswordModal