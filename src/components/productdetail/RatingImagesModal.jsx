import { useState } from 'react';
import {
    Dialog,
    DialogContent, DialogHeader
} from "@/components/ui/dialog";
import RatingLightBox from './RatingLightBox';
import { t } from '@/utils/translation';
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';

const RatingImagesModal = ({ showImagesModal, setShowImagesModal, images }) => {

    const [showLightBox, setShowLightbox] = useState(false)
    const [imageIndex, setImageIndex] = useState(0)
    const [lightBoxImages, setLightBoxImages] = useState([])

    const handleLightBox = (index) => {
        const ratingImages = images?.map((img) => ({ src: img?.src ? img?.src : img }))
        setLightBoxImages(ratingImages)
        setImageIndex(index)
        setShowLightbox(true)
    }

    return (
        <div>
            <Dialog open={showImagesModal} onOpenChange={setShowImagesModal}>

                <DialogContent>
                    <DialogHeader>
                        <h1 className='font-bold text-2xl'>{t("Rating_images")}</h1>
                    </DialogHeader>
                    <div className='flex flex-wrap gap-2 justify-center'>
                        {images?.map((image, index) => {
                            return (
                                <div className="relative w-24 h-24 rounded overflow-hidden" key={index}>
                                    <ImageWithPlaceholder
                                        src={image}
                                        alt="Rating image"
                                        className="h-full w-full"
                                        onClick={() => handleLightBox(index)}
                                    /></div>
                            )
                        })}
                    </div>
                </DialogContent>
            </Dialog>
            <RatingLightBox showLightBox={showLightBox} setShowLightbox={setShowLightbox} images={lightBoxImages} imageIndex={imageIndex} />
        </div>
    )
}


export default RatingImagesModal