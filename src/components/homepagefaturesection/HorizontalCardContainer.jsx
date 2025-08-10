import React, { useEffect, useState } from 'react'
import HorizontalProductCard from '../productcards/HorizontalProductCard'
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setFilterSection } from '@/redux/slices/productFilterSlice';
import { t } from '@/utils/translation';
import { useRouter } from 'next/navigation';
const HorizontalCardContainer = ({ section }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const theme = useSelector(state => state.Theme.theme)
    const shop = useSelector(state => state.Shop.shop);
    const [promotionImage, setPromotionImage] = useState(null)
    useEffect(() => {
        const promotionImageBelowSection = shop?.offers?.filter((offer) => offer?.position == "below_section");
        const image = promotionImageBelowSection?.filter((offer) => {
            return offer?.section?.title == section?.title
        })
        setPromotionImage(image)
    }, [section])



    const handleViewAll = () => {
        dispatch(setFilterSection({ data: section?.id }))
        router.push('/products')
    }

    return (
        <section style={theme == "light" ? { backgroundColor: section?.background_color_for_light_theme } : { backgroundColor: section?.background_color_for_dark_theme }}>
            {section?.products?.length > 0 ? <div className='container feature-section'>
                <div className='flex justify-between items-center mb-3'>
                    <div>
                        <h2 className='text-2xl font-bold'>{section?.title}</h2>
                        <p className='text-base font-[500]'>{section?.short_description}</p>
                    </div>

                    <div>
                        <button onClick={handleViewAll} className='hover:primaryColor'>{t("see_all")}</button>
                    </div>
                </div>
                <div className='grid grid-cols-4 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-12 mt-6 gap-4'>
                    {section?.products?.slice(0, 6)?.map((product, index) => {
                        return (
                            <div key={index} className='col-span-4 '>
                                <HorizontalProductCard product={product} />
                            </div>
                        )
                    })}
                </div>
            </div> : null}
            <div className='containers'>
                {promotionImage && promotionImage?.map((offer) => {
                    return (
                        <div className='relative' key={offer?.id}>
                            <Image src={offer?.image_url} alt='Offer image' height={0} width={0} className='object-contain h-full w-full rounded-sm' />
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default HorizontalCardContainer