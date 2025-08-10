"use client";
import api from "./axiosMiddleware";
import * as apiEndPoints from "./apiEndpoints";

// Authentication API's
export const registerUser = async ({
  name,
  email,
  mobile,
  type,
  fcm,
  country_code,
  password,
  phoneAuthType = false,
}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("country_code", country_code);
  formData.append("type", type);
  formData.append("fcm_token", fcm);
  formData.append("platform", "web");
  if (type == "email" || (type == "phone" && phoneAuthType == true)) {
    formData.append("password", password);
  }
  if (
    type === "phone" ||
    ((type === "email" || "google") && mobile !== null && mobile !== "")
  ) {
    formData.append("mobile", mobile);
  }
  if (type === "email" || type === "google" || (type === "phone" && email)) {
    formData.append("email", email);
  }
  const response = await api.post(apiEndPoints.register, formData);
  return response.data;
};

export const login = async ({ id, fcm, type, password, phoneAuthType }) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("fcm_token", fcm);
  formData.append("type", type);
  formData.append("platform", "web");
  if (type == "phone") {
    if (phoneAuthType == true) {
      formData.append("phone_auth_type", "phone_auth_password");
    } else {
      formData.append("phone_auth_type", "phone_auth_otp");
    }
  }
  if (type == "email" || (type == "phone" && phoneAuthType == true)) {
    formData.append("password", password);
  }
  const response = await api.post(apiEndPoints.login, formData);
  return response.data;
};

export const sendSms = async ({ mobile }) => {
  const formData = new FormData();
  formData.append("phone", mobile);
  const response = await api.post(apiEndPoints.sendSms, formData);
  return response.data;
};

export const verifyOTP = async ({ mobile, otp, country_code }) => {
  const formData = new FormData();
  formData.append("phone", mobile);
  formData.append("otp", otp);
  formData.append("country_code", country_code);
  const response = await api.post(apiEndPoints.verifyContact, formData);
  return response.data;
};

export const verifyEmail = async ({ email, code }) => {
  const params = {
    email: email,
    code: code,
  };
  const response = await api.post(apiEndPoints.verifyEmail, params);
  return response.data;
};

export const forgotPasswordOTP = async ({ email }) => {
  const formData = new FormData();
  formData.append("email", email);
  const response = await api.post(apiEndPoints.forgotPasswordOtp, formData);
  return response.data;
};
export const forgotPassword = async ({
  phone,
  otp,
  email,
  password,
  confirmPassword,
  type,
  otpMethod,
}) => {
  const formData = new FormData();
  if (type == "email" || (type == "phone" && otpMethod == "twilio")) {
    formData.append("otp", otp);
  }
  if (type == "email") {
    formData.append("email", email);
  }
  if (type == "phone") {
    formData.append("mobile", phone);
  }
  formData.append("password", password);
  formData.append("password_confirmation", confirmPassword);
  formData.append("type", type);
  if (type == "phone") {
    formData.append("otp_verify_method", otpMethod);
  }
  const response = await api.post(apiEndPoints.forgotPassword, formData);
  return response.data;
};
export const resetPassword = async ({
  password,
  newPassword,
  confirmPassword,
}) => {
  const formData = new FormData();
  formData.append("old_password", password);
  formData.append("new_password", newPassword);
  formData.append("new_password_confirmation", confirmPassword);
  const response = await api.post(apiEndPoints.resetPassword, formData);
  return response.data;
};
export const updateProfile = async ({
  image,
  name,
  email,
  mobileNumber,
  type,
}) => {
  const formData = new FormData();
  formData.append("profile", image);
  formData.append("name", name);
  formData.append("email", email);
  formData.append("mobile", mobileNumber);
  const response = await api.post(apiEndPoints.editProfile, formData);
  return response.data;
};
export const getUser = async () => {
  const response = await api.get(apiEndPoints.getUser);
  return response.data;
};
export const logout = async () => {
  const response = await api.post(`${apiEndPoints.logout}`);
  return response.data;
};
export const deleteUser = async ({ uid = null }) => {
  const formData = new FormData();
  formData.append("auth_uid", uid);
  const response = await api.post(apiEndPoints.deleteAccount);
  return response.data;
};

