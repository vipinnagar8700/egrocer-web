import React, { useEffect } from 'react'
import Layout from '../layout/Layout'
import ReturnAndExchangePolicy from '../return-and-exchange-policy/ReturnAndExchangePolicy'
import { useSelector } from 'react-redux'

const ReturnExchangePolicyPage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>
            <ReturnAndExchangePolicy />
        </Layout>
    )
}

export default ReturnExchangePolicyPage
