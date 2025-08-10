import React, { useState, useEffect } from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import ProfileSidebar from "./ProfileSidebar";
import Profile from "./Profile";
import Address from "./Address";
import ActiveOrders from "./orders/ActiveOrders";
import OrderHistory from "./orders/PrevOrder";
import Wishlist from "./Wishlist";
import { useRouter } from "next/router";
import WalletHistory from "./wallet/WalletHistory";
import TransactionHistory from "./transactions/TransactionHistory";
import Notifications from "./Notifications";
import { setCurrentUser } from "@/redux/slices/userSlice";
import * as api from "@/api/apiRoutes"
import { useDispatch } from "react-redux";
import ResetPassword from "./ResetPassword";
import withAuth from "@/checkauth/CheckAuth";
import CardSkeleton from "../skeleton/CardSkeleton";

const ProfileDashboard = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("profile");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const currentTab = router.pathname.split('/').pop();
    setSelectedTab(currentTab || 'profile');

  }, [router.pathname]);

  useEffect(() => {
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    setLoading(true)
    try {
      const response = await api.getUser();
      dispatch(setCurrentUser({ data: response.user }));
      setLoading(false)
    } catch (error) {
      console.log("error", error);
      setLoading(false)
    }
  };

  const activeTab = router.pathname.split('/').pop();

  return (
    <section>
      <BreadCrumb />
      <div className="container px-2">
        <div className="grid grid-cols-12 gap-6 my-10">
          <div className="md:col-span-3 hidden md:block">
            <ProfileSidebar
              setSelectedTab={setSelectedTab}
              selectedTab={selectedTab}
            />
          </div>

          <div className='col-span-12 md:col-span-9  '>
            {loading ?
              <div className="flex flex-col gap-2">
                <CardSkeleton height={50} />
                <CardSkeleton height={800} />
              </div> : <>
                {activeTab == "profile" && <Profile />}
                {activeTab == "resetpassword" && <ResetPassword />}
                {activeTab == "address" && <Address />}
                {activeTab == "activeorders" && <ActiveOrders />}
                {activeTab == "orderhistory" && <OrderHistory />}
                {activeTab == "wishlist" && <Wishlist />}
                {activeTab == "wallethistory" && <WalletHistory />}
                {activeTab == "transaction" && <TransactionHistory />}
                {activeTab == "notifications" && <Notifications selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
              </>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default withAuth(ProfileDashboard);
