import React, { useEffect, useState } from 'react'
import { t } from "@/utils/translation"
import { Progress } from "@/components/ui/progress"
import * as api from "@/api/apiRoutes";
import NoReviewImage from "@/assets/No_Review_Found.svg"
import ProductReviewCard from './ProductReviewCard';
import RatingImagesModal from './RatingImagesModal';
import RatingLightBox from './RatingLightBox';
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import { isRtl } from '@/lib/utils';

const ProductDescription = ({ product, ratingData }) => {
    const rtl = isRtl();
    const [selectedTab, setSelectedTab] = useState(0)
    const [ratingImages, setRatingImages] = useState([])
    const [showImagesModal, setShowImagesModal] = useState(false)
    const [showLightBox, setShowLightbox] = useState(false)
    const [imageIndex, setImageIndex] = useState(0)
    const [lightBoxImages, setLightBoxImages] = useState([])

    useEffect(() => {
        fetchProductImages()
    }, [product?.id])

    const ratingsCount = 10;
    const productImagesCount = 8;

    const fetchProductImages = async () => {
        try {
            const result = await api.getProductImages({ id: product?.id, limit: productImagesCount, offset: 0 })
            setRatingImages(result.data)
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleProductDescSelect = () => {
        setSelectedTab(0)
    }

    const handleProductReviewSelect = () => {
        setSelectedTab(1)
    }

    const handleOpenImagesModal = () => {
        setShowImagesModal(true)
    }

    const handleLightBox = (index) => {
        const images = ratingImages?.map((img) => ({ src: img?.src ? img?.src : img }))
        setLightBoxImages(images)
        setImageIndex(index)
        setShowLightbox(true)
    }

    const ratings = [
        { stars: 5, count: ratingData?.five_star_rating },
        { stars: 4, count: ratingData?.four_star_rating },
        { stars: 3, count: ratingData?.three_star_rating },
        { stars: 2, count: ratingData?.two_star_rating },
        { stars: 1, count: ratingData?.one_star_rating },
    ];
    const totalRatings = ratings.reduce((total, rating) => total + rating.count, 0);
    const averageRating = (
        ratings.reduce((sum, { stars, count }) => sum + stars * count, 0) / totalRatings
    ).toFixed(1);



    return (
        <div>
            <div className=' rounded-sm my-2 cardBorder '>
                <div className='flex flex-wrap gap-4 p-4   border-b-2'>
                    <span className={`text-base px-4 md:text-xl py-2 rounded cursor-pointer ${selectedTab == 0 ? "bg-[#29363F] w-fit text-white" : " "}`} onClick={handleProductDescSelect}>{t("product_desc_title")}</span>
                    <span className={`text-base px-4 md:text-xl py-2 rounded cursor-pointer ${selectedTab == 1 ? "bg-[#29363F] w-fit text-white" : ""}`} onClick={handleProductReviewSelect}>{t("rating_and_reviews")}</span>
                </div>
                <div className=' '>
                    {selectedTab == 0 ?
                        product?.description !== "" ? <div className='p-4' >
                            <div className='overflow-x-auto md:overflow-hidden' dangerouslySetInnerHTML={{ __html: product?.description }} />
                        </div> : <p>{t("no_product_description")}</p> : <></>
                    }
                    {selectedTab == 1 &&
                        <div className='p-4'>

                            <div className="p-4  rounded-md  ">
                                {
                                    totalRatings != 0 ?
                                        <div className='grid grid-cols-12 gap-4 '>
                                            {/* Section 1 */}
                                            <div className='col-span-12 md:col-span-4 flex flex-col gap-1'>
                                                <h1 className='text-base font-bold'>{t("customer_reviews")}</h1>
                                                <div className="flex  items-center space-x-4 addToCartColor p-4 rounded-sm ">
                                                    <div className="text-4xl font-bold text-white primaryBackColor  p-4 rounded-md">
                                                        {ratingData?.average_rating?.toFixed(2)}
                                                    </div>
                                                    <div>
                                                        <p className="text-xl font-semibold">{t("overall_rating")}</p>
                                                        <p className="text-lg font-bold ">{totalRatings.toLocaleString()}</p>
                                                    </div>
                                                </div>

                                                {/* Star Ratings */}
                                                <div className="mt-4 ">

                                                    {ratings.map(({ stars, count }) => {
                                                        const percentage = (count / totalRatings) * 100;

                                                        return (
                                                            <div key={stars} className="flex items-center space-x-2 mb-2">
                                                                <span className="text-lg font-medium">{stars}</span>
                                                                <span className="text-yellow-500">&#9733;</span>
                                                                <Progress value={percentage} className="w-full h-2 " />
                                                                <span className="text-sm font-medium">{count}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {ratingImages?.length > 0 && <div className='flex flex-col gap-2'>
                                                    <p className='font-bold text-base'>{t("customer_photos")}</p>
                                                    <div className='flex flex-wrap gap-4'>
                                                        {ratingImages?.slice(0, 6)?.map((image, index) => {
                                                            return (
                                                                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded overflow-hidden" key={index}>
                                                                    <ImageWithPlaceholder
                                                                        src={image}
                                                                        alt="Rating image"
                                                                        className="h-full w-full"
                                                                        handleOnClick={() => handleLightBox(index)}
                                                                    />
                                                                    {index === 5 && (
                                                                        <div onClick={handleOpenImagesModal} className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold">
                                                                            {`+${ratingImages?.length - 5}`}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                </div>}

                                            </div>

                                            {/* Section 2 */}
                                            <div className='col-span-12 md:col-span-8 gap-1 flex flex-col border-none :border-l-2 '>
                                                <div className='md:ml-4 ml-0'>
                                                    <h1 className='text-base font-bold'>{t("customer_feedbacks")}</h1>
                                                    {ratingData?.rating_list?.map((review, index) => {
                                                        return (
                                                            <div className='' key={index}>
                                                                <ProductReviewCard review={review} />
                                                            </div>
                                                        )
                                                    })}

                                                </div>

                                            </div>

                                        </div>
                                        :
                                        <div className='flex flex-col items-center justify-center mx-auto gap-3'>
                                            <div className='relative '>
                                                <ImageWithPlaceholder src={NoReviewImage} alt='No review found' height={0} width={0} />
                                            </div>
                                            <h2 className='text-xl md:text-2xl font-bold'>{t("no_ratings_available_yet")}</h2>
                                        </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
            <RatingImagesModal showImagesModal={showImagesModal} setShowImagesModal={setShowImagesModal} images={ratingImages} />
            <RatingLightBox showLightBox={showLightBox} setShowLightbox={setShowLightbox} images={lightBoxImages} imageIndex={imageIndex} />
        </div>

    )
}

export default ProductDescription