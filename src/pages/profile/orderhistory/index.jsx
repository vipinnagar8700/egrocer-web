import React from 'react'
const OrderHistoryPage = dynamic(()=>import('@/components/pagecomponents/OrderHistoryPage'),{ssr:false})
import MetaData from '@/components/metadata-component/MetaData'
import dynamic from 'next/dynamic'

const OrderHistory = () => {
    return (
        <div>
            <MetaData pageName="/profile/order-history" title={`Order History - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <OrderHistoryPage />
        </div>
    )
}

export default OrderHistory