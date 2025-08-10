import React, { useEffect } from 'react'
import ProductDescription from '../productdetail/ProductDetail'
import Layout from '../layout/Layout'
import { useSelector } from 'react-redux'

const ProductDescriptionPage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>
            <ProductDescription />
        </Layout>
    )
}

export default ProductDescriptionPage