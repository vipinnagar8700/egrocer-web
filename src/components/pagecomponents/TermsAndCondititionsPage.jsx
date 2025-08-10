import React, { useEffect } from 'react'
import Layout from '../layout/Layout'
import TermsAndCondititons from '../terms-and-conditions/TermsAndCondititons'
import { useSelector } from 'react-redux'

const TermsAndCondititionsPage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>
            <TermsAndCondititons />
        </Layout>
    )
}

export default TermsAndCondititionsPage
