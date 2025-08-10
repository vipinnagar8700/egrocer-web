import { t } from "@/utils/translation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setCheckoutTotal } from "@/redux/slices/checkoutSlice";
import { useDispatch } from "react-redux";

const OrderSummaryCard = ({
  step,
  checkoutData,
  handlePlaceOrder,
  checkOutError,
}) => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.Setting.setting);
  const user = useSelector((state) => state.User);
  const checkout = useSelector((state) => state.Checkout);
  const cart = useSelector((state) => state.Cart);

  useEffect(() => {
    // Calculate new total amount based on wallet balance usage
    if (checkout?.isWalletChecked) {
      const updatedTotal = Math.max(
        (checkoutData?.total_amount || 0) - (user?.user?.balance || 0),
        0 // Ensure total doesn't go below 0
      );
      dispatch(setCheckoutTotal({ data: updatedTotal }));
    } else {
      dispatch(setCheckoutTotal({ data: checkoutData?.total_amount || 0 }));
      // setCheckoutTotal(checkoutData?.total_amount || 0); // Reset to original total
    }
  }, [
    checkout?.isWalletChecked,
    checkoutData?.total_amount,
    user?.user?.balance,
  ]);

  return (
    <div className="w-full mx-auto cardBorder rounded-lg p-6 ">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold ">{t("sub_total")}</span>
        {checkOutError == false ? (
          <span className="font-semibold ">
            {setting?.currency} {checkoutData?.sub_total?.toFixed(2)}
          </span>
        ) : (
          <span className="font-semibold ">
            {setting?.currency} {cart?.cart?.sub_total?.toFixed(2)}
          </span>
        )}
      </div>
      {checkOutError == false && (
        <div className="flex justify-between items-center mb-2">
          <span className="">{t("delivery_charge")}</span>
          <span className="">
            {setting?.currency}{" "}
            {checkoutData?.delivery_charge?.total_delivery_charge}
          </span>
        </div>
      )}

      {checkoutData?.promocode_details && checkOutError == false && (
        <div className="flex justify-between items-center mb-2">
          <a href="#" className="">
            {t("promoDiscount")}
          </a>
          <span className="">
            - {setting?.currency} {checkoutData?.promocode_details?.discount}
          </span>
        </div>
      )}
      {checkout?.isWalletChecked && (
        <div className="flex justify-between items-center mb-2">
          {t("wallet_balance_used")}

          <span className="">
            - {setting?.currency} {checkout?.usedWalletBalance?.toFixed(2)}
          </span>
        </div>
      )}
      <hr className="border-gray-300 mb-4" />
      <div className="flex justify-between items-center mb-6 backgroundColor p-3 rounded-sm">
        <span className="text-lg font-bold ">{t("total")}</span>
        {checkOutError == false ? (
          <span className="font-semibold ">
            {setting?.currency}{" "}
            {checkout?.isWalletChecked
              ? (
                  Number(checkoutData?.total_amount) -
                  Number(checkout?.usedWalletBalance)
                ).toFixed(2)
              : checkoutData?.total_amount?.toFixed(2)}
          </span>
        ) : (
          <span className="font-semibold ">
            {setting?.currency} {cart?.cart?.sub_total?.toFixed(2)}
          </span>
        )}
      </div>
      <button
        className="w-full primaryBackColor text-white font-semibold py-2 rounded-md  disabled:iconBackgroundColor disabled:cursor-not-allowed disabled:fontColor"
        disabled={step !== 3}
        onClick={handlePlaceOrder}
      >
        {t("place_order")}
      </button>
      <div className="text-center rounded w-full hover:primaryBackColor hover:text-white p-2 mt-2">
        <Link href="/cart" className=" underline font-medium  w-full ">
          {t("backToCart")}
        </Link>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
