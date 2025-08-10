import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import Image from 'next/image';
import Link from 'next/link';
import { IoIosCloseCircle } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { setIsPopupSeen } from '@/redux/slices/settingSlice';

const HomeOfferModal = () => {
    const dispatch = useDispatch();
    const setting = useSelector(state => state.Setting)
    const city = useSelector(state => state.City)
    const [isModalOpen, setIsModalOpen] = useState(false);

    // console.log("isModalOpen ->", isModalOpen)
    // console.log("City ->", city)

    useEffect(() => {
        if (setting?.setting?.popup_enabled === "1" && city?.city !== null) {
            if (setting?.setting?.popup_always_show_home === "1") {
                // Always show the modal on every home page visit
                setIsModalOpen(true);
            } else if (setting?.setting?.popup_always_show_home === "0") {
                // Show the modal only once
                const hasPopupBeenSeen = setting?.isPopupSeen;
                // console.log("isPopupSeen", setting?.isPopupSeen)
                if (!hasPopupBeenSeen) {
                    setIsModalOpen(true);
                    // console.log("Showing Popup...")
                }
            }
        }
    }, [setting?.setting?.popup_enabled, setting?.setting?.popup_always_show_home, city?.city]);

    const handleClose = () => {
        setIsModalOpen(false);
        dispatch(setIsPopupSeen({ data: true }));
    };

    return (
        <div>
            <Dialog open={isModalOpen} className="focus-visible:outline-none" >
                <DialogContent className='bg-transparent border-none shadow-none focus-visible:outline-none focus-within:border-none' onInteractOutside={(e) => e.preventDefault()} aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle>
                            <div className='flex justify-end'><IoIosCloseCircle className='w-12 h-12 textColor cursor-pointer' onClick={handleClose} /></div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className='bg-transparent'>
                        <div className='h-full w-full'>
                            <Link href={setting?.setting?.popup_url || "#"} target="_blank" className="focus-visible:outline-none" onClick={handleClose}>
                                <Image src={setting?.setting?.popup_image} alt='Offer image' height={0} width={0} className='h-full w-full object-contain focus-visible:outline-none' />
                            </Link>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default HomeOfferModal