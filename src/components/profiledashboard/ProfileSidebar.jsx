import Link from 'next/link';
import React, { useState } from 'react';
import { FaUserCircle, FaShoppingCart, FaWallet, FaCog } from "react-icons/fa";
import { useRouter } from 'next/router';
import WalletBalanceModal from './wallet/WalletBalanceModal';
import { useSelector } from 'react-redux';
import { t } from '@/utils/translation';
import Image from 'next/image';
import LogoutModal from '../logoutmodal/LogoutModal';
import DeleteModal from '../deleteModal/DeleteModal';
import { BiCartAlt, BiCog, BiUserCircle, BiWallet } from 'react-icons/bi';


const ProfileSidebar = ({ setSelectedTab, selectedTab }) => {
    const router = useRouter()
    const user = useSelector(state => state.User.user)
    const authType = useSelector(state => state.User.authType)
    const setting = useSelector(state => state?.Setting?.setting);

    const [addWalletModal, setAddWalletModal] = useState(false)
    const [showLogout, setShowLogout] = useState(false)
    const [showDelete, setShowDelete] = useState(false)


    const handleTabChange = (tabName) => {
        setSelectedTab(tabName)
    }

    const handleWalletBalanceModal = () => {
        setAddWalletModal(true)
    }


    const activeTab = router.pathname.split('/').pop();



    return (
        <div>
            <div className="cardBorder rounded-sm">
                {/* Header Section */}
                <div className='backgroundColor'>
                    <div className="flex items-center p-4">
                        <Image src={user?.profile} alt='Profile' height={0} width={0} className='w-12 h-12 rounded-sm' />
                        <div className="ml-3">
                            <p className="text-base textColor">{t("hello")},</p>
                            <p className="text-xl  font-semibold textColor">{user?.name}</p>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <div className=" ">
                        <h3 className="text-base font-semibold textColor flex items-center cardBorder p-4">
                            <BiUserCircle className="mr-2 textColor" size={20} /> {t("account_manage")}
                        </h3>
                        <ul>
                            <Link href={`/profile`}>
                                <li className={`p-4  cursor-pointer   ${activeTab == "profile" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4 primaryColor primaryColor' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("profile")}>
                                    <span className="font-medium">{t("editProfile")}</span>
                                </li>
                            </Link>
                            {authType == "email" || (authType == "phone" && setting?.phone_auth_password == 1) && <Link href={`/profile/resetpassword`}>
                                <li className={`p-4  cursor-pointer   ${activeTab == "resetpassword" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4 primaryColor primaryColor' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("profile")}>
                                    <span className="font-medium">{t("resetPassword")}</span>
                                </li>
                            </Link>}



                            <Link href={`/profile/address`}>
                                <li className={`p-4  cursor-pointer   ${activeTab == "address" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4 primaryColor' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("address")}>
                                    {t("manage_address")}
                                </li>
                            </Link>

                        </ul>
                    </div>

                    {/* Orders & Wishlist Manage Section */}
                    <div className="">
                        <h3 className="text-base font-semibold textColor  flex items-center  p-4 cardBorder">
                            <BiCartAlt className="mr-2 textColor" size={20} />{`${t("orders")} & ${t("wishlist")} ${t("manage")}`}

                        </h3>
                        <ul>
                            <Link href={`/profile/activeorders`}>
                                <li className={`p-4  cursor-pointer  textColor ${activeTab == "activeorders" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("activeorders")}>
                                    {t("active_orders")}
                                </li>
                            </Link>

                            <Link href={`/profile/orderhistory`}>
                                <li className={`p-4  cursor-pointer  ${activeTab == "orderhistory" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("orderhistory")}>
                                    {t("order_history")}
                                </li>
                            </Link>
                            <Link href={`/profile/wishlist`}>
                                <li className={`p-4  cursor-pointer  textColor ${activeTab == "wishlist" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("wishlist")}>
                                    {t("my_wishlist")}
                                </li>
                            </Link>

                        </ul>
                    </div>

                    {/* Payment Manage Section */}
                    <div className="">
                        <h3 className="text-base font-semibold textColor flex items-center  p-4 cardBorder">
                            <BiWallet className="mr-2 textColor" size={20} /> {`${t("payment")} ${t("manage")}`}
                        </h3>
                        <ul>
                            <li className="flex justify-between items-center p-4 rounded  textColor" >
                                <span>{t("walletBalance")}</span>
                                <span className="text-base text-orange-600 font-medium bg-[#EB9C001F] p-1 rounded-sm">{setting?.currency}{user?.balance}</span>
                            </li>
                            <li className={`p-4  cursor-pointer  textColor ${activeTab == "add-balance" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={handleWalletBalanceModal}>
                                {t("addWalletBalance")}
                            </li>
                            <Link href={`/profile/wallethistory`}>
                                <li className={`p-4  cursor-pointer  textColor ${activeTab == "wallethistory" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("wallethistory")}>
                                    {t("wallet_history")}
                                </li>
                            </Link>

                            <Link href={`/profile/transaction`}>
                                <li className={`p-4  cursor-pointer  textColor ${activeTab == "transaction" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("transaction")}>
                                    {t("transaction_history")}
                                </li>
                            </Link>
                        </ul>
                    </div>

                    {/* Other Settings Section */}
                    <div className=''>
                        <h3 className="text-base font-semibold textColor  flex items-center  p-4 cardBorder">
                            <BiCog className="mr-2 textColor" size={20} /> {`${t("address_type_other")} ${t("setting")}`}
                        </h3>
                        <ul>
                            <Link href={`/profile/notifications`}>
                                <li className={`p-4  cursor-pointer  textColor ${activeTab == "notifications" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("notifications")}>
                                    {t("notification")}
                                </li>
                            </Link>
                            <li className={`p-4 rounded cursor-pointer hover:primaryBackColor hover:text-white textColor`} onClick={() => setShowLogout(true)}>
                                {t("logout")}
                            </li>
                            <li className={`p-4 rounded cursor-pointer hover:primaryBackColor hover:text-white textColor`} onClick={() => setShowDelete(true)}>
                                {t("delete_account")}
                            </li>
                        </ul>
                    </div>
                </div>
                <WalletBalanceModal addWalletModal={addWalletModal} setAddWalletModal={setAddWalletModal} />
                <LogoutModal showLogout={showLogout} setShowLogout={setShowLogout} />
                <DeleteModal showDelete={showDelete} setShowDelete={setShowDelete} />
            </div>
        </div>
    )
}

export default ProfileSidebar