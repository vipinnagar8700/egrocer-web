import MetaData from '@/components/metadata-component/MetaData'
const BrandsPage = dynamic(()=>import('@/components/pagecomponents/BrandsPage'),{ssr:false})
import dynamic from 'next/dynamic'
import React from 'react'

const index = () => {
    return (
        <>
            <MetaData pageName="/brands" title={`Brands - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <BrandsPage />
        </>
    )
}

export default index
