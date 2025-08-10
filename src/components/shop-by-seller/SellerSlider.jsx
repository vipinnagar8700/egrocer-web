import Link from 'next/link'
import React from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import Seller from './Seller'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { t } from '@/utils/translation';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setFilterBySeller } from '@/redux/slices/productFilterSlice';
import { useSelector } from 'react-redux';
import { isRtl } from '@/lib/utils';


const SellerSlider = ({ sellers }) => {
    const rtl = isRtl();
    const language = useSelector(state => state.Language.selectedLanguage)
    const router = useRouter();
    const dispatch = useDispatch();
    const handleSellerClick = (seller) => {
        dispatch(setFilterBySeller({ data: seller?.id }));
        router.push("/products")
    }
    return (
        <section className=' brandBackgroundColor '>
            <div className='container feature-section '>
                <div className='flex flex-col gap-3 ' dir={language?.type}>
                    <div className='flex justify-between items-center'>
                        <h2 className='textColor text-xl sm:text-3xl font-extrabold tracking-[2px] leading-[29px] m-0'>{t("shop_by")} {t("sellers")} </h2>
                        {sellers?.sellers?.length > 4 &&
                            <div className='flex gap-4 items-center flex-col md:flex-row'>
                                <Link href={"/sellers"} className='hover:primaryColor'>{t("see_all")}</Link>
                                <div className={` md:flex hidden gap-2 ${language?.type == "RTL" ? "flex-row-reverse" : ""}`}>
                                    <button className=' group seller-slider-prev  textColor swiperBorderColor rounded-full p-2 hover:primaryBackColor hover:text-white  transition-all duration-200 ease-linear hover:primaryBorder'><IoMdArrowBack className='swiperNavButtonColor group-hover:text-white transition-colors duration-200' size={20} /></button>
                                    <button className=' group seller-slider-next  textColor swiperBorderColor rounded-full p-2 hover:primaryBackColor hover:text-white  transition-all duration-200 ease-linear hover:primaryBorder'><IoMdArrowForward className='swiperNavButtonColor group-hover:text-white transition-colors duration-200' size={20} /></button>
                                </div>
                            </div>
                        }
                    </div>
                    <div className='mt-6'>
                        <Swiper
                            key={rtl}
                            spaceBetween={20}
                            modules={[Navigation]}
                            navigation={{
                                prevEl: ".seller-slider-prev",
                                nextEl: ".seller-slider-next"
                            }}
                            className="brand-swiper"
                            breakpoints={{
                                0: { slidesPerView: 1.2, spaceBetween: 10 },
                                320: { slidesPerView: 1.2, spaceBetween: 10 },
                                375: { slidesPerView: 1.5, spaceBetween: 12 },
                                640: { slidesPerView: 3, spaceBetween: 15 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                        >
                            {sellers?.sellers?.map((seller, index) => (
                                <SwiperSlide key={seller.id} onClick={() => handleSellerClick(seller)} >
                                    <Seller seller={seller} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default SellerSlider;