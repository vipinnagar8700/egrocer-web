import React from 'react'
import Profile from './Profile'
import Address from './Address'
import ActiveOrders from './orders/ActiveOrdersCard'
import OrderHistory from './orders/PrevOrderCard'
const ProfileSidePanel = ({ selectedTab, setSelectedTab }) => {
    return (
        <div>
            {selectedTab == "profile" && <Profile />}
            {selectedTab == "address" && <Address />}
            {selectedTab == "active-orders" && <ActiveOrders />}
            {selectedTab == "order-history" && <OrderHistory />}</div>
    )
}

export default ProfileSidePanel