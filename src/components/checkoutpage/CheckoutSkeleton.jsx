import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { t } from "@/utils/translation";

const CheckoutSkeleton = () => {
    return (
        <div className='flex justify-center flex-col items-center container'>
            {/* Stepper Skeleton */}
            <div className='flex w-full lg:w-1/2 justify-center my-8'>
                <div className="flex justify-center items-center space-x-4 w-full">
                    <div className='flex flex-col justify-center gap-2 items-center'>
                        <Skeleton circle width={48} height={48} />
                        <Skeleton width={60} height={16} />
                    </div>
                    <div className="flex-1 mb-4 p-2">
                        <Skeleton height={2} />
                    </div>
                    <div className='flex flex-col justify-center gap-2 items-center'>
                        <Skeleton circle width={48} height={48} />
                        <Skeleton width={60} height={16} />
                    </div>
                    <div className="flex-1 mb-4 p-2">
                        <Skeleton height={2} />
                    </div>
                    <div className='flex flex-col justify-center gap-2 items-center'>
                        <Skeleton circle width={48} height={48} />
                        <Skeleton width={60} height={16} />
                    </div>
                </div>
            </div>

            <div className='w-full'>
                <div className='grid grid-cols-12 gap-2 md:gap-6'>
                    {/* Address Cards Skeleton - Step 1 */}
                    <div className="col-span-12 md:col-span-8 lg:col-span-9">
                        <div className='flex flex-col cardBorder rounded-sm mb-4'>
                            <div className='flex justify-between backgroundColor py-4 px-2 '>
                                <Skeleton width={200} height={24} />
                                <Skeleton width={120} height={24} />
                            </div>
                            {/* Address Cards Skeletons */}
                            {Array(3).fill(0).map((_, index) => (
                                <div key={index} className="py-6 px-4 w-full border-b">
                                    <div className="flex justify-between items-center mb-2">
                                        <Skeleton width={180} height={20} />
                                        <div className="flex items-center">
                                            <Skeleton width={16} height={16} circle />
                                            <Skeleton width={60} height={16} style={{ marginLeft: '8px' }} />
                                        </div>
                                    </div>
                                    <Skeleton width={100} height={16} style={{ marginBottom: '8px' }} />
                                    <Skeleton width="90%" height={16} style={{ marginBottom: '16px' }} />
                                    <div className="flex items-center justify-between p-2 buttonBackground rounded-sm">
                                        <Skeleton width={150} height={20} />
                                        <div className="flex md:space-x-1 flex-col md:flex-row">
                                            <Skeleton width={80} height={20} />
                                            <span className="p-1 border-r-2 hidden md:block"></span>
                                            <Skeleton width={80} height={20} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary Skeleton */}
                    <div className='md:col-span-4 lg:col-span-3 col-span-12'>
                        <div className='cardBorder rounded-sm p-4'>
                            <div className='font-bold text-xl mb-4'>
                                <Skeleton width={150} height={24} />
                            </div>
                            <div className='flex flex-col gap-2 mb-4'>
                                <Skeleton count={4} height={16} />
                            </div>
                            <div className='w-full h-[1px] bg-gray-300 my-2'></div>
                            <div className='flex flex-col gap-2 mb-4'>
                                <Skeleton count={3} height={16} />
                            </div>
                            <div className='w-full h-[1px] bg-gray-300 my-2'></div>
                            <div className='flex justify-between items-center'>
                                <Skeleton width={100} height={20} />
                                <Skeleton width={80} height={20} />
                            </div>
                            <div className='mt-4'>
                                <Skeleton height={40} borderRadius={4} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSkeleton; 