import React, { useEffect, useState } from 'react'
import VerticleProductCard from '../productcards/VerticleProductCard'
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { t } from '@/utils/translation';
import { useRouter } from 'next/navigation';
import { setFilterSection, setFilterView } from '@/redux/slices/productFilterSlice';

const VerticleCardContainer = ({ section }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const shop = useSelector(state => state.Shop.shop);
    const theme = useSelector(state => state.Theme.theme)
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
        <div>
            {section?.products?.length > 0 ? <section className='' style={theme == "light" ? { backgroundColor: section?.background_color_for_light_theme } : { backgroundColor: section?.background_color_for_dark_theme }}>
                <div className='container feature-section'>
                    <div className='flex justify-between items-center mb-3'>
                        <div>
                            <h2 className='text-2xl font-bold'>{section?.title}</h2>
                            <p className='text-base font-[500]'>{section?.short_description}</p>
                        </div>

                        <div>
                            <button className='hover:primaryColor' onClick={handleViewAll}>{t("see_all")}</button>
                        </div>
                    </div>
                    <div className='grid grid-cols-6 md:grid-cols-9 lg:grid-cols-12 mt-6 cardBorder rounded-md verticle-card'>
                        {section?.products?.map((product, index) => {
                            return (
                                <div className='col-span-3' key={index}>
                                    <VerticleProductCard product={product}
                                    />
                                </div>
                            )
                        })}
                    </div>

                </div>
            </section> : null
            }
            {promotionImage && promotionImage?.map((offer, index) => {
                return (
                    <div className='container mb-6' key={index}>
                        <div className='relative' key={offer?.id}>
                            <Image src={offer?.image_url} alt='Offer image' height={0} width={0} className='object-contain h-full w-full rounded-sm' />
                        </div>
                    </div>
                )
            })}
        </div>


    )
}

export default VerticleCardContainer