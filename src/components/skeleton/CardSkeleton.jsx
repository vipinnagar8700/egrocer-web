import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardSkeleton = ({ height, width = "100%", padding }) => {
    return (
        <div className={`flex  w-full ${padding}`}>
            <div className="w-full border rounded-lg cardBorder p-4">
                <Skeleton height={height} width={width} />
            </div>
        </div>
    );
};

export default CardSkeleton;
