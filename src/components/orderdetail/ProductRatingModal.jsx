import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { t } from '@/utils/translation';
import { IoIosCloseCircle } from 'react-icons/io';
import { MdOutlineStar } from 'react-icons/md';
import { TbCameraPlus } from "react-icons/tb";
import Image from 'next/image';
import { toast } from 'react-toastify';
import * as api from "@/api/apiRoutes"

const ProductRatingModal = ({ showRating, setShowRating, selectedProduct, handleFetchOrderDetail }) => {

    const fileInputRef = useRef(null);
    const [rating, setRating] = useState(null)
    const [review, setReview] = useState("")
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false)

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setImages(prevImages => [...prevImages, ...files]);
    };
    const removeImage = (index) => {
        setImages(prevImages => prevImages.filter((_, idx) => idx !== index));
    };

    const handleHideRatingModal = () => {
        setRating(null)
        setReview("")
        setImages([])
        setShowRating(false)
    }

    const handleRatingSubmit = async () => {
        try {
            if (rating == null) {
                toast.error(t("product_rating_is_required"))
                return;
            }
            const response = await api.reviewProduct({ productId: selectedProduct?.product_id, rating: rating, review: review, images: images })
            if (response.status == 1) {
                toast.success(response.message)
                await handleFetchOrderDetail();
                setRating(null)
                setReview("")
                setImages([])
                setShowRating(false)
            } else {
                console.log("error", response.message)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <Dialog open={showRating}>
            <DialogContent>
                <DialogHeader className="font-bold text-2xl text-start flex flex-row justify-between">
                    {t("rate_the_product")}
                    <div>
                        <IoIosCloseCircle size={32} onClick={handleHideRatingModal} />
                    </div>
                </DialogHeader>
                <div className=''>
                    <div className='flex flex-col gap-8'>
                        <div className='p-4 backgroundColor flex flex-col gap-2 rounded-md'>
                            <span>{t("overall_rating")}:</span>
                            <div className='flex flex-row'>
                                <div className="flex gap-1">
                                    {Array(5)
                                        .fill(0)
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
                            {images.map((src, index) => (
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
                            <button className='primaryBackColor px-4 font-semibold text-base py-2 text-white rounded-sm' onClick={handleRatingSubmit}>{t("submit")}</button>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default ProductRatingModal