// General Api's
export const getCity = async ({ latitude, longitude }) => {
  let params = { latitude: latitude, longitude: longitude };
  const response = await api.get(apiEndPoints.getCity, { params });
  return response.data;
};

export const getShop = async ({ latitude, longitude }) => {
  let params = { latitude: latitude, longitude: longitude };
  const response = await api.get(apiEndPoints.getShop, { params });
  return response.data;
};

export const getCategories = async ({
  slug = "",
  id = "",
  limit,
  offset,
} = {}) => {
  const params = {
    limit,
    offset,
    ...(slug && { slug }),
    ...(id && { id }),
  };

  const response = await api.get(apiEndPoints.getCategory, { params });
  return response.data;
};

export const getProductByFilter = async ({
  latitude,
  longitude,
  filters = undefined,
  tag_names = "",
  slug = "",
}) => {
  const formData = new FormData();
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  if (tag_names !== "") {
    formData.append("tag_names", tag_names);
  }
  if (slug !== "") {
    formData.append("tag_slug", slug);
  }
  if (filters !== undefined) {
    for (const filter in filters) {
      if (
        (filters[filter] !== null &&
          filters[filter] !== undefined &&
          filters[filter] !== "") ||
        filters[filter]?.length > 0
      ) {
        formData.append(filter, filters[filter]);
      }
      if (filters[filter] === "sizes") {
        formData.append(filter, filters[filter]);
      }
    }
  }
  const response = await api.post(apiEndPoints.getProducts, formData);
  return response.data;
};

export const getBrands = async ({ limit, offset, latitude, longitude }) => {
  let params = {
    limit: limit,
    offset: offset,
    latitude: latitude,
    longitude: longitude,
  };
  const response = await api.get(apiEndPoints.getBrands, { params });
  return response.data;
};

export const getSetting = async () => {
  const params = {
    is_web_setting: 1,
  };
  const response = await api.get(apiEndPoints.getSettings, { params });
  return response.data;
};

export const getProductById = async ({ latitude, longitude, slug, id }) => {
  const formData = new FormData();
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  if (id !== -1) {
    formData.append("id", id);
  }
  if (slug) {
    formData.append("slug", slug);
  }
  const response = await api.post(apiEndPoints.getProductById, formData);
  return response.data;
};

export const getProductRatings = async ({ id, limit, offset }) => {
  const params = {
    product_id: id,
    limit: limit,
    offset: offset,
  };
  const response = await api.get(
    `${apiEndPoints.getProducts}/${apiEndPoints.getProductRatings}`,
    { params }
  );

  return response.data;
};

export const getProductImages = async ({ id, limit, offset }) => {
  const formData = new FormData();
  formData.append("product_id", id);
  formData.append("limit", limit);
  formData.append("offset", offset);
  const response = await api.post(
    `${apiEndPoints.getProducts}/${apiEndPoints.rating}/${apiEndPoints.imageList}`,
    formData
  );
  return response.data;
};

export const getPaymentSetting = async () => {
  const response = await api.get(
    `${apiEndPoints.getSettings}/${apiEndPoints.getPaymentMethods}`
  );
  return response.data;
};

export const getSystemLanguages = async ({ id, isDefault, systemType }) => {
  const params = { id: id, is_default: isDefault, system_type: systemType };
  const response = await api.get(apiEndPoints.getSystemLanguage, { params });
  return response.data;
};

