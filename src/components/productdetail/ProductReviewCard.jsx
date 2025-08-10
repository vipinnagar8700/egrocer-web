import { useState } from 'react'
import { FaCalendarAlt } from 'react-icons/fa'
import RatingLightBox from './RatingLightBox'
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder'

const ProductReviewCard = ({ review }) => {

    const [showLightBox, setShowLightbox] = useState(false)
    const [imageIndex, setImageIndex] = useState(0)
    const [lightBoxImages, setLightBoxImages] = useState([])
    const formatDate = (data) => {
        const date = new Date(data);
        const day = date.getUTCDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getUTCFullYear();
        return `${day}, ${month} ${year}`;
    }


    const handleLightBox = (index) => {
        const images = review?.images?.map((img) => {
            return ({ src: img?.image_url })
        })
        setLightBoxImages(images)
        setImageIndex(index)
        setShowLightbox(true)
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className="flex gap-4 p-4 border-b-2   max-w-full">
                {/* User Image */}
                <div className="w-12 h-12  rounded">
                    <ImageWithPlaceholder src={review?.user?.profile} alt={review?.user?.name} className='h-full w-full rounded-sm' />
                </div>

                {/* Review Content */}
                <div className="flex-1">
                    {/* User Info */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-base ">{review?.user?.name || "Anonymous"}</span>
                        <div className="flex items-center">
                            {/* Star Ratings */}
                            <div className="flex ">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    index < review?.rate ? <span key={index} className='text-yellow-400'>★</span> : <span key={index} className="text-gray-400">★</span>

                                ))}

                            </div>
                            <span className="ml-1 = text-sm">{review?.rate}</span>
                        </div>
                    </div>
                    <p className=" text-base font-medium mb-2">
                        {review?.review}
                    </p>
                    <div className="flex items-center  text-sm font-normal mb-2">
                        <span className="mr-2 flex items-center"><FaCalendarAlt size={16} /></span> {formatDate(review?.updated_at)}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {review?.images?.map((image, index) => {
                            return (<div className="w-16 h-16 rounded" key={index}>
                                <ImageWithPlaceholder src={image?.image_url} alt="Rating image" className='h-full w-full rounded' handleOnClick={() => handleLightBox(index)} />
                            </div>)
                        })}
                    </div>
                </div>
            </div>
            <RatingLightBox showLightBox={showLightBox} setShowLightbox={setShowLightbox} images={lightBoxImages} imageIndex={imageIndex} />
        </div>

    )
}

export default ProductReviewCard