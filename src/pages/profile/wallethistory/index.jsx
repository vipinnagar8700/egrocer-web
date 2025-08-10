import MetaData from '@/components/metadata-component/MetaData'
const WalletHistoryPage = dynamic(()=>import('@/components/pagecomponents/WalletHistoryPage'),{ssr:false})
import dynamic from 'next/dynamic'
import React from 'react'

const index = () => {
    return (
        <div>
            <MetaData pageName="/profile/wallet-history" title={`Wallet History - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <WalletHistoryPage />
        </div>
    )
}

export default index