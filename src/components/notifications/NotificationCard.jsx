import { formatCustomDate } from "@/lib/utils";
import { setFilterCategory } from "@/redux/slices/productFilterSlice";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { FaRegBell } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";

const NotificationCard = ({ notification }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleCategoryNotificationClick = (notification) => {
    if (notification?.type === "category") {
      dispatch(setFilterCategory({ data: `${catId},` }));
      router.push("/products");
    } else if (notification?.type === "product") {
      router.push(`/products/${notification?.type_id}`);
    }
    return;
  };

  return (
    <div className="flex flex-row flex-wrap justify-start sm:justify-center items-center border border-b-1 p-4 gap-4 sm:p-8 sm:flex-nowrap">
      <div className="rounded w-12 h-12 p-2 primaryBackColor">
        {notification?.image_url !== "" ? (
          <Image
            src={notification?.image_url}
            alt="notificationImg"
            loading="lazy"
            height={0}
            width={0}
          />
        ) : (
          <FaRegBell className="text-white" size={30} />
        )}
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-col flex-wrap md:flex-row justify-between text-base textColor">
          <div
            className="font-bold flex-wrap justify-items-start cursor-pointer"
            onClick={() => handleCategoryNotificationClick(notification)}
          >
            {notification?.title?.length > 55
              ? `${notification?.title?.substr(0, 55)}...`
              : notification?.title}
          </div>
          <div className="flex items-center gap-2">
            <IoTimeOutline />
            <div className="opacity-70 text-nowrap">
              {formatCustomDate(notification?.date_sent)}
            </div>
          </div>
        </div>
        <div className="textColor text-sm text-justify">
          {notification?.message}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
