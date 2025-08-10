import React, { useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { FaMinus, FaPlus } from "react-icons/fa6";

const FAQCard = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full p-2 rounded-sm backgroundColor  mb-2 mx-3'>
            <CollapsibleTrigger className={`w-full flex justify-between gap-3 items-center p-2 font-bold`}>
                <div>
                    <h3 className="text-lg font-bold text-left md:text-center">{faq?.question}</h3>
                </div>
                <div className='flex items-center'>
                    {isOpen ?
                        <div className='w-[30px] h-[30px] rounded-sm primaryBackColor inline-flex items-center justify-center'>
                            <FaMinus size={24} className='text-white'/>
                        </div> :
                        <div className='w-[30px] h-[30px] rounded-sm primaryBackColor inline-flex items-center justify-center'>
                            <FaPlus size={24} className='text-white'/>
                        </div>
                    }
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className={`p-3 ${isOpen ? 'border-t border-[var(--border-color)] mt-2 textColor ' : ''}`}>
                {faq?.answer}
            </CollapsibleContent>
        </Collapsible>
    )
}

export default FAQCard
