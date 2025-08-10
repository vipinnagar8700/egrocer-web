'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ImagePlaceholder from "../../assets/image-placeholder/image.png";
import { useSelector } from 'react-redux';

const ImageWithPlaceholder = ({ src, alt, className, handleOnClick, priority }) => {
    const setting = useSelector(state => state.Setting);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    return (
        <Image
            src={(isLoading || isError) ? (setting?.setting?.web_settings?.placeholder_image ? setting?.setting?.web_settings?.placeholder_image : ImagePlaceholder) : src}
            alt={alt}
            width={0}
            height={0}
            priority={priority}
            className={className}
            onClick={handleOnClick}
            onLoad={() => {
                setIsLoading(false);
            }}
            onError={() => {
                setIsLoading(false);
                setIsError(true)
            }}

        />
    );
};

export default ImageWithPlaceholder;