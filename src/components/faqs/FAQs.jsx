import React, { useEffect, useState } from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import * as api from "../../api/apiRoutes";
import FAQCard from './FAQCard';
import { t } from '@/utils/translation';
import CardSkeleton from '../skeleton/CardSkeleton';

const FAQs = () => {
    const [faqs, setFaqs] = useState([]);
    const total_faqs_per_page = 7;
    const [currPage, setcurrPage] = useState(1);
    const [offset, setoffset] = useState(0);
    const [isLoading, setIsLoading] = useState(false)



    useEffect(() => {
        handleFetchFAQs();
    }, [])

    const handleFetchFAQs = async (offset = 0) => {
        setIsLoading(true);
        try {
            const response = await api.getFAQs({ limit: total_faqs_per_page, offset });
            // console.log(response?.total);
            // console.log(response?.data);
            setFaqs([...faqs, ...response?.data]);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log("FAQs page error: ", error)
        }
    }
    const handlePageChange = (pageNum) => {
        setcurrPage(pageNum);
        setoffset(pageNum * total_faqs_per_page - total_faqs_per_page);
        handleFetchFAQs(pageNum * total_faqs_per_page - total_faqs_per_page);
    };
    return (
        <section>
            <div>
                <BreadCrumb />
            </div>
            <div className='container my-4 flex flex-col items-center gap-4 bodyBackgroundColor px-4 md:px-0'>
                {faqs?.map((faq, idx) => (
                    <FAQCard key={idx} faq={faq} />
                ))}
                {isLoading && Array.from({ length: total_faqs_per_page }).map((_, idx) => (
                    <div key={idx} className='w-full'>
                        <CardSkeleton height={40} padding='p-1' />
                    </div>
                ))}
                {faqs?.length > 0 && <button className='px-3 py-[6px] h-full flex items-center rounded font-medium text-whiterounded  focus:outline-none bg-[#29363f] text-white text-xl shadow'
                    onClick={() => handlePageChange(currPage + 1)}
                >
                    {t("load_more")}
                </button>}
            </div>
        </section>
    )
}

export default FAQs
