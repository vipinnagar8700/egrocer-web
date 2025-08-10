import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { IoIosCloseCircle } from 'react-icons/io';
import { t } from '@/utils/translation';
import { TbCameraPlus } from 'react-icons/tb';
import * as api from "@/api/apiRoutes"
import { toast } from 'react-toastify';
import { MdOutlineStar } from 'react-icons/md';
import Image from 'next/image';

const RatingUpdateModal = ({ showUpdateRating, setShowUpdateRating, ratingId, handleFetchOrderDetail }) => {

    const fileInputRef = useRef(null);
    const buttonRef = useRef(null);
    const [rating, setRating] = useState(null)
    const [review, setReview] = useState(null)
    const [oldRatingImages, setOldRatingImages] = useState([])
    const [newRatingImages, setNewRatingImages] = useState([])
    const [deletedImages, setDeletedImages] = useState([])

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        if (showUpdateRating) {
            handleFetchRating()
        }
    }, [showUpdateRating])

    const handleFetchRating = async () => {
        try {
            const response = await api.getProductRating({ ratingId: ratingId })
            if (response?.status == 1) {
                setRating(response?.data?.rate)
                setReview(response?.data?.review)
                setOldRatingImages(response?.data?.images)
            } else {
                console.log("Error", response.message)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    const deletePrevImage = (image) => {
        setDeletedImages(prevState => [...prevState, image?.id])
        const remainOldImages = oldRatingImages?.filter((img) => img?.id != image?.id)
        setOldRatingImages(remainOldImages)
    }

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setNewRatingImages(prevImages => [...prevImages, ...files]);
    };

    const removeImage = (index) => {
        setImages(prevImages => prevImages.filter((_, idx) => idx !== index));
    };


    const handleHideUpdateRatingModal = () => {
        setShowUpdateRating(false)
    }

    const handleUpdateRating = async () => {
        try {
            if (buttonRef.current) {
                buttonRef.current.disabled = true;
            }
            const response = await api.updateReviewProduct({ ratingId: ratingId, rating: rating, review: review, deleteImages: deletedImages, images: newRatingImages })
            if (response.status == 1) {
                toast.success(response.message)
                setRating(null)
                setReview(null)
                setDeletedImages([])
                setNewRatingImages([])
                setShowUpdateRating(false)
                await handleFetchOrderDetail()
            } else {
                console.log("Error", response.message)
            }
        } catch (error) {
            console.log("error", error)
            buttonRef.current.disabled = false;
        }
    }

    return (
        <Dialog open={showUpdateRating}>
            <DialogContent>
                <DialogHeader className="font-bold text-2xl text-start flex flex-row justify-between">
                    {t("update_rating")}
                    <div>
                        <IoIosCloseCircle size={32} onClick={handleHideUpdateRatingModal} />
                    </div>
                </DialogHeader>
                <div>
                    <div className='flex flex-col gap-8'>
                        <div className='p-4 backgroundColor flex flex-col gap-2 rounded-md'>
                            <span>{t("overall_rating")}:</span>
                            <div className='flex flex-row'>
                                <div className="flex gap-1">
                                    {Array(5)
                                        .fill(rating)
                                        .map((_, idx) => (
                                            <label key={idx} className="cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    onChange={() => setRating(idx + 1)}
                                                    value={rating}
                                                    className="hidden"
                                                />
                                                <MdOutlineStar
                                                    color={idx < rating ? "#FFD700" : "#bbb"}
                                                    size={32} // Adjust size if needed
                                                    onClick={() => setRating(idx + 1)}
                                                />
                                            </label>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span>{t("product_review")}</span>
                            <textarea name="" id="" value={review} onChange={(e) => setReview(e.target.value)} placeholder={t("write_review_here")} className='p-2 cardBorder outline-none rounded-sm'></textarea>
                        </div>
                        <div className='flex  gap-2 flex-wrap'>
                            {oldRatingImages?.map((image, index) => (
                                <div key={index} className="relative">
                                    <Image
                                        height={0}
                                        width={0}
                                        src={image?.image_url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <button
                                        onClick={() => deletePrevImage(image)}
                                        className="absolute -top-4 -right-2  text-red-500  rounded-full h-6 w-6 flex items-center  "
                                    >
                                        <IoIosCloseCircle size={28} />
                                    </button>
                                </div>
                            ))}
                            {newRatingImages?.map((src, index) => (
                                <div key={index} className="relative">
                                    <Image
                                        height={0}
                                        width={0}
                                        src={URL.createObjectURL(src)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-4 -right-2  text-red-500  rounded-full h-6 w-6 flex items-center  "
                                    >
                                        <IoIosCloseCircle size={28} />
                                    </button>
                                </div>
                            ))}
                            <div className='cardBorder rounded-sm flex items-center justify-center p-12 w-12 h-10 ' onClick={handleIconClick}>
                                <div>
                                    <input
                                        type="file"
                                        multiple
                                        hidden
                                        name="image-upload"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}

                                    />
                                    <TbCameraPlus
                                        size={32}
                                        name="image-upload"

                                        className="cursor-pointer"
                                    />
                                </div>
                            </div>

                        </div>
                        <div className='flex justify-end'>
                            <button className='primaryBackColor px-4 font-semibold text-base py-2 text-white rounded-sm disabled:bg-gray-500' onClick={handleUpdateRating} ref={buttonRef}>{t("submit")}</button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default RatingUpdateModal