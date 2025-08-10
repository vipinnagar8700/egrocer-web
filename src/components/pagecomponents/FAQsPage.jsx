import React, { useEffect } from 'react'
import Layout from '../layout/Layout'
import FAQs from '../faqs/FAQs'
import { useSelector } from 'react-redux'

const FAQsPage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>
            <FAQs />
        </Layout>
    )
}

export default FAQsPage
