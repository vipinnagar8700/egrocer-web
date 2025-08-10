import React, { useEffect } from 'react'
import Layout from '../layout/Layout'
import CancellationPolicy from '../cancellation-policy/CancellationPolicy'
import { useSelector } from 'react-redux'

const CancellationPolicyPage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>
            <CancellationPolicy />
        </Layout>
    )
}

export default CancellationPolicyPage
