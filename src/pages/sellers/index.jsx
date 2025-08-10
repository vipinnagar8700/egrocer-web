import MetaData from '@/components/metadata-component/MetaData'
import dynamic from 'next/dynamic'
const SellersPage = dynamic(()=>import('@/components/pagecomponents/SellersPage'),{ssr:false})
import React from 'react'

const index = () => {
    return (
        <>
            <MetaData pageName="/sellers" title={`Sellers - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <SellersPage />
        </>
    )
}

export default index
