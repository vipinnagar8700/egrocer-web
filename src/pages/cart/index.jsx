import React from 'react'
const CartPage = dynamic(()=>import('@/components/pagecomponents/CartPage'),{ssr:false})
import MetaData from '@/components/metadata-component/MetaData'
import dynamic from 'next/dynamic'

const index = () => {
    return (
        <>
            <MetaData pageName="/cart" title={`Cart - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <CartPage />
        </>
    )
}

export default index