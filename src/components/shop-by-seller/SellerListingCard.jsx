import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder'

const SellerListingCard = ({ seller }) => {
    return (
        <div className='flex flex-col category-card p-3 hover:textPrimaryColor hover:cardBorder rounded-sm headerBackgroundColor cursor-pointer'>
            <div className='gap-3 flex flex-col items-center'>
                <div className='relative h-[120px] w-[120px]'>
                    <ImageWithPlaceholder src={seller.logo_url} alt='Category Image' className='rounded-sm w-full h-full object-cover p-2' />
                </div>
                <div className="font-semibold h-[42px] leading-5 mt-2 text-center w-full truncate">{seller.store_name}</div>
            </div>
        </div>
    )
}

export default SellerListingCard