// cart apis
export const getCart = async ({
  latitude,
  longitude,
  checkout = 0,
  promocode_id = 0,
}) => {
  const params = {
    latitude: latitude,
    longitude: longitude,
    is_checkout: checkout,
  };
  if (promocode_id !== 0) {
    params.promocode_id = promocode_id;
  }
  const response = await api.get(apiEndPoints.getCart, { params });
  return response.data;
};
export const addToBulkCart = async ({ variant_ids, quantities }) => {
  const params = { variant_ids: variant_ids, quantities: quantities };
  const response = await api.post(
    `${apiEndPoints.getCart}/${apiEndPoints.bulkAddToCart}`,
    null,
    { params: params }
  );
  return response.data;
};
export const addToCart = async ({ product_id, product_variant_id, qty }) => {
  const formData = new FormData();
  formData.append("product_id", product_id);
  formData.append("product_variant_id", product_variant_id);
  formData.append("qty", qty);
  const response = await api.post(
    `${apiEndPoints.getCart}/${apiEndPoints.add}`,
    formData
  );
  return response.data;
};
export const removeFromCart = async ({
  product_id,
  product_variant_id,
  isRemoveAll,
}) => {
  const formData = new FormData();
  formData.append("product_id", product_id);
  formData.append("product_variant_id", product_variant_id);
  formData.append("is_remove_all", 0);
  const response = await api.post(
    `${apiEndPoints.getCart}/${apiEndPoints.remove}`,
    formData
  );
  return response.data;
};
export const deleteCart = async () => {
  const formData = new FormData();
  formData.append("is_remove_all", 1);
  const response = await api.post(
    `${apiEndPoints.getCart}/${apiEndPoints.remove}`,
    formData
  );
  return response.data;
};
export const getGuestCart = async ({
  latitude,
  longitude,
  variant_ids,
  quantities,
}) => {
  const params = {
    latitude: latitude,
    longitude: longitude,
    variant_ids: variant_ids,
    quantities: quantities,
  };
  const response = await api.get(
    `${apiEndPoints.getCart}/${apiEndPoints.getGuestCart}`,
    { params }
  );
  return response.data;
};

// Address Apis
export const getAddress = async () => {
  const response = await api.get(`${apiEndPoints.getAddress}`);
  return response.data;
};
export const addAddress = async ({
  name,
  mobile,
  type,
  address,
  landmark,
  area,
  pincode,
  city,
  state,
  country,
  latitiude,
  longitude,
  is_default = 1,
  alternate_mobile = "",
}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("mobile", mobile);
  formData.append("type", type);
  formData.append("address", address);
  formData.append("landmark", landmark);
  formData.append("area", area);
  formData.append("pincode", pincode);
  formData.append("city", city);
  formData.append("state", state);
  formData.append("country", country);
  formData.append("alternate_mobile", alternate_mobile ? alternate_mobile : "");
  formData.append("latitude", latitiude);
  formData.append("longitude", longitude);
  formData.append("is_default", is_default ? 1 : 0);
  const response = await api.post(
    `${apiEndPoints.getAddress}/${apiEndPoints.add}`,
    formData
  );
  return response.data;
};
export const updateAddress = async ({
  id,
  name,
  mobile,
  type,
  address,
  landmark,
  area,
  pincode,
  city,
  state,
  country,
  latitiude,
  longitude,
  is_default = 1,
  alternate_mobile = "",
}) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("name", name);
  formData.append("mobile", mobile);
  formData.append("type", type);
  formData.append("address", address);
  formData.append("landmark", landmark);
  formData.append("area", area);
  formData.append("pincode", pincode);
  formData.append("city", city);
  formData.append("state", state);
  formData.append("country", country);
  formData.append("alternate_mobile", alternate_mobile ? alternate_mobile : "");
  formData.append("latitude", latitiude);
  formData.append("longitude", longitude);
  formData.append("is_default", is_default ? 1 : 0);
  const response = await api.post(
    `${apiEndPoints.getAddress}/${apiEndPoints.update}`,
    formData
  );
  return response.data;
};
export const deleteAddress = async ({ id }) => {
  const formData = new FormData();
  formData.append("id", id);
  const response = await api.post(
    `${apiEndPoints.getAddress}/${apiEndPoints.deleteItem}`,
    formData
  );
  return response.data;
};

