import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { isRtl } from "@/lib/utils";
import { useRouter } from "next/router";
import { setFilterCategory } from "@/redux/slices/productFilterSlice";

const HomePageSlider = ({ slider }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const language = useSelector((state) => state.Language.selectedLanguage);
  const rtl = isRtl();

  const handleSliderClick = (slider) => {
    if (slider?.type == "slider_url") {
      window.open(slider?.slider_url, "_blank");
    } else if (slider?.type == "product") {
      router.push(`/product/${slider.type_slug}`);
    } else if (slider?.type == "category") {
      if (slider?.category_data?.has_child == true) {
        router.push(`/categories/${slider?.type_slug}`);
      } else {
        dispatch(setFilterCategory({ data: slider?.type_id.toString() }));
        router.push(`/products`);
      }
    }
  };

  return (
    <div className="w-full mx-auto backgroundColor  ">
      <Swiper
        key={rtl}
        dir={language?.type}
        modules={[Pagination, Autoplay]}
        slidesPerView={1.5}
        centeredSlides={true}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        className="homePageSwiper relative "
      >
        {slider?.sliders?.map((slider, index) => {
          return (
            <SwiperSlide className=" " key={index}>
              <div className="relative">
                <div
                  className="flex flex-col items-center   text-center rounded-xl px-2 py-4 md:py-6
                                 md:px-4 2xl:p-6"
                >
                  <Image
                    src={slider.image_url}
                    alt="Fruit Basket"
                    priority="false"
                    className="swiper-image w-full max-h-[900px] h-[200px] sm:h-[250px] md:h-[380px] lg:h-[570px] 2xl:h-[650px]"
                    width={0}
                    height={0}
                    onClick={() => handleSliderClick(slider)}
                  />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HomePageSlider;
