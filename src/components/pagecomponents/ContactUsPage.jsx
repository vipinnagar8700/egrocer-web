import React, { useEffect } from 'react'
import Layout from '../layout/Layout'
import ContactUs from '../contact-us/ContactUs'
import { useSelector } from 'react-redux'

const ContactUsPage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>
            <ContactUs />
        </Layout>
    )
}

export default ContactUsPage
