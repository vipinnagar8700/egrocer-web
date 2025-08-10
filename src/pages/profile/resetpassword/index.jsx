import React from 'react'
const ResetPasswordPage = dynamic(()=>import('@/components/pagecomponents/ResetPasswordPage'),{ssr:false})
import MetaData from '@/components/metadata-component/MetaData'
import dynamic from 'next/dynamic'

const ResetPassword = () => {
    return (
        <div>
            <MetaData pageName="/profile/reset-password" title={`Reset Password`} />
            <ResetPasswordPage />
        </div>
    )
}

export default ResetPassword