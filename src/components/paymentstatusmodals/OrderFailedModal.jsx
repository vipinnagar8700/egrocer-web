import React from 'react'
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import AnimationOne from "@/assets/order_place_animation/order_failed_animation.json"
import { useRouter } from 'next/router';
import { t } from '@/utils/translation';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const OrderFailedModal = ({ showOrderFailed, handleFailedOrder }) => {

    const router = useRouter();


    return (
        <Dialog open={showOrderFailed}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex flex-col relative gap-8">
                        {/* Lottie animations */}

                        <Lottie
                            className="h-44"
                            animationData={AnimationOne}
                            loop={false}
                        />

                        <div className="text-center mt-8">
                            <h1 className="text-2xl">{t("order_failed_description")}</h1>
                            <button
                                className="mt-8 primaryBackColor text-white px-8 py-2 rounded-sm font-bold text-xl"
                                onClick={handleFailedOrder}
                            >
                                {t("home")}
                            </button>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default OrderFailedModal