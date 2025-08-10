import React from 'react'
const ActiceOrdersPage = dynamic(()=>import('@/components/pagecomponents/ActiveOrdersPage'),{ssr:false})
import MetaData from '@/components/metadata-component/MetaData'
import dynamic from 'next/dynamic'
const index = () => {
    return (
        <div>
            <MetaData pageName="/profile/active-orders" title={`Active Orders - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <ActiceOrdersPage />
        </div>
    )
}

export default index