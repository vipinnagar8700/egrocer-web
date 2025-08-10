import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import React from 'react';
import { t } from "@/utils/translation";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoIosCloseCircle } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { FaCaretDown } from "react-icons/fa";

const MobileNavSidebar = ({ open, setOpen, handleLanguageChange }) => {
    const router = useRouter()
    const setting = useSelector(state => state?.Setting?.setting)
    const language = useSelector(state => state.Language)
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="p-0 w-full sm:w-[900px]" side="left" aria-describedby={undefined} >
                <SheetHeader>
                    <SheetTitle className="flex justify-between px-4 py-4 items-center border-b">
                        <div className="w-36 h-9">
                            <Image src={setting?.web_settings?.web_logo} alt={"mobileLogo"} className="w-full h-full object-contain" width={0} height={0} />
                        </div>
                        <SheetTrigger className='focus:outline-none'><IoIosCloseCircle size={32} /></SheetTrigger>
                    </SheetTitle>
                </SheetHeader>

                {/* Links Mobile Sidebar */}
                <div>
                    <ul className='flex flex-col textColor text-base font-medium'>
                        <Link href={"/"} className={`p-4 text-start border-b border-dashed ${router.pathname === '/' ? 'primaryColor' : ''}`}>
                            <li>{t("home")}</li>
                        </Link>
                        <Link href={"/about-us"} className={`p-4 text-start border-b border-dashed ${router.pathname === '/about-us' ? 'primaryColor' : ''}`}>
                            <li>{t("about_us")}</li>
                        </Link>
                        <Link href={"/faqs"} className={`p-4 text-start border-b border-dashed ${router.pathname === '/faqs' ? 'primaryColor' : ''}`}>
                            <li> {t("faq")}</li>
                        </Link>
                        <Link href={"/contact-us"} className={`p-4 text-start border-b border-dashed ${router.pathname === '/contact-us' ? 'primaryColor' : ''}`}>
                            <li>{t("contact_us")}</li>
                        </Link>
                    </ul>
                </div>

                {/* Follow Us Mobile Sidebar */}
                {setting?.social_media?.length > 0 &&
                    <div className='p-4 flex flex-col gap-2'>
                        <div className='flex flex-col items-start'>
                            {t("follow_us")}
                        </div>
                        <div className="flex justify-center ">
                            <ul className="flex justify-center gap-3 items-center h-12 w-full backgroundColor">
                                {setting?.social_media && setting?.social_media?.slice(0, 4)?.map((social, index) => {
                                    return (
                                        <React.Fragment key={social?.id}>
                                            <Link href={social?.link || "#"} target='_blank'>
                                                <li className={`px-2`}>
                                                    <i className={`${social?.icon} text-gray-400`}></i>
                                                </li>
                                            </Link>
                                            <span className='border-l border-gray-200 h-6 last:hidden mx-2'></span>
                                        </React.Fragment>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                }

                {/* Language Mobile Sidebar */}
                <div className="p-4 w-full flex justify-center ">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full rounded cardBorder border text-base textColor p-4 flex items-center gap-2 group justify-between">
                            <div className="font-medium">{language?.selectedLanguage ? language?.selectedLanguage?.name : "English"}</div>
                            <div><FaCaretDown className="transition-transform duration-300 ease-in-out group-data-[state=open]:-rotate-180" /></div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[285px] transition-all duration-300 ease-in-out">
                            {language?.availableLanguages && language?.availableLanguages?.map((language) => {
                                return (
                                    <DropdownMenuItem
                                        key={language?.id}
                                        onSelect={() => handleLanguageChange(language)}
                                        className="text-base textColor"
                                    >
                                        {language?.name}
                                    </DropdownMenuItem>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNavSidebar