import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const FilterSkeleton = () => {
    return (
        <div className="md:cardBorder rounded-md headerBackgroundColor">
            <div className="p-3 md:p-4 bottomBorder">
                <div className="flex justify-between items-center">
                    <Skeleton width={100} height={24} />
                    <Skeleton width={60} height={18} />
                </div>
            </div>

            {/* Category Skeleton */}
            <div className="w-full bottomBorder">
                <div className="w-full p-4 flex justify-between items-center">
                    <Skeleton width={120} height={20} />
                    <Skeleton circle width={16} height={16} />
                </div>
                <div className="filter-row px-4 pb-4">
                    {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="flex items-center gap-2 my-2">
                            <Skeleton circle width={20} height={20} />
                            <Skeleton width={100} height={16} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Brand Skeleton */}
            <div className="w-full bottomBorder">
                <div className="w-full p-4 flex justify-between items-center">
                    <Skeleton width={80} height={20} />
                    <Skeleton circle width={16} height={16} />
                </div>
                <div className="filter-row px-4 pb-4">
                    {[...Array(5)].map((_, idx) => (
                        <div key={idx} className="flex items-center gap-2 my-2">
                            <Skeleton circle width={20} height={20} />
                            <Skeleton width={80} height={16} />
                        </div>
                    ))}
                    <Skeleton width={70} height={14} />
                </div>
            </div>

            {/* Price Range Skeleton */}
            <div className="w-full bottomBorder">
                <div className="w-full p-4 flex justify-between items-center">
                    <Skeleton width={100} height={20} />
                    <Skeleton circle width={16} height={16} />
                </div>
                <div className="px-4 pb-4 flex flex-col gap-4">
                    <Skeleton height={24} />
                    <div className="flex justify-between">
                        <Skeleton width={40} height={16} />
                        <Skeleton width={40} height={16} />
                    </div>
                    <Skeleton height={36} width={100} />
                </div>
            </div>
        </div>
    );
};

export default FilterSkeleton;
