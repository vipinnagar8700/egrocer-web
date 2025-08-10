import React, { useEffect } from 'react'
import Layout from '../layout/Layout'
import Brands from '../shop-by-brands/Brand'
import { useSelector } from 'react-redux'

const BrandsPage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>
            <Brands />
        </Layout>
    )
}

export default BrandsPage
