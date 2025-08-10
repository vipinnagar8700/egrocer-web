import React, { useEffect, useState } from "react";
import { t } from "@/utils/translation";
import NotificationCard from "../notifications/NotificationCard";
import * as api from "../../api/apiRoutes";
import NoNotificationImage from "@/assets/not_found_images/No_Notification.svg"
import Image from "next/image";
import CardSkeleton from "../skeleton/CardSkeleton";

const Notifications = ({ selectedTab, setSelectedTab }) => {
  const total_notifications_per_page = 7;

  const [notifications, setNotifications] = useState([]);
  const [currPage, setCurrPage] = useState(1)
  const [offset, setoffset] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [totalNotications, setTotalNotifications] = useState(null)

  useEffect(() => {
    if (selectedTab === "notifications") {
      handleFetchNotifications();
    }
  }, [selectedTab]);

  const handleFetchNotifications = async (offset = 0) => {
    setIsLoading(true);
    try {
      const response = await api.getNotifications({ limit: total_notifications_per_page, offset });
      setTotalNotifications(response.total)
      setNotifications([...notifications, ...response?.data]);
      setIsLoading(false);
    } catch (error) {
      console.log("Error ", error);
    }
  };

  const handleLoadMore = (pageNum) => {
    setCurrPage(pageNum);
    setoffset(pageNum * total_notifications_per_page - total_notifications_per_page);
    handleFetchNotifications(pageNum * total_notifications_per_page - total_notifications_per_page);
  };

  return (
    <div>
      <div className="cardBorder rounded-sm">
        <div className="backgroundColor flex justify-between p-4 items-center">
          <h2 className="font-bold text-xl">{t("notification")}</h2>
        </div>
        {isLoading && Array.from({ length: total_notifications_per_page }).map((_, idx) => (
          <div key={idx} className='w-full'>
            <CardSkeleton height={100} padding='p-1' />
          </div>
        ))}
        {notifications?.length > 0 ?
          notifications?.map((notification, idx) => (
            <NotificationCard
              notification={notification}
              key={notification?.id}
            />
          ))
          : <div className=' col-span-12 h-full w-full flex items-center justify-center flex-col gap-2 p-2'>
            <Image src={NoNotificationImage} alt='Notification Not found' height={0} width={0} className='h-3/4 w-3/4' />
            <h2 className='text-2xl font-bold'>{t("empty_notification_list_message")}</h2>
          </div>}

        {notifications?.length < totalNotications &&
          <div className="flex justify-center py-4">
            <button className='px-4 py-2 h-full flex  items-center rounded font-medium text-whiterounded  focus:outline-none bg-[#29363f] text-white text-xl shadow'
              onClick={() => handleLoadMore(currPage + 1)}
            >
              {t("load_more")}
            </button>
          </div>
        }
      </div>
    </div>
  );
};

export default Notifications;
