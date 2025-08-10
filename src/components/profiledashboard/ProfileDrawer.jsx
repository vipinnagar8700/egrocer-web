import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { IoIosCloseCircle } from 'react-icons/io';
import { t } from '@/utils/translation';
import ProfileSidebar from './ProfileSidebar';
import { useSelector } from 'react-redux';

const ProfileDrawer = ({ showProfile, setShowProfile, selectedTab, setSelectedTab }) => {

    const language = useSelector(state => state.Language.selectedLanguage)

    return (
        <Sheet open={showProfile} >
            <SheetContent className="p-0 w-full sm:w-[900px] " side={language?.type == "RTL" ? "left" : "right"}>
                <SheetHeader className="px-0 py-3 border-[1px] flex justify-between text-left">
                    <SheetTitle className="text-2xl font-bold flex flex-row items-center p-2 justify-between">
                        <p className='text-2xl font-bold'>{t("profile")}</p>
                        <div>
                            <IoIosCloseCircle size={32} onClick={() => setShowProfile(false)} />
                        </div>
                    </SheetTitle>
                </SheetHeader>
                <div className='overflow-y-scroll h-[calc(100dvh-74px)]'>
                    <ProfileSidebar setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default ProfileDrawer