// wishlists api
export const getFavorite = async ({ latitude, longitude, limit, offset }) => {
  const params = {
    latitude: latitude,
    longitude: longitude,
    limit: limit,
    offset: offset,
  };
  const response = await api.get(apiEndPoints.getFavorite, { params });
  return response.data;
};
export const addToFavorite = async ({ product_id }) => {
  const formData = new FormData();
  formData.append("product_id", product_id);
  const response = await api.post(
    `${apiEndPoints.getFavorite}/${apiEndPoints.add}`,
    formData
  );
  return response.data;
};
export const removeFromFavorite = async ({ product_id }) => {
  const formData = new FormData();
  formData.append("product_id", product_id);
  const response = await api.post(
    `${apiEndPoints.getFavorite}/${apiEndPoints.remove}`,
    formData
  );
  return response.data;
};

// promocode api
export const getPromo = async ({ amount = 0 }) => {
  const params = { amount: amount };
  const response = await api.get(`${apiEndPoints.getPromoCode}`, { params });
  return response.data;
};

export const setPromoCode = async ({ promoCodeName, amount = 0 }) => {
  const params = { promo_code: promoCodeName, total: amount };
  const response = await api.post(
    `${apiEndPoints.getPromoCode}/${apiEndPoints.setPromoCode}`,
    {},
    { params }
  );
  return response.data;
};

// Checkout api
export const getTimeSlots = async () => {
  const response = await api.get(
    `${apiEndPoints.getSettings}/${apiEndPoints.getTimeSlot}`
  );
  return response.data;
};

export const placeOrder = async ({
  productVariantId,
  quantity,
  total,
  deliveryCharge,
  finalTotal,
  paymentMethod,
  addressId,
  deliveryTime,
  walletBalance,
  walletUsed,
  orderNote,
  promocodeId = 0,
  status,
}) => {
  const formData = new FormData();
  formData.append("product_variant_id", productVariantId);
  formData.append("quantity", quantity);
  formData.append("total", total);
  formData.append("delivery_charge", deliveryCharge);
  formData.append("final_total", finalTotal);
  formData.append("payment_method", paymentMethod);
  formData.append("address_id", addressId);
  formData.append("status", status);

  formData.append("delivery_time", deliveryTime);
  if (walletUsed) {
    formData.append("wallet_used", 1);
    formData.append("wallet_balance", walletBalance);
  }
  if (orderNote !== "") {
    formData.append("order_note", orderNote);
  }
  if (promocodeId !== 0) {
    formData.append("promocode_id", promocodeId);
  }
  const response = await api.post(`${apiEndPoints.placeOrder}`, formData);
  return response.data;
};

export const initiateTrasaction = async ({
  orderId,
  paymentMethod,
  type,
  walletAmount = 0,
}) => {
  const formData = new FormData();
  if (orderId) {
    formData.append("order_id", orderId);
  }
  formData.append("payment_method", paymentMethod);
  formData.append("type", type);
  formData.append("request_from", "website");
  if (walletAmount != 0) {
    formData.append("wallet_amount", walletAmount);
  }
  const response = await api.post(
    `${apiEndPoints.initiateTrasaction}`,
    formData
  );
  return response.data;
};

export const addTransaction = async ({
  orderId,
  transactionId,
  paymentMethod,
  type,
  walletAmount = 0,
}) => {
  const formData = new FormData();
  if (orderId) {
    formData.append("order_id", orderId);
  }
  if (walletAmount != 0) {
    formData.append("wallet_amount", walletAmount);
  }
  formData.append("transaction_id", transactionId);
  formData.append("type", type);
  formData.append("payment_method", paymentMethod);
  formData.append("request_from", "website");
  formData.append("device_type", "web");
  formData.append("app_version", "1.0");
  const response = await api.post(`${apiEndPoints.addTransaction}`, formData);
  return response.data;
};

export const deleteOrder = async ({ orderId }) => {
  const formData = new FormData();
  formData.append("order_id", orderId);
  const response = await api.post(`${apiEndPoints.deleteOrder}`, formData);
  return response.data;
};

// Fetch Notifications
export const getNotifications = async ({ limit = 7, offset = 0 }) => {
  const params = { limit, offset };
  const response = await api.get(`${apiEndPoints.getNotification}`, { params });
  return response.data;
};

