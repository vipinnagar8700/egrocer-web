import React from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import { useSelector } from 'react-redux';

const ContactUs = () => {
    const setting = useSelector((state) => state?.Setting?.setting);
    return (
        <section>
            <div><BreadCrumb /></div>
            <div className='container my-5 bodyBackgroundColor px-1 md:px-0'>
                <div className='flex flex-col gap-4 rounded p-4 items-center backgroundColor infoContent'
                    dangerouslySetInnerHTML={{
                        __html: setting?.contact_us,
                    }}
                />
            </div>
        </section>
    )
}

export default ContactUs
