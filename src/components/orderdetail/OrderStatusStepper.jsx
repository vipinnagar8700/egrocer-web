import React, { useEffect, useState } from "react";
import StatusOne from "@/assets/statusIcons/status_icon_awaiting_payment.svg"
import StatusTwo from "@/assets/statusIcons/status_icon_received.svg"
import StatusThree from "@/assets/statusIcons/status_icon_process.svg"
import StatusFour from "@/assets/statusIcons/status_icon_shipped.svg"
import StatusFive from "@/assets/statusIcons/status_icon_out_for_delivery.svg"
import StatusSix from "@/assets/statusIcons/status_icon_delivered.svg"
import StatusSeven from "@/assets/statusIcons/status_icon_cancel.svg"
import StatusEight from "@/assets/statusIcons/status_icon_returned.svg"
import Image from "next/image";
import { t } from "@/utils/translation"



const OrderStepper = ({ orderDetail }) => {

    const statusMappings = {
        "1": { icon: StatusOne, label: t("paymentPending") },
        "2": { icon: StatusTwo, label: t("order_status_display_name_recieved") },
        "3": { icon: StatusThree, label: t("processed") },
        "4": { icon: StatusFour, label: t("shipped") },
        "5": { icon: StatusFive, label: t("out_for_delivery") },
        "6": { icon: StatusSix, label: t("order_status_display_name_delivered") },
        "7": { icon: StatusSeven, label: t("cancelled") },
        "8": { icon: StatusEight, label: t("returned") },
    };

    const [steps, setSteps] = useState([])
    useEffect(() => {
        handleGetSteps()
    }, [orderDetail])


    const handleGetSteps = () => {
        const updatedSteps = orderDetail?.status?.map(([statusCode, timestamp]) => {
            const status = statusMappings[statusCode] || {};
            return {
                icon: status.icon,
                label: `${t("your_order_has_been")} ${status.label}`,
                timestamp: new Date(timestamp).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }),
            };
        });
        setSteps(updatedSteps);
    };



    return (
        <div className="border rounded-md p-4 ">
            {steps?.map((status, index) => (
                <div
                    key={index}
                    className="flex items-start space-x-4 mb-12 last:mb-0"
                >
                    {/* Icon */}
                    <div className="relative">
                        <div className="w-12 h-12 flex items-center border-4 border-[#273F40] justify-center primaryBackColor  rounded-full">
                            <Image src={status.icon.src} alt="icon" height={0} width={0} className="h-2/3 w-full" />

                        </div>
                        {index < steps.length - 1 && (
                            <div className="absolute top-12 left-1/2 w-2 h-20 md:h-28 lg:h-20 primaryBackColor transform -translate-x-1/2"></div>
                        )}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1" >
                        <p className="font-medium">{status.label}</p>
                        <p className="text-gray-500 text-sm">{status.timestamp}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderStepper;
