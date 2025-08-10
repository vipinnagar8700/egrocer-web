import React from 'react'
import { useSelector } from 'react-redux'
import HomePageSlider from '@/components/mainslider/MainSlider'
import HorizontalCardContainer from './HorizontalCardContainer';
import VerticleCardContainer from './VerticleCardContainer';
import ProductSwiperWithImage from './ProductSwiperWithImage';
import HorizontalProductSwiper from './HorizontalProductSwiper';
import Categories from '../categories/CategoriesContainer';
import BrandSlider from '../shop-by-brands/BrandSlider';
import CountrySlider from '../shop-by-country/CountrySlider';
import SellerSlider from '../shop-by-seller/SellerSlider';

import HomeOfferSection from './HomeOfferSection';

const FeatureSections = () => {

    const shop = useSelector(state => state.Shop.shop)

    // Advertise banner
    const aboveHomeSlider = shop?.offers?.filter((offer) => offer?.position === "top");
    const BelowHomeSlider = shop?.offers?.filter((offer) => offer.position === "below_slider");
    const BelowCategory = shop?.offers?.filter((offer) => offer.position === "below_category");
    const BelowSectionOfferArray = shop?.offers?.filter((offer) => offer.position === "below_section");

    // Feature sections 
    const aboveHomeSection = shop?.sections?.filter((section) => section?.position == "top");
    const belowHomeSliderSection = shop?.sections?.filter((section) => section?.position == "below_slider");
    const belowCategorySection = shop?.sections?.filter((section) => section?.position == "below_category");
    const belowBrandsSection = shop?.sections?.filter((section) => section?.position == "custom_below_shop_by_brands");
    const belowCoutrySection = shop?.sections?.filter((section) => section?.position == "below_shop_by_country_of_origin");
    const belowShopSellerSection = shop?.sections?.filter((section) => section?.position == "below_shop_by_seller");



    return (
        <section>
            <div className=' md:mx-0'>
                <div className='container promotion-image'>
                    {aboveHomeSlider && aboveHomeSlider?.map((offer) => {
                        return (
                            <div key={offer?.id}>
                                <HomeOfferSection offer={offer} />
                            </div>
                        )
                    })}
                </div>
                {aboveHomeSection && aboveHomeSection?.map((section, index) => {
                    if (section?.style_web == "style_1") {
                        return (<HorizontalProductSwiper section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_2") {
                        return (<VerticleCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_3") {
                        return (<HorizontalCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_4") {
                        return (<ProductSwiperWithImage section={section} index={index} key={section?.id} />)
                    }

                })}
                {shop?.sliders?.length > 0 && <HomePageSlider slider={shop} />}
                <div className='container promotion-image'>
                    {BelowHomeSlider && BelowHomeSlider?.map((offer) => {
                        return (
                            <div key={offer?.id}>
                                <HomeOfferSection offer={offer} />
                            </div>
                        )
                    })}
                </div>
                {belowHomeSliderSection && belowHomeSliderSection?.map((section, index) => {
                    if (section?.style_web == "style_1") {
                        return (<HorizontalProductSwiper section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_2") {
                        return (<VerticleCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_3") {
                        return (<HorizontalCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_4") {
                        return (<ProductSwiperWithImage section={section} index={index} key={section?.id} />)
                    }

                })}
                {shop?.categories?.length > 0 && <Categories categories={shop} />}

                <div className='container promotion-image'>
                    {BelowCategory && BelowCategory?.map((offer) => {
                        return (
                            <div key={offer?.id}>
                                <HomeOfferSection offer={offer} />
                            </div>
                        )
                    })}
                </div>
                {belowCategorySection && belowCategorySection?.map((section, index) => {
                    if (section?.style_web == "style_1") {
                        return (<HorizontalProductSwiper section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_2") {
                        return (<VerticleCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_3") {
                        return (<HorizontalCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_4") {
                        return (<ProductSwiperWithImage section={section} index={index} key={section?.id} />)
                    }

                })}
                {shop?.brands?.length > 0 && <BrandSlider brands={shop} />}

                {belowBrandsSection && belowBrandsSection?.map((section, index) => {
                    if (section?.style_web == "style_1") {
                        return (<HorizontalProductSwiper section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_2") {
                        return (<VerticleCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_3") {
                        return (<HorizontalCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_4") {
                        return (<ProductSwiperWithImage section={section} index={index} key={section?.id} />)
                    }

                })}
                {shop?.sellers?.length > 0 && <SellerSlider sellers={shop} />}

                {belowShopSellerSection && belowShopSellerSection?.map((section, index) => {
                    if (section?.style_web == "style_1") {
                        return (<HorizontalProductSwiper section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_2") {
                        return (<VerticleCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_3") {
                        return (<HorizontalCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_4") {
                        return (<ProductSwiperWithImage section={section} index={index} key={section?.id} />)
                    }

                })}
                {shop?.countries?.length > 0 && <CountrySlider countries={shop} />}

                {belowCoutrySection && belowCoutrySection?.map((section, index) => {
                    if (section?.style_web == "style_1") {
                        return (<HorizontalProductSwiper section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_2") {
                        return (<VerticleCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_3") {
                        return (<HorizontalCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_4") {
                        return (<ProductSwiperWithImage section={section} index={index} key={section?.id} />)
                    }
                })}
            </div>
        </section>
    )
}

export default FeatureSections