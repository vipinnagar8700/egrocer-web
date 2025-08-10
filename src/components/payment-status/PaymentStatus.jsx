"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import * as api from "@/api/apiRoutes";
import {
  clearCartPromo,
  setCart,
  setCartProducts,
  setCartSubTotal,
} from "@/redux/slices/cartSlice";
import { clearCheckout } from "@/redux/slices/checkoutSlice";
import { t } from "@/utils/translation";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animationOne from "@/assets/order_place_animation/order_placed_back_animation.json";
import animationTwo from "@/assets/order_place_animation/order_success_tick_animation.json";
import animationFailed from "@/assets/order_place_animation/order_failed_animation.json";

const PaymentStatus = () => {
  const dispatch = useDispatch();
  const phonePeData = useSelector(
    (state) => state.Checkout.phonepecheckoutdetails
  );
  const router = useRouter();
  const { query } = router;

  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const checkPaymentStatus = ({ status, status_code, transaction_status }) => {
    if (status === "pending" || transaction_status === "pending")
      return "pending";
    if (
      status === "success" ||
      status === "PAYMENT_SUCCESS" ||
      (status_code === "200" && transaction_status === "capture")
    )
      return "success";
    return "failed";
  };
  const isWalletTransaction = ({ type, order_id }) =>
    type === "wallet" || order_id?.startsWith("wallet-");

  useEffect(() => {
    setTimeout(() => {
      if (type == "wallet") {
        handleWalletClose();
      } else {
        handlePaymentClose();
      }
    }, 3000);
  }, []);

  useEffect(() => {
    if (!query || Object.keys(query).length === 0) return;
    if (query?.payment_method == "phonepe") {
      handleGetOrderStatusPhonepe();
      return;
    }
    const paymentStatus = checkPaymentStatus(query);
    const isWallet = isWalletTransaction(query);
    setType(isWallet ? "wallet" : "order");
    setStatus(paymentStatus);
  }, [query]);

  const handleWalletClose = () => {
    router.replace("/");
  };

  const handleGetOrderStatusPhonepe = async () => {
    try {
      const response = await api.getOrderStatusPhonepe({
        token: phonePeData.token,
        transaction_id: phonePeData.merchantOrderId,
      });

      if (response?.data?.status == "COMPLETED") {
        setStatus("success");
      } else if (response?.data?.status == "FAILED") {
        await handleFailedOrder(response?.data?.order_id);
        setStatus("failed");
      } else {
        await handleFailedOrder(response?.data?.order_id);
        setStatus("pending");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handlePaymentClose = async () => {
    try {
      const response = await api.deleteCart();
      if (response.status === 1) {
        dispatch(setCart({ data: [] }));
        dispatch(clearCartPromo());
        dispatch(setCartSubTotal({ data: 0 }));
        dispatch(setCartProducts({ data: [] }));
        dispatch(clearCheckout());
        router.replace("/");
      } else {
        console.error("Error clearing cart", response);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const extractOrderNumber = (orderId) => {
    if (!orderId) return null;
    const regex = /^order-(\d+)-\d+$/;
    const match = orderId.match(regex);
    return match ? match[1] : /^\d+$/.test(orderId) ? orderId : null;
  };

  const handleFailedOrder = async (orderId = null) => {
    if (!query || Object.keys(query).length === 0) return;
    let localOrderId;
    if (orderId == null) {
      localOrderId = extractOrderNumber(query.order_id);
    } else {
      localOrderId = orderId;
    }
    try {
      await api.deleteOrder({ orderId: localOrderId });
      dispatch(clearCheckout());
      router.push("/");
    } catch (error) {
      console.error("Error", error);
    }
  };

  // const handleViewOrder = async () => {
  //     const orderId = extractOrderNumber(query?.order_id);
  //     dispatch(setCart({ data: [] }));
  //     dispatch(clearCartPromo());
  //     dispatch(setCartSubTotal({ data: 0 }));
  //     dispatch(setCartProducts({ data: [] }));
  //     dispatch(clearCheckout());
  //     router.push(`/order-detail/${orderId}`);
  // };

  const renderContent = () => {
    if (status == "success") {
      return (
        <div className="flex flex-col items-center gap-8">
          <div className="relative h-44">
            <Lottie
              className="h-44"
              animationData={animationTwo}
              loop={false}
            />
            <Lottie
              className="h-44 absolute z-60 -left-5 top-0"
              animationData={animationOne}
              loop={true}
            />
            <Lottie
              className="h-44 absolute z-60 -right-5 top-0"
              animationData={animationOne}
              loop={true}
            />
          </div>
          <div className="text-center mt-8">
            <h1 className="text-2xl font-semibold">
              {type == "wallet"
                ? t("wallet_add_description")
                : t("order_placed_description")}
            </h1>
            <div className="flex flex-col md:flex-row justify-center gap-4 mx-4 mt-8">
              <button
                className="primaryBackColor text-white px-2 md:px-8 py-2 rounded-sm font-bold text-xl"
                onClick={
                  type == "wallet" ? handleWalletClose : handlePaymentClose
                }
              >
                {t("home")}
              </button>
              {/* {(type == "order") ? (query?.payment_method === "COD" || query?.payment_method === "wallet") ? <></> : <button className="primaryBackColor text-white px-2 md:px-7 py-2 rounded-sm font-bold text-xl" onClick={handleViewOrder}>
                                {t("view_order_details")}
                            </button> : <></>} */}
            </div>
          </div>
        </div>
      );
    }

    if (status == "failed") {
      return (
        <div className="flex flex-col relative gap-8">
          <Lottie
            className="h-44"
            animationData={animationFailed}
            loop={false}
          />
          <div className="text-center mt-8">
            <h1 className="text-2xl">{t("order_failed_description")}</h1>
            <button
              className="mt-8 primaryBackColor text-white px-8 py-2 rounded-sm font-bold text-xl"
              onClick={type == "wallet" ? handleWalletClose : handleFailedOrder}
            >
              {t("home")}
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="min-h-[600px] flex items-center">
      <div className="container">{renderContent()}</div>
    </section>
  );
};

export default PaymentStatus;
