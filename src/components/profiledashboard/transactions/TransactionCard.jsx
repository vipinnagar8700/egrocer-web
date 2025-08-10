import React from 'react'
import PayPalLogo from "@/assets/payment_methods_svgs/ic_paypal.svg"
import Image from 'next/image'
import { t } from "@/utils/translation"
import { formatCustomDate } from "@/lib/utils"

import CashfreeImage from "@/assets/payment_methods_svgs/ic_cashfree.svg";
import RazorpayImage from "@/assets/payment_methods_svgs/ic_razorpay.svg";
import PaypalImage from "@/assets/payment_methods_svgs/ic_paypal.svg";
import PaystackImage from "@/assets/payment_methods_svgs/ic_paystack.svg";
import StriperImage from "@/assets/payment_methods_svgs/ic_stripe.svg";
import MidtransImage from "@/assets/payment_methods_svgs/Midtrans.svg";
import PhonePeImage from "@/assets/payment_methods_svgs/Phonepe.svg";
import PaytabsImage from "@/assets/payment_methods_svgs/ic_paytabs.svg";
import { useSelector } from 'react-redux'


const TransactionCard = ({ transaction }) => {

    const setting = useSelector(state => state.Setting.setting)

    const paymentMethodsConfig = {
        Razorpay: RazorpayImage,
        Paypal: PaypalImage,
        Paystack: PaystackImage,
        Stripe: StriperImage,
        Cashfree: CashfreeImage,
        Midtrans: MidtransImage,
        Phonepe: PhonePeImage,
        Paytabs: PaytabsImage,
    };

    return (
        <div className='col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-4'>
            <div className="border rounded-lg  cardBorder p-4 m-4 md:m-2 lg:m-1.5">
                {/* Header: Transaction ID and Date */}
                <div className="flex justify-between  text-sm mb-3">
                    <div>
                        <p className="font-semibold">{t("transaction")}</p>
                        <p className=" font-bold">{transaction?.id}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">{t("date")}</p>
                        <p className="">{formatCustomDate(transaction?.created_at)}</p>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-center gap-2 border-t pt-3 pb-3">
                    <Image
                        src={paymentMethodsConfig[transaction.type]}
                        alt="PayPal"
                        className="h-10 w-10"
                        height={0}
                        width={0}
                    />
                    <div>
                        <p className=" text-sm">{t("payment_method")}</p>
                        <p className=" font-semibold">{transaction?.type}</p>
                    </div>
                </div>

                {/* Transaction Amount Section */}
                <div className=" p-1 rounded-lg flex justify-between items-center backgroundColor">
                    <div>
                        <p className=" text-sm">{t("transaction")} {t("amount")}</p>
                        <p className="text-2xl font-bold">{setting?.currency}{transaction?.amount?.toFixed(2)}</p>
                    </div>
                    <div>
                        {transaction?.status == "success" ? <span className="border border-green-500 text-green-500 font-bold text-sm py-1 px-2 rounded">
                            {t("success")}
                        </span>
                            :
                            <span className="border border-red-500 text-red-500 font-bold text-sm py-1 px-2 rounded">
                                {t("failed")}
                            </span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionCard