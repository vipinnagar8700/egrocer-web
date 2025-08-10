import React from 'react'
const ProfilePage = dynamic(()=>import('@/components/pagecomponents/ProfilePage'),{ssr:false})
import MetaData from '@/components/metadata-component/MetaData';
import dynamic from 'next/dynamic';

const Profile = () => {
    return (
        <>
            <MetaData pageName="/profile" title={`Profile - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <ProfilePage />
        </>
    )
}

export default Profile;