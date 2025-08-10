import React from 'react'
const WishlistPage = dynamic(()=>import("@/components/pagecomponents/WishlistPage"),{ssr:false})
import MetaData from '@/components/metadata-component/MetaData'
import dynamic from 'next/dynamic'

const Wishlist = () => {
    return (
        <div>
            <MetaData pageName="/profile/wishlist" title={`Wishlist - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <WishlistPage />
        </div>
    )
}

export default Wishlist