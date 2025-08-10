import React from 'react'
import Image from 'next/image'
import pageNotFound from "@/assets/not_found_images/404.svg"
import { t } from '@/utils/translation'
import Link from 'next/link'

const Custom404 = () => {
    return (
        <section className="h-screen w-screen flex items-center justify-center">
            <div className='flex flex-col items-center justify-center gap-2 text-center'>
                <Image src={pageNotFound} alt='Page Not found image' height={0} width={0} className='h-full w-full' />
                <h2 className='text-2xl font-bold'>{t("page_not_found")}</h2>
                <Link href="/" className='primaryBackColor text-white font-semibold text-base p-2 rounded-sm'>
                    {t("home")}
                </Link>
            </div>
        </section>
    )
}

export default Custom404
