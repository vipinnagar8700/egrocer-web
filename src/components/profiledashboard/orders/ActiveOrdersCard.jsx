import React, { useState } from "react";
import { t } from "@/utils/translation";
import Image from "next/image";
import DemoImage from "/public/demo.png";
import { IoIosArrowRoundForward } from "react-icons/io";
import { formatCustomDate } from "@/lib/utils";
import { useSelector } from "react-redux";
import Link from "next/link";
import LiveTrackingModal from "./LiveTrackingModal";
import ReoderConfirmModal from "./ReoderConfirmModal";
import ImageWithPlaceholder from "@/components/image-with-placeholder/ImageWithPlaceholder";

const ActiveOrdersCard = ({ order }) => {
  const [showReoderModal, setShowReorderModal] = useState(false);
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const setting = useSelector((state) => state.Setting);

  const getOrderStatus = () => {
    switch (order?.active_status) {
      case "1":
        return (
          <span className="p-2 text-center w-10/12 border-[1px] border-[#e3aa0e] rounded-sm text-base font-bold text-[#e3aa0e]">
            {t("paymentPending")}
          </span>
        );
      case "2":
        return (
          <span className="p-2 text-center w-10/12 border-[1px] border-[#319795] rounded-sm text-base font-bold text-[#319795]">
            {t("order_status_display_name_recieved")}
          </span>
        );
      case "3":
        return (
          <span className="p-2 text-center w-10/12 border-[1px] border-[#805AD5] rounded-sm text-base font-bold text-[#805AD5]">
            {t("processed")}
          </span>
        );
      case "4":
        return (
          <span className="p-2 text-center w-10/12 border-[1px] border-[#3182CE] rounded-sm text-base font-bold text-[#3182CE]">
            {t("order_status_display_name_shipped")}
          </span>
        );
      case "5":
        return (
          <span className="p-2 text-center w-10/12 border-[1px] border-[#2D3748] rounded-sm text-base font-bold text-[#2D3748]">
            {t("out_for_delivery")}
          </span>
        );
      case "6":
        return (
          <span className="p-2 text-center w-10/12 border-[1px] border-[#2D3748] rounded-sm text-base font-bold text-[#2D3748]">
            {t("order_status_display_name_delivered")}
          </span>
        );
      case "7":
        return (
          <span className="p-2 text-center w-10/12 border-[1px] border-[#db3232] rounded-sm text-base font-bold text-[#db3232]">
            {t("cancelled")}
          </span>
        );
      case "8":
        return (
          <span className="p-2 text-center w-10/12 border-[1px] border-[#458ae6] rounded-sm text-base font-bold text-[#458ae6]">
            {t("returned")}
          </span>
        );
      default:
        return (
          <span className="p-2 text-center w-10/12 border-[1px] border-[#458ae6] rounded-sm text-base font-bold text-[#458ae6]">
            {t("returned")}
          </span>
        );
    }
  };

  const orderFirstItem = order?.items[0];

  const handleShowLiveTracking = () => {
    setShowLiveTracking(true);
  };

  const handleReoder = () => {
    setShowReorderModal(true);
  };

  return (
    <div className="w-full   ">
      <div className="py-3 px-4">
        <div className="w-full cardBorder rounded-md">
          <div className="flex flex-col gap-3 md:gap-0 md:grid grid-cols-12 p-4 border-b-2">
            <div className="col-span-1  ">
              <p className="font-normal text-sm">{t("order")}</p>
              <p className="font-bold text-sm">{order?.id}</p>
            </div>
            <div className="col-span-8">
              <p className="font-normal text-sm">{t("orderDate")}</p>
              <p className="font-bold text-sm">
                {formatCustomDate(order?.date)}
              </p>
            </div>
            <div className="col-span-3 flex flex-col items-start md:items-end">
              <p className="font-normal text-sm">{t("orderStatus")}</p>
              {getOrderStatus()}
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between gap-2 md:gap-0 mb-4 w-full">
              <div className="flex items-start gap-2 w-full">
                <div
                  className={`relative aspect-square shrink-0 ${
                    orderFirstItem?.image_url
                      ? "h-[64px] w-[64px]"
                      : "h-[44px] w-[44px]"
                  }`}
                >
                  {orderFirstItem?.image_url && (
                    <ImageWithPlaceholder
                      src={orderFirstItem?.image_url}
                      alt="demo image"
                      fill
                      className="h-full w-full rounded-sm"
                    />
                  )}
                </div>
                <div className="flex flex-col md:flex-row justify-between w-full">
                  <div className="flex-grow">
                    <p className="font-bold text-base text-ellipsis overflow-hidden w-32">
                      {orderFirstItem?.name}
                    </p>
                    <p className="text-sm font-normal">
                      {orderFirstItem?.variant_name}
                    </p>
                  </div>

                  <div className="md:ml-auto md:mt-0">
                    {orderFirstItem?.discounted_price != 0 ? (
                      <div className="flex gap-1">
                        <p className="text-base font-bold">
                          {setting?.setting?.currency}
                          {orderFirstItem?.discounted_price}
                        </p>
                        <p className="text-base font-normal line-through">
                          {setting?.setting?.currency}
                          {orderFirstItem?.price}
                        </p>
                      </div>
                    ) : (
                      <p className="text-base font-bold">
                        {setting?.setting?.currency}
                        {orderFirstItem?.price}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {order?.items?.length > 1 && (
              <button className="rounded-full py-2 px-3 bg-[#12141814] font-medium text-base">
                +{order?.items?.length - 1} {t("moteItems")}
              </button>
            )}
          </div>
          <div className="backgroundColor">
            <div
              className={`flex justify-between p-4 flex-col md:flex-row gap-1 md:gap-0`}
            >
              <div className="flex gap-1 items-center">
                <span>
                  {t("total")} {t("Credit")}{" "}
                </span>
                <span className="font-bold text-lg">
                  {" "}
                  {setting?.setting?.currency}
                  {order?.final_total}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/order-detail/${order?.id}`}
                  className="py-2 px-3 hover:primaryBackColor hover:text-white rounded-sm"
                >
                  {t("view_details")}
                </Link>
                {order?.active_status == "5" ? (
                  <button
                    className="py-2 px-3 primaryBackColor text-white rounded-sm flex  items-center gap-1 text-base font-medium"
                    onClick={handleShowLiveTracking}
                  >
                    {t("track_order")}{" "}
                    <IoIosArrowRoundForward size={20} className="p-0 m-0" />
                  </button>
                ) : null}
                <button
                  className="cardBorder py-2 px-3 rounded-sm font-medium text-base hover:primaryBackColor hover:text-white"
                  onClick={handleReoder}
                >
                  {t("reorder")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LiveTrackingModal
        showLiveTracking={showLiveTracking}
        setShowLiveTracking={setShowLiveTracking}
        order={order}
      />
      <ReoderConfirmModal
        showReoderModal={showReoderModal}
        setShowReorderModal={setShowReorderModal}
        order={order}
      />
    </div>
  );
};

export default ActiveOrdersCard;
