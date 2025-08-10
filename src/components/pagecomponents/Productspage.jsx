import React, { useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import ProductsList from '@/components/productslist/ProductsList'
import { useSelector } from 'react-redux'
const Productpage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>
            <ProductsList />
        </Layout>
    )
}

export default Productpage