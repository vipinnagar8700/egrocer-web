import React from 'react';
import { t } from "@/utils/translation"

const Stepper = ({ currentStep }) => {

    return (
        <div className="flex justify-center items-center space-x-4 my-8 w-full">
            <div className='flex flex-col justify-center gap-2 items-center'>
                <div
                    className={`flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full  font-bold ${currentStep >= 1 ? 'primaryBackColor text-white' : 'backgroundColor '
                        }`}
                >
                    1
                </div>
                <span>{t("address")}</span>
            </div>

            <div
                className={`flex-1 border-t-2  border-gray-400 border-dashed
                    mb-4 p-2 w-full`}
            ></div>
            <div className='flex flex-col justify-center gap-2 items-center'>
                <div
                    className={`flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full  font-bold bg-gray-400
                    ${currentStep >= 2 ? 'primaryBackColor text-white' : 'backgroundColor '
                        } 
                    `}
                >
                    2
                </div>
                <span>{t("schedule")}</span>
            </div>

            <div
                className={`flex-1 border-t-2  border-gray-400 border-dashed
                 mb-4 p-2`}
            ></div>
            <div className='flex flex-col justify-center gap-2 items-center'>
                <div
                    className={`flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full  font-bold ${currentStep >= 3 ? 'primaryBackColor text-white' : 'backgroundColor '
                        }`}
                >
                    3
                </div>
                <span>{t("payment")}</span>
            </div>

        </div>
    );
};

export default Stepper;