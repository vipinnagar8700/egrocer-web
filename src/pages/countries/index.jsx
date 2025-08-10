import MetaData from '@/components/metadata-component/MetaData'
const CountriesPage = dynamic(()=>import('@/components/pagecomponents/CountriesPage'),{ssr:false})
import dynamic from 'next/dynamic'
import React from 'react'

const index = () => {
    return (
        <>
            <MetaData pageName="/countries" title={`Countries - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <CountriesPage />
        </>
    )
}

export default index
