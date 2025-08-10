import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CiWallet } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { t } from "@/utils/translation";
import { setCurrentStep, setPaymentMethod, setUserWalletBalance, setWalletChecked } from "@/redux/slices/checkoutSlice";

import CashOnDeliveryImage from "@/assets/payment_methods_svgs/ic_cod.svg";
import CashfreeImage from "@/assets/payment_methods_svgs/ic_cashfree.svg";
import RazorpayImage from "@/assets/payment_methods_svgs/ic_razorpay.svg";
import PaypalImage from "@/assets/payment_methods_svgs/ic_paypal.svg";
import PaystackImage from "@/assets/payment_methods_svgs/ic_paystack.svg";
import StriperImage from "@/assets/payment_methods_svgs/ic_stripe.svg";
import MidtransImage from "@/assets/payment_methods_svgs/Midtrans.svg";
import PhonePeImage from "@/assets/payment_methods_svgs/Phonepe.svg";
import PaytabsImage from "@/assets/payment_methods_svgs/ic_paytabs.svg";

const paymentMethodsConfig = [
    { key: "razorpay_payment_method", label: "razorpay", image: RazorpayImage },
    { key: "paypal_payment_method", label: "paypal", image: PaypalImage },
    { key: "paystack_payment_method", label: "paystack", image: PaystackImage },
    { key: "stripe_payment_method", label: "stripe", image: StriperImage },
    { key: "cashfree_payment_method", label: "cashfree", image: CashfreeImage },
    { key: "midtrans_payment_method", label: "midtrans", image: MidtransImage },
    { key: "phonepay_payment_method", label: "phonepe", image: PhonePeImage },
    { key: "paytabs_payment_method", label: "paytabs", image: PaytabsImage },
];

const CheckoutPayment = ({ checkoutData }) => {
    const dispatch = useDispatch();
    const setting = useSelector((state) => state.Setting);
    const checkout = useSelector((state) => state.Checkout);
    const user = useSelector((state) => state.User)
    const cart = useSelector((state) => state.Cart)
    const methodsContainerRef = useRef(null);
    const [walletBalance, setWalletBalance] = useState(null)

    useEffect(() => {
        if (checkout?.isWalletChecked) {
            setWalletBalance(checkout?.usedWalletBalance - user?.user?.balance)
        } else {
            setWalletBalance(user?.user?.balance)

        }
    }, [user])

    const handleSelectedPaymentMethod = (value) => {
        dispatch(setPaymentMethod({ data: value }));
    };

    const enabledPaymentMethods = paymentMethodsConfig.filter(
        (method) =>
            setting?.payment_setting?.[method.key] &&
            setting?.payment_setting?.[method.key] === "1"
    );

    // Function to find the selected method element
    const scrollToSelectedMethod = () => {
        if (!methodsContainerRef.current) return;
        const selectedMethod = methodsContainerRef.current.querySelector(
            `[data-method="${checkout?.selectedPaymentMethod}"]`
        );
        if (selectedMethod) {
            selectedMethod.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    };

    // Effect to trigger scroll when selected method changes
    useEffect(() => {
        if (checkout?.selectedPaymentMethod) {
            scrollToSelectedMethod();
        }
    }, [checkout?.selectedPaymentMethod]);


    const handleWalletCheck = async () => {
        if (!checkout?.isWalletChecked) {
            if (user?.user?.balance >= checkoutData?.total_amount) {
                dispatch(setPaymentMethod({ data: "wallet" }))
                dispatch(setUserWalletBalance({ data: checkout?.checkoutTotal }))
                setWalletBalance(walletBalance - checkout?.checkoutTotal)
            } else if (user?.user?.balance <= checkoutData?.total_amount) {
                setWalletBalance(0)
                dispatch(setUserWalletBalance({ data: user?.user?.balance }))
            }
        } else {
            dispatch(setPaymentMethod({ data: null }))
            if (walletBalance == 0) {
                setWalletBalance(user?.user?.balance)
            }
            else if (user?.user?.balance >= checkout?.checkoutTotal) {
                setWalletBalance(walletBalance + checkoutData?.total_amount)
            } else {
                setWalletBalance(user?.user?.balance)
            }
        }
        dispatch(setWalletChecked({ data: !checkout?.isWalletChecked }))
    }



    return (
        <div>
            <div className="flex flex-col cardBorder rounded-sm w-full">
                <div className="flex justify-between backgroundColor p-4">
                    <span className="font-bold text-xl">{t("choose_payment_method")}</span>
                </div>
                <div className="p-4 flex flex-col gap-2">
                    {user?.user?.balance >= 1 && <div className="flex flex-col gap-3 mb-3">
                        <div className="flex justify-between">
                            <p className="text-base font-bold">{t("your_wallet")}</p>
                            <div className="flex gap-2 items-center">
                                <input type="checkbox" className="h-4 w-4" onChange={handleWalletCheck} checked={checkout?.isWalletChecked} />
                                <p>{t("use_wallet_balance")}</p>
                            </div>
                        </div>
                        <div className="rounded backgroundColor flex justify-between items-center p-2">
                            <div className="flex gap-4 items-center font-medium text-base">
                                <CiWallet size={40} className="addToCartColor p-1 rounded-sm" />
                                {t("walletBalance")}
                            </div>
                            <div className="font-bold text-xl">{setting?.setting?.currency}{walletBalance?.toFixed(2)}</div>
                        </div>
                    </div>}
                    {checkout?.selectedPaymentMethod == "wallet" ? <></> : <div className="flex flex-col gap-3">
                        <h1 className="text-base font-bold">{t("payment_method")}</h1>
                        <div ref={methodsContainerRef} className="flex flex-col gap-2 h-full">
                            {checkoutData?.cod_allowed == "1" && (
                                <div
                                    data-method="COD"
                                    className={`p-2 flex justify-between items-center cardBorder rounded-sm ${checkout?.selectedPaymentMethod === "COD"
                                        ? "addToCartColor"
                                        : ""
                                        }`}
                                >
                                    <div className="flex gap-2 items-center">
                                        <Image
                                            src={CashOnDeliveryImage}
                                            className="h-8 w-8"
                                            height={0}
                                            width={0}
                                            alt={t("cod")}
                                        />
                                        <p className="font-medium text-base">{t("cash_on_delivery")}</p>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            className="h-6 w-6 mt-2"
                                            onChange={() => handleSelectedPaymentMethod("COD")}
                                            checked={checkout?.selectedPaymentMethod === "COD"}
                                        />
                                    </div>
                                </div>
                            )}
                            {enabledPaymentMethods.map((method) => (
                                <div
                                    key={method.key}
                                    data-method={method.label}
                                    className={`p-2 flex justify-between items-center cardBorder rounded-sm ${checkout?.selectedPaymentMethod === method.label
                                        ? "addToCartColor"
                                        : ""
                                        }`}
                                >
                                    <div className="flex gap-2 items-center">
                                        <Image
                                            src={method.image}
                                            className="h-8 w-8"
                                            height={0}
                                            width={0}
                                            alt={t(method.label)}
                                        />
                                        <p className="font-medium text-base">{t(method.label)}</p>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            className="h-6 w-6 mt-2"
                                            onChange={() => handleSelectedPaymentMethod(method.label)}
                                            checked={checkout?.selectedPaymentMethod === method.label}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                className="cardBorder px-4 py-2 rounded-sm text-xl font-normal"
                                onClick={() => dispatch(setCurrentStep({ data: 2 }))}
                            >
                                {t("previous")}
                            </button>
                        </div>
                    </div>}

                </div>
            </div>
        </div>
    );
};

export default CheckoutPayment;