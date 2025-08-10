import React from 'react'
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder'

const BrandCard = ({ brand }) => {
    return (
        <div className="rounded-sm text-center flex flex-col items-center px-5 py-7 gap-2 border border-transparent brandBackgroundColor hover:cardBorder hover:textPrimaryColor hover:cursor-pointer hover:headerBackgroundColor transition-all duration-300">
            <div className='h-28 w-28  '>
                <ImageWithPlaceholder src={brand?.image_url} alt={brand?.name} className="rounded-sm mx-auto h-full w-full object-cover mb-2" />
            </div>
            <div className="text-base font-semibold leading-[26px] text-center w-full truncate">{brand?.name}</div>
        </div>
    )
}

export default BrandCard