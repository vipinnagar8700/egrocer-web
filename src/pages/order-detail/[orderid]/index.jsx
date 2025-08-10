import React from 'react'
const OrderDetailPage = dynamic(() => import('@/components/pagecomponents/OrderDetailPage'), {
    ssr: false})
import MetaData from '@/components/metadata-component/MetaData'
import dynamic from 'next/dynamic'

const index = () => {
    return (
        <div>
            <MetaData pageName="/order-detail/" title={`Order Details - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <OrderDetailPage />
        </div>
    )
}

export default index