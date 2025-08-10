import React from 'react'
import MaitanceImage from "@/assets/under_maintenance.svg"
import Image from 'next/image'
import { t } from '@/utils/translation'
import Link from 'next/link'

const MaintanceMode = ({ message }) => {
    return (
        <section className="h-screen w-screen flex items-center justify-center">
            <div className='flex flex-col items-center justify-center gap-2 text-center md:w-1/3 w-full'>
                <Image src={MaitanceImage} alt='Page Not found image' height={0} width={0} className='h-full w-full' />
                <h2 className='text-3xl font-bold'>{message}</h2>
            </div>
        </section>
    )
}

export default MaintanceMode