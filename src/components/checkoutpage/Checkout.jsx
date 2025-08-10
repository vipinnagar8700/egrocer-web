"use client";
import React, { useEffect, useState } from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import Stepper from "./Stepper";
import AddressCard from "../cards/AddressCard";
import { t } from "@/utils/translation";
import { GoPlus, GoPlusCircle } from "react-icons/go";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FaRegCalendarAlt } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CheckoutPayment from "./CheckoutPayment";
import OrderSummaryCard from "./OrderSummaryCard";
import { useDispatch, useSelector } from "react-redux";
import NewAddressModal from "../newaddressmodal/NewAddressModal";
import * as api from "@/api/apiRoutes";
import {
  clearCartPromo,
  setCartCheckout,
  setCartPromo,
} from "@/redux/slices/cartSlice";
import { setAllAddresses } from "@/redux/slices/addressSlice";
import {
  setAddress,
  setSelectedDate,
  setCurrentStep,
  setTimeSlot,
  setOrderNote,
  setCheckoutTotal,
  setPhonePeCheckoutDetails,
} from "@/redux/slices/checkoutSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { setCurrentUser } from "@/redux/slices/userSlice";
import StripeModal from "./StripeModal";
import PaystackPop from "@paystack/inline-js";
import Loader from "../loader/Loader";
import CheckoutSkeleton from "./CheckoutSkeleton";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const city = useSelector((state) => state.City.city);
  const cart = useSelector((state) => state.Cart);
  const address = useSelector((state) => state.Addresses);
  const user = useSelector((state) => state.User.user);
  const setting = useSelector((state) => state.Setting);

  const checkout = useSelector((state) => state.Checkout);

  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showStripe, setShowStripe] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // stripe variables
  const [stripeOrderId, setStripeOrderId] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [stripeTransactionId, setStripeTransactionId] = useState(null);
  // step 1 variables
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [showAddAddres, setShowAddAddres] = useState(false);
  const [checkOutError, setCheckOutError] = useState(false);
  const [checkOutErrorMsg, setCheckOutErrorMsg] = useState("");
  // step 2 Variables
  // const [selectedDate, setSelectedDate] = useState(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [timeSlotsData, setTimeSlotsData] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  const [availabeleTimeSlot, setAvailableTimeSlot] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // step 3 variables
  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();

  useEffect(() => {
    fetchAddress();
    handleFetchTimeSlots();
    getCurrentUser();
  }, []);

  useEffect(() => {
    validateCouponCode();
  }, [cart?.cart, checkout?.address, cart?.cartProducts]);

  useEffect(() => {
    handleFetchCheckout();
  }, [cart?.cart, cart?.promo_code, checkout?.address, cart?.cartProducts]);

  const getCurrentUser = async () => {
    try {
      const response = await api.getUser();
      dispatch(setCurrentUser({ data: response.user }));
    } catch (error) {
      console.log("error", error);
    }
  };

  const validateCouponCode = async () => {
    try {
      const response = await api.setPromoCode({
        promoCodeName: cart?.promo_code?.promo_code,
        amount: cart?.cartSubTotal,
      });
      if (response.status == 1) {
        dispatch(setCartPromo({ data: response.data }));
      } else {
        dispatch(clearCartPromo());
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    handleFilterTimeSlots();
  }, [checkout?.selectedDate]);

  const handleFetchCheckout = async () => {
    const couponseCodeId = cart?.promo_code?.promo_code_id;
    try {
      const response = await api.getCart({
        latitude: checkout?.address?.latitude,
        longitude: checkout?.address?.longitude,
        checkout: 1,
        promocode_id: couponseCodeId,
      });
      if (response?.status == 1) {
        dispatch(setCartCheckout({ data: response?.data }));
        dispatch(setCheckoutTotal({ data: response?.data?.total_amount }));
        setCheckoutData(response?.data);
        setCheckOutError(false);
      } else {
        setCheckOutError(true);
        setCheckOutErrorMsg(response?.message);
      }
    } catch (error) {
      console.log("Error", error);
      setCheckOutError(true);
    }
  };

  const handleSelectedDate = (date) => {
    const currentDate = new Date();
    const finalDate = currentDate.setHours(0, 0, 0, 0);
    if (date < finalDate) {
      toast.info("Please select a valid date");
    }

    dispatch(setSelectedDate({ data: date }));
    setIsPopoverOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return t("choose_date");
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const fetchAddress = async () => {
    setLoading(true);
    try {
      const response = await api.getAddress();
      if (response.status == 1) {
        dispatch(setAllAddresses({ data: response.data }));
        const defaultAddress = response?.data?.find(
          (address) => address.is_default == 1
        );
        dispatch(setAddress({ data: defaultAddress }));
        setLoading(false);
      } else {
        setLoading(false);
        dispatch(setAllAddresses({ data: [] }));
      }
    } catch (error) {
      setLoading(false);
      console.log("Error", error);
    }
  };

  const handleFilterTimeSlots = () => {
    const currentDate = new Date(); // Current date and time
    const userSelectedDate = new Date(
      checkout?.selectedDate ? checkout?.selectedDate : new Date()
    );

    const updatedTimeSlots = timeSlots.map((slot) => {
      // Create date object for the slot's last order time
      const lastOrderTime = new Date(checkout?.selectedDate);
      const [hours, minutes, seconds] = slot.last_order_time
        .split(":")
        .map(Number);
      lastOrderTime.setHours(hours, minutes, seconds);

      // Check if the selected date is today
      const isToday =
        userSelectedDate.toDateString() === currentDate.toDateString();

      // Disable slot only if it's today AND the current time is past the last order time
      const isDisabled = isToday && currentDate >= lastOrderTime;

      return {
        ...slot,
        isDisabled,
      };
    });

    setAvailableTimeSlot(updatedTimeSlots); // Update the state with filtered slots
  };

  const handleFetchTimeSlots = async (selectedDate) => {
    setLoading(true);
    try {
      const response = await api.getTimeSlots();
      const allTimeSlots = response?.data?.time_slots || [];
      setTimeSlotsData(response?.data); // Store the full response data if needed
      setTimeSlots(allTimeSlots); // Store the original time slots
      handleFilterTimeSlots(selectedDate); // Filter the time slots based on the selected date
      setLoading(false);
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    }
  };

  const handleTimeSlotChange = (value) => {
    setSelectedTimeSlot(value);
    dispatch(setTimeSlot({ data: value }));
  };

  const handleChangeOrderNote = (e) => {
    dispatch(setOrderNote({ data: e.target.value }));
  };

  const handleShowAddress = () => {
    setIsAddressSelected(false);
    setShowAddAddres(true);
  };

  const handleFirstStep = () => {
    if (checkOutError) {
      toast.error(t(checkOutErrorMsg));
      return;
    } else {
      dispatch(setCurrentStep({ data: 2 }));
    }
  };

  const handleSecondStep = () => {
    if (checkout?.selectedDate == null) {
      toast.error(t("please_select_date"));
      return;
    } else if (
      timeSlotsData?.time_slots_is_enabled == "true" &&
      checkout?.timeSlot == null
    ) {
      toast.error(t("please_select_time_slot"));
      return;
    }

    dispatch(setCurrentStep({ data: 3 }));
  };

  const formatDateToDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateWithTimeSlot = (date, timeSlot) => {
    const formattedDate = formatDateToDDMMYYYY(date);
    return timeSlot ? `${formattedDate} ${timeSlot.title}` : formattedDate;
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      // document.body.appendChild(script);
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const handleRozarpayPayment = async (
    order_id,
    razorpay_transaction_id,
    amount,
    capilizePaymeneMethod
  ) => {
    try {
      const res = await initializeRazorpay();
      if (!res) {
        console.error("RazorPay SDK Load Failed");
        return;
      }
      const key = setting?.payment_setting?.razorpay_key;
      const convertedAmount = Math.floor(amount * 100);
      const options = {
        key: key,
        amount: convertedAmount,
        currency: "INR",
        name: user?.user?.name,
        description: setting?.setting?.app_name,
        image: setting?.setting?.web_settings.web_logo,
        order_id: razorpay_transaction_id,
        handler: async (res) => {
          if (res.razorpay_payment_id) {
            try {
              setPaymentLoading(true);
              const response = await api.addTransaction({
                orderId: order_id,
                transactionId: res.razorpay_payment_id,
                paymentMethod: capilizePaymeneMethod,
                type: "order",
              });
              if (response.status === 1) {
                setPaymentLoading(false);
                return router.push(
                  `/web-payment-status?status=success&type=order&payment_method=${checkout?.selectedPaymentMethod}&order_id=${order_id}`
                );
              } else {
                setPaymentLoading(false);
                toast.error(response.message);
              }
            } catch (error) {
              console.error("Transaction error:", error);
            }
          }
        },
        modal: {
          confirm_close: true,
          ondismiss: async (reason) => {
            if (reason === undefined) {
              await handleRazorpayCancel(order_id);
              // dispatch(deductUserBalance({ data: walletDeductionAmt || 0 }));
            }
          },
        },
        prefill: {
          name: user?.user?.name,
          email: user?.user?.email,
          contact: user?.user?.mobile,
        },
        notes: {
          address: "Razorpay Corporate",
        },
        theme: {
          color: setting?.setting?.web_settings.color,
        },
      };

      const rzpay = new window.Razorpay(options);
      rzpay.on("payment.cancel", (response) => {
        handleRazorpayCancel(order_id);
      });
      rzpay.on("payment.failed", (response) => {
        api.deleteOrder({ orderId: order_id });
      });
      rzpay.open();
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
    }
  };

  const handleRazorpayCancel = async (order_id) => {
    await api.deleteOrder({ orderId: order_id });
  };

  const handlePayStackPayment = async (
    orderId,
    amount,
    capilizePaymeneMethod
  ) => {
    try {
      const handler = PaystackPop.setup({
        key:
          setting.payment_setting &&
          setting.payment_setting.paystack_public_key,
        email: user && user?.email,
        amount: parseFloat(amount) * 100,
        currency:
          setting?.payment_setting &&
          setting?.payment_setting?.paystack_currency_code,
        ref: new Date().getTime().toString(),
        label: setting?.setting && setting?.setting?.support_email,
        onClose: function () {
          api.deleteOrder({ orderId: orderId });
          // setWalletAmount(user.user.balance);
          // dispatch(setWallet({ data: 0 }));
        },
        callback: async function (res) {
          try {
            setPaymentLoading(true);
            const response = await api.addTransaction({
              orderId: orderId,
              transactionId: res.reference,
              paymentMethod: capilizePaymeneMethod,
              type: "order",
            });
            if (response.status == 1) {
              setPaymentLoading(false);
              return router.push(
                `/web-payment-status?status=success&type=order&payment_method=${checkout?.selectedPaymentMethod}&order_id=${orderId}`
              );
            } else {
              setPaymentLoading(false);
              toast.error(response.message);
              console.log("error", response);
            }
          } catch (error) {
            console.log("Error", error);
          }
        },
      });
      handler.openIframe();
    } catch (error) {
      console.log("Paytabs Error", error);
    }
  };

  const handlePlaceOrder = async () => {
    const formatDate = formatDateWithTimeSlot(
      checkout?.selectedDate,
      checkout?.timeSlot
    );
    const capilizePaymeneMethod =
      String(checkout?.selectedPaymentMethod).charAt(0).toUpperCase() +
      String(checkout?.selectedPaymentMethod).slice(1);
    const status =
      checkout?.selectedPaymentMethod === "COD" ||
      checkout?.selectedPaymentMethod === "wallet"
        ? 2
        : 1;
    try {
      if (checkout?.selectedPaymentMethod == null) {
        toast.error("Please select payment method");
        return;
      } else if (checkout?.selectedDate == null) {
        toast.error("Please select date");
        return;
      } else if (checkout?.address == null) {
        toast.error("Please select address");
        return;
      } else {
        const response = await api.placeOrder({
          productVariantId: cart?.checkout?.product_variant_id,
          quantity: cart?.checkout?.quantity,
          total: cart?.checkout?.sub_total,
          deliveryCharge:
            cart?.checkout?.delivery_charge?.total_delivery_charge,
          finalTotal: checkout?.checkoutTotal,
          walletUsed: checkout?.isWalletChecked,
          walletBalance: checkout?.usedWalletBalance,
          addressId: checkout?.address?.id,
          deliveryTime: formatDate,
          orderNote: checkout?.orderNote,
          paymentMethod: checkout?.selectedPaymentMethod,
          promocodeId: cart?.promo_code?.promo_code_id,
          status: status,
        });
        if (response?.status == 1) {
          dispatch(setOrderNote(""));
          if (
            checkout?.selectedPaymentMethod === "COD" ||
            checkout?.selectedPaymentMethod === "wallet"
          ) {
            await handleInitiateTransaction();
          } else {
            setOrderId(response?.data?.order_id);
            await handleInitiateTransaction(
              response?.data?.order_id,
              capilizePaymeneMethod
            );
          }
        } else {
          toast.error(response?.message);
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleInitiateTransaction = async (
    currentOrderID,
    capilizePaymeneMethod
  ) => {
    try {
      if (checkout?.selectedPaymentMethod == "COD") {
        // redirect after successfull COD order
        return router.push(
          `/web-payment-status?status=success&type=order&payment_method=${checkout?.selectedPaymentMethod}`
        );
      } else if (checkout?.selectedPaymentMethod == "wallet") {
        // redirect after successfull wallet order
        return router.push(
          `/web-payment-status?status=success&type=order&payment_method=${checkout?.selectedPaymentMethod}`
        );
      } else if (checkout?.selectedPaymentMethod == "paystack") {
        handlePayStackPayment(
          currentOrderID,
          checkout?.checkoutTotal,
          capilizePaymeneMethod
        );
      } else {
        const response = await api.initiateTrasaction({
          orderId: currentOrderID,
          paymentMethod: capilizePaymeneMethod,
          type: "order",
        });
        if (response.status == 1) {
          if (checkout?.selectedPaymentMethod == "phonepe") {
            dispatch(setPhonePeCheckoutDetails(response?.data));
          }
          if (checkout?.selectedPaymentMethod == "razorpay") {
            handleRozarpayPayment(
              currentOrderID,
              response?.data?.transaction_id,
              checkout?.checkoutTotal,
              capilizePaymeneMethod
            );
          } else if (checkout?.selectedPaymentMethod == "stripe") {
            setStripeOrderId(currentOrderID);
            setStripeClientSecret(response?.data?.client_secret);
            setStripeTransactionId(response?.data?.id);
            setShowStripe(true);
          } else {
            dispatch(clearCartPromo());
            //  payment methods redirect urls
            const paymentUrls = {
              cashfree: response?.data?.redirectUrl,
              phonepe: response?.data?.redirectUrl,
              paytabs: response?.data?.redirectUrl,
              paypal: response?.data?.paypal_redirect_url,
              midtrans: response?.data?.snapUrl,
            };
            // Select specific paymentUrls
            const redirectUrl = paymentUrls[checkout?.selectedPaymentMethod];
            if (redirectUrl) {
              router.push(redirectUrl);
            } else {
              console.error(
                "Unsupported payment method:",
                selectedPaymentMethod
              );
            }
          }
        } else {
          // setIsOrderPlaced(false)
          await api.deleteOrder({ orderId: orderId });
        }
      }
    } catch (error) {
      console.log(("Error", error));
    }
  };

  return loading ? (
    <CheckoutSkeleton />
  ) : (
    <section>
      <BreadCrumb />
      <div className="container px-2">
        {paymentLoading ? (
          <CheckoutSkeleton />
        ) : (
          <div className="flex justify-center flex-col items-center">
            <div className="flex w-full lg:w-1/2">
              <Stepper currentStep={checkout?.currentStep} />
            </div>
            <div className="w-full">
              <div className="grid grid-cols-12 gap-2 md:gap-6">
                {/* step 1 */}
                {checkout?.currentStep == 1 && (
                  <div className="col-span-12 md:col-span-8 lg:col-span-9">
                    <div className="flex flex-col cardBorder rounded-sm mb-4">
                      <div className="flex justify-between backgroundColor py-4 px-2 ">
                        <span className="font-bold text-base md:text-xl">
                          {t("choose_delivery_address")}
                        </span>
                        {address?.allAddresses?.length > 0 && (
                          <button
                            className="flex  items-center text-sm"
                            onClick={handleShowAddress}
                          >
                            <GoPlus />
                            {t("add_address")}
                          </button>
                        )}
                      </div>
                      {address?.allAddresses?.length > 0 ? (
                        <>
                          {" "}
                          <div className="flex flex-col h-full">
                            {address?.allAddresses?.map((address) => {
                              return (
                                <div key={address?.id}>
                                  {" "}
                                  <AddressCard
                                    address={address}
                                    setShowAddAddres={setShowAddAddres}
                                    setIsAddressSelected={setIsAddressSelected}
                                    fetchAddress={fetchAddress}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-end m-4">
                            <button
                              onClick={handleFirstStep}
                              className="text-white primaryBackColor px-4 py-2 rounded-sm text-xl font-normal"
                            >
                              {t("continue")}
                            </button>
                          </div>
                        </>
                      ) : (
                        <div
                          className=" flex justify-center  my-2 cursor-pointer"
                          onClick={() => setShowAddAddres(true)}
                        >
                          <div className="border-2 border-dashed p-3 w-1/3  flex items-center justify-center gap-2 font-bold text-xl">
                            <GoPlusCircle /> {t("add_address")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* step 2 */}
                {checkout?.currentStep == 2 && (
                  <div className="col-span-12 md:col-span-8 lg:col-span-9">
                    <div className="flex flex-col cardBorder rounded-sm mb-4 w-full">
                      <div className="flex  justify-between backgroundColor p-4">
                        <span className="font-bold text-xl">
                          {t("preferred_day_and_time")}
                        </span>
                      </div>
                      <div className="flex flex-col p-4 gap-6">
                        <div className="grid grid-cols-12 items-center gap-4">
                          <div className="col-span-12  md:col-span-6 flex flex-col gap-1 ">
                            <span className="text-base font-bold">
                              {t("preferred_delivery_day")}
                              <span className="text-red-500">*</span>
                            </span>
                            <Popover open={isPopoverOpen}>
                              <PopoverTrigger
                                className="cardBorder w-full  px-4 py-2 rounded-sm items-center flex justify-between "
                                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                              >
                                {formatDate(checkout?.selectedDate)}
                                <FaRegCalendarAlt />
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Calendar
                                  mode="single"
                                  selected={checkout?.selectedDate}
                                  onSelect={handleSelectedDate}
                                  className="rounded-md w-full"
                                  fromDate={new Date()}
                                  toDate={(() => {
                                    let date = new Date();
                                    let allowedDays =
                                      parseInt(
                                        setting?.setting
                                          ?.time_slots_allowed_days
                                      ) || 15;
                                    date.setDate(date.getDate() + allowedDays);
                                    return date;
                                  })()}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          {timeSlotsData?.time_slots_is_enabled == "true" && (
                            <div className="col-span-12 md:col-span-6  flex flex-col gap-1">
                              <span className="text-base font-bold ">
                                {t("preferred_delivery_time")}
                                <span className="text-red-500">*</span>
                              </span>
                              <Select
                                onValueChange={handleTimeSlotChange}
                                value={selectedTimeSlot}
                              >
                                <SelectTrigger className="w-full py-5 cardBorder">
                                  <SelectValue placeholder="Select a timezone">
                                    {checkout?.timeSlot?.title}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {availabeleTimeSlot?.map((slot) => {
                                    return (
                                      <div key={slot?.id}>
                                        <SelectItem
                                          disabled={slot?.isDisabled}
                                          value={slot}
                                        >
                                          {slot?.title}
                                        </SelectItem>
                                      </div>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-bold ">
                            {t("order_note_title")}
                          </span>
                          <textarea
                            name=""
                            id=""
                            className="cardBorder rounded-sm w-full p-2 outline-none"
                            value={checkout?.orderNote}
                            onChange={(e) => handleChangeOrderNote(e)}
                            placeholder={t("order_note")}
                          ></textarea>
                        </div>
                        <div className="flex justify-end gap-4">
                          <button
                            className="cardBorder px-4 py-2 rounded-sm text-xl font-normal"
                            onClick={() =>
                              dispatch(setCurrentStep({ data: 1 }))
                            }
                          >
                            {t("previous")}
                          </button>
                          <button
                            className="text-white primaryBackColor px-4 py-2 rounded-sm text-xl font-normal"
                            onClick={handleSecondStep}
                          >
                            {t("continue")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* step 3 */}
                {checkout?.currentStep == 3 && (
                  <div className="md:col-span-8 lg:col-span-9 col-span-12">
                    <CheckoutPayment
                      checkoutData={checkoutData}
                      selectedPaymentMethod={selectedPaymentMethod}
                      setSelectedPaymentMethod={setSelectedPaymentMethod}
                      setCurrentStep={setCurrentStep}
                    />
                  </div>
                )}
                <div className=" md:col-span-4 lg:col-span-3 col-span-12">
                  <OrderSummaryCard
                    step={checkout?.currentStep}
                    checkoutData={checkoutData}
                    handlePlaceOrder={handlePlaceOrder}
                    checkOutError={checkOutError}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <NewAddressModal
        fetchAddress={fetchAddress}
        showAddAddres={showAddAddres}
        setShowAddAddres={setShowAddAddres}
        isAddressSelected={isAddressSelected}
      />
      <StripeModal
        showStripe={showStripe}
        setShowStripe={setShowStripe}
        amount={checkout?.checkoutTotal}
        clientSecret={stripeClientSecret}
        stripeTransId={stripeTransactionId}
        stripeOrderId={stripeOrderId}
      />
      {/* <OrderSuccessModal showOrderSuccess={showOrderSuccess} handlePaymentClose={handlePaymentClose} /> */}
    </section>
  );
};

export default Checkout;
