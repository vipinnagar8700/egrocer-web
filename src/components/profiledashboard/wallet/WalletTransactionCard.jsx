import { t } from '@/utils/translation'
import React from 'react'
import { formatCustomDate } from "@/lib/utils"
import { useSelector } from 'react-redux'

const WalletTransactionCard = ({ transaction }) => {
    const setting = useSelector(state => state.Setting.setting)
    return (
        <div >
            <div className="border rounded-lg cardBorder p-4 m-4 md:p-2 lg:p-1.7">
                {/* Header: Transaction ID and Date */}
                <div className="flex justify-between  text-sm mb-3">
                    <div>
                        <p className="font-semibold text-nowrap">{t("transaction_id")}</p>
                        <p className=" font-bold">{transaction?.id}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold break-words">{t("date")}</p>
                        <p className="">{formatCustomDate(transaction?.created_at)}</p>
                    </div>
                </div>

                {/* Message Section */}
                <div className="border-t pt-3 mb-4">
                    <p className="font-semibold  mb-1">{t("message")}</p>
                    <p className="font-bold  leading-snug line-clamp-1">
                        {transaction?.message}
                    </p>
                </div>

                {/* Transaction Amount Section */}
                <div className=" p-3 rounded-lg flex justify-between items-center backgroundColor">
                    <div>
                        <p className=" text-sm">{t("transaction")} {t("amount")}</p>
                        <p className="text-2xl font-bold">{setting?.currency}{transaction?.amount?.toFixed(2)}</p>
                    </div>
                    <div>
                        {
                            transaction?.type == "credit" ? <span className="border border-green-500 text-green-500 font-bold text-sm py-1 px-2 rounded">
                                {t("credit")}
                            </span> : <span className="border border-red-500 text-red-500 font-bold text-sm py-1 px-2 rounded">
                                {t("debit")}
                            </span>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletTransactionCard