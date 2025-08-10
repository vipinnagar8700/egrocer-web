import React, { useEffect } from 'react'
import Layout from '../layout/Layout'
import ShippingPolicy from '../shipping-policy/ShippingPolicy'
import { useSelector } from 'react-redux'

const ShippingPolicyPage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>
            <ShippingPolicy />
        </Layout>
    )
}

export default ShippingPolicyPage
