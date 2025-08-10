import React, { useEffect } from 'react'
import Layout from '../layout/Layout'
import OrderDetail from '../orderdetail/OrderDetail'
import { useSelector } from 'react-redux'

const OrderDetailPage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>
            <OrderDetail />
        </Layout>
    )
}

export default OrderDetailPage