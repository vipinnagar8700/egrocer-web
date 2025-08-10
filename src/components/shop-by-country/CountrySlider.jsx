import Link from 'next/link'
import React from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Country from './Country';
import { t } from '@/utils/translation';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { isRtl } from '@/lib/utils';
import { setFilterByCountry } from '@/redux/slices/productFilterSlice';

const CountrySlider = ({ countries }) => {
    const router = useRouter()
    const rtl = isRtl();
    const dispatch = useDispatch()
    const handleCountryClick = (country) => {
        dispatch(setFilterByCountry({ data: country?.id }));
        router.push(`/products`)
    }

    const language = useSelector(state => state.Language.selectedLanguage)

    return (
        <section>
            <div className='container feature-section'>
                <div className='flex flex-col gap-3' dir={language?.type}>
                    <div className='flex justify-between items-center'>
                        <h2 className='textColor text-xl sm:text-3xl font-extrabold tracking-[2px] leading-[29px] m-0'>{t("shop_by")} {t("countries")} </h2>
                        <div className='flex gap-4 items-center flex-col md:flex-row text-nowrap'>
                            <Link href={"/countries"} className='hover:primaryColor'>{t("see_all")}</Link>
                            <div className={` md:flex hidden gap-2 ${language?.type == "RTL" ? "flex-row-reverse" : ""}`}>
                                <button className=' group swiperBorderColor rounded-full p-2 country-prev hover:primaryBackColor hover:text-white hover:primaryBorder'><IoMdArrowBack className='swiperNavButtonColor group-hover:text-white transition-colors duration-200' size={20} /></button>
                                <button className=' group swiperBorderColor rounded-full p-2 country-next hover:primaryBackColor hover:text-white hover:primaryBorder'><IoMdArrowForward className='swiperNavButtonColor group-hover:text-white transition-colors duration-200' size={20} /></button>
                            </div>
                        </div>
                    </div>
                    <div className='mt-6'>
                        <Swiper
                            key={rtl}
                            spaceBetween={20}
                            modules={[Navigation]}
                            className="brand-swiper"
                            navigation={{
                                prevEl: ".country-prev",
                                nextEl: ".country-next"
                            }}
                            breakpoints={{
                                0: { slidesPerView: 1.7, spaceBetween: 10 },
                                320: { slidesPerView: 2.2, spaceBetween: 10 },
                                375: { slidesPerView: 2.5, spaceBetween: 12 },
                                640: { slidesPerView: 3, spaceBetween: 15 },
                                1024: { slidesPerView: 6, spaceBetween: 20 },
                            }}
                        >
                            {countries?.countries?.map((country, index) => (
                                <SwiperSlide key={country.id} onClick={() => handleCountryClick(country)}>
                                    <Country country={country} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CountrySlider