import React, { useEffect } from 'react'
import Layout from '../layout/Layout'
import PaymentStatus from '../payment-status/PaymentStatus'
import { useSelector } from 'react-redux'

const PaymentStatusPage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>
            <PaymentStatus />
        </Layout>
    )
}

export default PaymentStatusPage