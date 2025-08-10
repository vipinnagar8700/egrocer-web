import React from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import { useSelector } from 'react-redux'

const TermsAndCondititons = () => {
    const setting = useSelector((state) => state?.Setting?.setting);
    return (
        <section>
            <div>
                <BreadCrumb />
            </div>
            <div className='container my-5  bodyBackgroundColor px-1 md:px-0'>

                <div
                    className='flex flex-col gap-4 rounded p-4 items-start [&_ul]:list-disc [&_ul]:pl-5 backgroundColor infoContent [&_a]:text-[revert] [&_a]:underline md:p-7'
                    dangerouslySetInnerHTML={{
                        __html: setting?.terms_conditions,
                    }}
                />

            </div>
        </section>
    )
}

export default TermsAndCondititons
