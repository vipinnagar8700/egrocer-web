import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import { isRtl } from '@/lib/utils';

const Seller = ({ seller }) => {
    const rtl = isRtl();
    return (
        <div className={`group  relative flex items-center headerBackgroundColor p-4 rounded-md flex-row overflow-hidden hover:text-white  hover:cursor-pointer `}>
            <div className={`absolute inset-0   primaryBackColor ${rtl ? 'translate-x-full' : '-translate-x-full'} group-hover:translate-x-0 transition-transform duration-500 ease-in-out`} />
            <div className='flex flex-row items-center gap-4'>
                <div className='relative h-[80px] w-[80px]'>
                    <ImageWithPlaceholder
                        src={seller.logo_url}
                        alt={seller.name}
                        className='h-full w-full rounded-md'
                    />
                </div>

                <div className="relative max-w-[100px] md:max-w-[200px] whitespace-nowrap text-base font-bold overflow-hidden text-ellipsis">
                    {seller.name}
                </div>
            </div>

        </div>
    );
};

export default Seller;