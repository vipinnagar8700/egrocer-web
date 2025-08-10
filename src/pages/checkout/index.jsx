import React from 'react'
const CheckoutPage = dynamic(()=>import("@/components/pagecomponents/CheckoutPage"),{ssr:false})
import MetaData from '@/components/metadata-component/MetaData'
import dynamic from 'next/dynamic'

const index = () => {
    return (
        <div>
            <MetaData pageName="/checkout" title={`Checkout - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <CheckoutPage />
        </div>
    )
}

export default index