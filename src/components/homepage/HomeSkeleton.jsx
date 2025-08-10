import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HomeSkeleton = () => {
    return (
        <section>
            <div className='md:mx-0'>
                {/* Top Banner Skeleton */}
                <div className='container promotion-image mb-6'>
                    <Skeleton height={120} className="w-full rounded-md" />
                </div>

                {/* Main Slider Skeleton */}
                <div className='container mb-8'>
                    <Skeleton height={300} className="w-full rounded-md" />
                </div>

                {/* Below Slider Banner Skeleton */}
                <div className='container promotion-image mb-6'>
                    <Skeleton height={120} className="w-full rounded-md" />
                </div>

                {/* Category Skeleton */}
                <div className='container my-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <Skeleton width={150} height={24} />
                        <Skeleton width={80} height={24} />
                    </div>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                        {Array(6).fill(0).map((_, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <Skeleton circle width={80} height={80} className="mb-2" />
                                <Skeleton width={60} height={16} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Below Category Banner Skeleton */}
                <div className='container promotion-image mb-6'>
                    <Skeleton height={120} className="w-full rounded-md" />
                </div>

                {/* Products Section Skeleton - Style 1 (Horizontal) */}
                <div className='container my-8'>
                    <div className='flex items-center justify-between mb-4'>
                        <Skeleton width={180} height={24} />
                        <Skeleton width={100} height={24} />
                    </div>
                    <div className='flex overflow-x-auto gap-4 pb-4'>
                        {Array(5).fill(0).map((_, index) => (
                            <div key={index} className="min-w-[200px] flex-shrink-0">
                                <Skeleton height={180} className="mb-2 rounded-md" />
                                <Skeleton width="80%" height={16} className="mb-1" />
                                <Skeleton width="50%" height={16} className="mb-1" />
                                <div className="flex justify-between items-center">
                                    <Skeleton width={60} height={20} />
                                    <Skeleton width={40} height={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Products Section Skeleton - Style 2 (Vertical) */}
                <div className='container my-8'>
                    <div className='flex items-center justify-between mb-4'>
                        <Skeleton width={180} height={24} />
                        <Skeleton width={100} height={24} />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {Array(3).fill(0).map((_, index) => (
                            <div key={index} className="cardBorder p-3 rounded-md">
                                <div className="flex gap-3">
                                    <Skeleton height={120} width={120} className="rounded-md" />
                                    <div className="flex-1">
                                        <Skeleton width="80%" height={16} className="mb-1" />
                                        <Skeleton width="60%" height={16} className="mb-1" />
                                        <Skeleton width="40%" height={20} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Brand Slider Skeleton */}
                <div className='container my-8'>
                    <div className='flex items-center justify-between mb-4'>
                        <Skeleton width={150} height={24} />
                        <Skeleton width={80} height={24} />
                    </div>
                    <div className='flex overflow-x-auto gap-6 pb-4'>
                        {Array(6).fill(0).map((_, index) => (
                            <div key={index} className="min-w-[120px] flex-shrink-0">
                                <Skeleton height={80} className="mb-2 rounded-md" />
                                <Skeleton width="80%" height={16} className="mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seller Slider Skeleton */}
                <div className='container my-8'>
                    <div className='flex items-center justify-between mb-4'>
                        <Skeleton width={180} height={24} />
                        <Skeleton width={80} height={24} />
                    </div>
                    <div className='flex overflow-x-auto gap-6 pb-4'>
                        {Array(4).fill(0).map((_, index) => (
                            <div key={index} className="min-w-[200px] flex-shrink-0">
                                <Skeleton height={120} className="mb-2 rounded-md" />
                                <Skeleton width="70%" height={16} className="mb-1 mx-auto" />
                                <Skeleton width="40%" height={14} className="mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Products Section With Image Skeleton - Style 4 */}
                <div className='container my-8'>
                    <div className='flex items-center justify-between mb-4'>
                        <Skeleton width={180} height={24} />
                        <Skeleton width={100} height={24} />
                    </div>
                    <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
                        <div className="lg:col-span-1">
                            <Skeleton height={400} className="rounded-md" />
                        </div>
                        <div className="lg:col-span-3">
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                                {Array(6).fill(0).map((_, index) => (
                                    <div key={index}>
                                        <Skeleton height={150} className="mb-2 rounded-md" />
                                        <Skeleton width="80%" height={16} className="mb-1" />
                                        <Skeleton width="50%" height={16} className="mb-1" />
                                        <div className="flex justify-between items-center">
                                            <Skeleton width={60} height={20} />
                                            <Skeleton width={40} height={20} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Country Slider Skeleton */}
                <div className='container my-8'>
                    <div className='flex items-center justify-between mb-4'>
                        <Skeleton width={170} height={24} />
                        <Skeleton width={80} height={24} />
                    </div>
                    <div className='flex overflow-x-auto gap-6 pb-4'>
                        {Array(5).fill(0).map((_, index) => (
                            <div key={index} className="min-w-[150px] flex-shrink-0">
                                <Skeleton height={100} className="mb-2 rounded-md" />
                                <Skeleton width="70%" height={16} className="mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeSkeleton; 