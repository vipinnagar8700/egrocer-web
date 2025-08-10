import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '@/checkauth/CheckAuth';
const Checkout = dynamic(() => import('../checkoutpage/Checkout'), { ssr: false });
import Layout from '../layout/Layout'
import { useSelector } from 'react-redux';

const CheckoutPage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>
            <Checkout />
        </Layout>
    )
}

export default withAuth(CheckoutPage)