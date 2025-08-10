import React, { useEffect } from 'react'
import ProfileDashboard from '../profiledashboard/ProfileDashboard'
import Layout from '../layout/Layout'
import { useSelector } from 'react-redux'

const ProfilePage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>
            <ProfileDashboard />
        </Layout>
    )
}

export default ProfilePage