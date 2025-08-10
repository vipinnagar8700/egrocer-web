import React from 'react'
const PaymentStatusPage = dynamic(()=>import('@/components/pagecomponents/PaymentStatusPage'),{ssr:false})
import MetaData from '@/components/metadata-component/MetaData'
import dynamic from 'next/dynamic'

const index = () => {
    return (
        <>
            <MetaData pageName="/web-payment-status" title={`Payment Status - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <PaymentStatusPage />
        </>
    )
}

export default index