export const getFAQs = async ({ limit = 7, offset = 0 }) => {
  const params = { limit, offset };
  const response = await api.get(`${apiEndPoints.getFaq}`, { params });
  return response.data;
};

export const getOrders = async ({ limit, offset, orderId, type }) => {
  const params = { limit: limit, offset: offset, type: type };
  if (orderId) {
    params.order_id = orderId;
  }
  const response = await api.get(`${apiEndPoints.getOrders}`, { params });
  return response.data;
};

export const changeOrderStatus = async ({
  orderId,
  orderItemId,
  status,
  reason,
}) => {
  const formData = new FormData();
  formData.append("order_id", orderId);
  formData.append("order_item_id", orderItemId);
  formData.append("status", status);
  if (reason) {
    formData.append("reason", reason);
  }
  const response = await api.post(
    `${apiEndPoints.updateOrderStatus}`,
    formData
  );
  return response.data;
};

export const reviewProduct = async ({ productId, rating, review, images }) => {
  const formData = new FormData();
  formData.append("product_id", productId);
  formData.append("rate", rating);
  formData.append("review", review);
  for (let i = 0; i < images?.length; i++) {
    formData.append(`image[${i}]`, images[i]);
  }
  const response = await api.post(
    `${apiEndPoints.getProducts}/${apiEndPoints.rating}/${apiEndPoints.add}`,
    formData
  );
  return response.data;
};

export const getProductRating = async ({ ratingId }) => {
  const formData = new FormData();
  formData.append("id", ratingId);
  const response = await api.post(
    `${apiEndPoints.getProducts}/${apiEndPoints.rating}/${apiEndPoints.edit}`,
    formData
  );
  return response.data;
};

export const updateReviewProduct = async ({
  ratingId,
  rating,
  review,
  deleteImages,
  images,
}) => {
  const formData = new FormData();
  formData.append("id", ratingId);
  formData.append("rate", rating);
  formData.append("review", review);
  formData.append("deleteImageIds", `[${deleteImages}]`);
  for (let i = 0; i < images?.length; i++) {
    formData.append(`image[${i}]`, images[i]);
  }
  const response = await api.post(
    `${apiEndPoints.getProducts}/${apiEndPoints.rating}/${apiEndPoints.update}`,
    formData
  );
  return response.data;
};
export const downloadInvoice = async ({ orderId }) => {
  const formData = new FormData();
  formData.append("order_id", orderId);
  const response = await api.post(`${apiEndPoints.getInvoice}`, formData, {
    responseType: "blob",
  });
  return response;
};

export const getUserTransactions = async ({ limit, offset, type }) => {
  const params = { limit: limit, offset: offset, type: type };
  const response = await api.get(`${apiEndPoints.getTransactions}`, { params });
  return response.data;
};

export const liveOrderTracking = async ({ orderId }) => {
  const params = {
    order_id: orderId,
  };
  const response = await api.get(`${apiEndPoints.liveTracking}`, { params });
  return response.data;
};

export const getSellers = async ({ limit, offset, latitude, longitude }) => {
  const params = {
    limit,
    offset,
    latitude,
    longitude,
  };
  const response = await api.get(`${apiEndPoints.getShopBySellers}`, {
    params,
  });
  return response.data;
};

export const getCountries = async ({ limit, offset, latitude, longitude }) => {
  const params = {
    limit,
    offset,
    latitude,
    longitude,
  };
  const response = await api.get(`${apiEndPoints.getShopByCountries}`, {
    params,
  });
  return response.data;
};
export const verifyUserByPhoneNum = async ({ mobile, countryCode, type }) => {
  const formData = new FormData();
  formData.append("mobile", mobile);
  formData.append("country_code", countryCode);
  formData.append("type", type);
  const response = await api.post(
    `${apiEndPoints.verifyUserByPhoneNum}`,
    formData
  );
  return response.data;
};

export const getOrderStatusPhonepe = async ({ token, transaction_id }) => {
  const params = {
    token: token,
    transaction_id: transaction_id,
  };

  const response = await api.get(apiEndPoints.orderStatusPhonepe, { params });
  return response.data;
};
