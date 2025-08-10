import Layout from '../layout/Layout'
import React, { useEffect } from 'react'
import ProfileDashboard from '../profiledashboard/ProfileDashboard'
import { useSelector } from 'react-redux'


const ActiceOrdersPage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout><ProfileDashboard /></Layout>
    )
}

export default ActiceOrdersPage