import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
} from "@/components/ui/dialog";
import { t } from "@/utils/translation";
import { useSelector } from "react-redux";
import Image from "next/image";
import { FaLocationCrosshairs } from "react-icons/fa6";
import {
  StandaloneSearchBox,
  GoogleMap,
  MarkerF,
} from "@react-google-maps/api";
import * as api from "@/api/apiRoutes";
import { setSetting } from "@/redux/slices/settingSlice";
import { setCity } from "@/redux/slices/citySlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setShop } from "@/redux/slices/shopSlice";
import Loader from "../loader/Loader";
import { IoIosCloseCircle } from "react-icons/io";
import { darkThemeStyles } from "@/utils/mapColor";
import { BsCheckLg } from "react-icons/bs";

const Location = ({ showLocation, setShowLocation }) => {
  const city = useSelector((state) => state.City);
  const setting = useSelector((state) => state.Setting);
  const theme = useSelector((state) => state.Theme.theme);
  const inputRef = useRef();
  const dispatch = useDispatch();
  const [mapView, setMapView] = useState(false);
  const [currLocationClick, setcurrLocationClick] = useState(false);
  const [isInputFields, setisInputFields] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, seterrorMsg] = useState("");
  const [center, setCenter] = useState();

  const [localLocation, setlocalLocation] = useState({
    city: "",
    formatted_address: "",
    lat: parseFloat(0),
    lng: parseFloat(0),
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setlocalLocation({ lat: lat, lng: lng });
    });
  }, [showLocation]);

  useEffect(() => {
    const center = {
      lat: localLocation.lat,
      lng: localLocation.lng,
      streetViewControl: false,
    };
    setCenter(center);
  }, [localLocation.lat, localLocation.lng]);

  const handleCloseLocation = () => {
    setShowLocation(false);
    setMapView(false);
  };

  const handleViewMap = async () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setlocalLocation({ lat: lat, lng: lng });
    });
    const geocoder = new window.google.maps.Geocoder();
    const response = await geocoder
      .geocode({
        location: {
          lat: localLocation.lat,
          lng: localLocation.lng,
        },
      })
      .then((response) => {
        if (response.results[0]) {
          setlocalLocation((state) => ({
            ...state,
            formatted_address: response.results[0].formatted_address,
          }));
        }
      })
      .catch((error) => {
        console.log("err", error);
      });

    setMapView(true);
  };

  const handleConfirmLocation = async () => {
    try {
      if (errorMessage !== "") {
        toast.error("We are not deliver on this city");
        return;
      }
      const result = await api.getCity({
        latitude: localLocation.lat,
        longitude: localLocation.lng,
      });
      if (result?.status == 1) {
        dispatch(
          setCity({
            data: {
              id: result.data.id,
              name: localLocation.city,
              state: result.data.state,
              formatted_address: localLocation.formatted_address,
              latitude: result.data.latitude,
              longitude: result.data.longitude,
              min_amount_for_free_delivery:
                result.data.min_amount_for_free_delivery,
              delivery_charge_method: result.data.delivery_charge_method,
              fixed_charge: result.data.fixed_charge,
              per_km_charge: result.data.per_km_charge,
              time_to_travel: result.data.time_to_travel,
              max_deliverable_distance: result.data.max_deliverable_distance,
              distance: result.data.distance,
            },
          }),
        );
        fetchShop(result.data.latitude, result.data.longitude);
        setShowLocation(false);
        seterrorMsg("");
        setMapView(false);
      } else if (result.status == 0) {
        setLoading(false);
        toast.error(t("We_doesn't_deliver_at_selected_city"));
        setShowLocation(true);
      } else {
        setLoading(false);
        seterrorMsg(result.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchShop = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await api.getShop({ latitude: lat, longitude: lng });
      dispatch(setShop({ data: response.data }));
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const geocoder = new window.google.maps.Geocoder();
    const response = await geocoder
      .geocode({
        location: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
      })
      .then(async (res) => {
        if (res.results[0]) {
          const result = await getAvailableCity(res);
          if (result.status == 1) {
            setlocalLocation({
              formatted_address: result?.data?.formatted_address,
              city: result?.data?.name,
              lat: res.results[0].geometry.location.lat(),
              lng: res.results[0].geometry.location.lng(),
            });
            setAddressLoading(false);
            seterrorMsg("");
          } else {
            setlocalLocation({
              city: null,
              formatted_address: res.results[0].formatted_address,
              lat: res.results[0].geometry.location.lat(),
              lng: res.results[0].geometry.location.lng(),
            });
            setAddressLoading(false);
            // setisloading(false);
            seterrorMsg(res.message);
          }
        } else {
          toast.error("City not found");
        }
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const getAvailableCity = async (response) => {
    var results = response.results;
    var c, lc, component;
    var found = false,
      message = "";
    for (var r = 0, rl = results.length; r < 2; r += 1) {
      var flag = false;
      var result = results[r];
      for (c = 0, lc = result.address_components.length; c < 2; c += 1) {
        component = result.address_components[c];
        const res = await api.getCity({
          latitude: result.geometry.location.lat(),
          longitude: result.geometry.location.lng(),
        });
        if (res.status === 1) {
          flag = true;
          found = true;
          return res;
        } else {
          // flag = true;
          found = false;
          message = res.message;
        }
        if (flag === true) {
          break;
        }
      }
      if (flag === true) {
        break;
      }
    }
    if (found === false) {
      return {
        status: 0,
        message: message,
      };
    }
  };
  const onMarkerDragStart = () => {
    setAddressLoading(true);
  };

  const handleDragEnd = async (e) => {
    const geocoder = new window.google.maps.Geocoder();
    const response = await geocoder
      .geocode({
        location: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
      })
      .then(async (res) => {
        if (res.results[0]) {
          const result = await getAvailableCity(res);
          if (result.status == 1) {
            setlocalLocation({
              formatted_address: result?.data?.formatted_address,
              city: result?.data?.name,
              lat: res.results[0].geometry.location.lat(),
              lng: res.results[0].geometry.location.lng(),
            });
            setAddressLoading(false);
            seterrorMsg("");
          } else {
            setlocalLocation({
              city: null,
              formatted_address: res.results[0].formatted_address,
              lat: res.results[0].geometry.location.lat(),
              lng: res.results[0].geometry.location.lng(),
            });
            setAddressLoading(false);
            // setisloading(false);
            seterrorMsg(res.message);
          }
        } else {
          toast.error("City not found");
        }
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const handleMoveMarkerOnMap = async (e) => {
    const places = inputRef.current.getPlaces();
    const geocoder = new window.google.maps.Geocoder();
    const place = places[0];
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const response = await geocoder
      .geocode({
        location: {
          lat: lat,
          lng: lng,
        },
      })
      .then(async (res) => {
        if (res.results[0]) {
          const result = await getAvailableCity(res);
          if (result.status == 1) {
            setlocalLocation({
              formatted_address: result?.data?.formatted_address,
              city: result?.data?.name,
              lat: res.results[0].geometry.location.lat(),
              lng: res.results[0].geometry.location.lng(),
            });
            setAddressLoading(false);
            seterrorMsg("");
          } else {
            setlocalLocation({
              city: null,
              formatted_address: res.results[0].formatted_address,
              lat: res.results[0].geometry.location.lat(),
              lng: res.results[0].geometry.location.lng(),
            });
            setAddressLoading(false);
            // setisloading(false);
            seterrorMsg(res.message);
          }
        } else {
          toast.error("City not found");
        }
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const handlePlaceChanged = async (e) => {
    setLoading(true);
    const [place] = inputRef.current.getPlaces();
    try {
      if (place) {
        let city_name = place.address_components[0].long_name;
        let loc_lat = place.geometry.location.lat();
        let loc_lng = place.geometry.location.lng();
        let formatted_address = place.formatted_address;
        const response = await api.getCity({
          latitude: loc_lat,
          longitude: loc_lng,
        });
        if (response.status === 1) {
          dispatch(
            setCity({
              data: {
                id: response.data.id,
                name: city_name,
                state: response.data.state,
                formatted_address: formatted_address,
                latitude: response.data.latitude,
                longitude: response.data.longitude,
                min_amount_for_free_delivery:
                  response.data.min_amount_for_free_delivery,
                delivery_charge_method: response.data.delivery_charge_method,
                fixed_charge: response.data.fixed_charge,
                per_km_charge: response.data.per_km_charge,
                time_to_travel: response.data.time_to_travel,
                max_deliverable_distance:
                  response.data.max_deliverable_distance,
                distance: response.data.distance,
              },
            }),
          );
          const updatedSetting = {
            ...setting?.setting,
            default_city: {
              id: response?.data?.id,
              name: city_name,
              state: response?.data?.name,
              formatted_address: formatted_address,
              latitude: response?.data?.latitude,
              longitude: response?.data?.longitude,
            },
          };
          dispatch(setSetting({ data: updatedSetting }));
          setLoading(false);
          setShowLocation(false);
        } else if (response.status == 0) {
          setLoading(false);
          toast.error(t("We_doesn't_deliver_at_selected_city"));
          setShowLocation(true);
        } else {
          setLoading(false);
          seterrorMsg(res.message);
        }
      } else {
        toast.error("Location not found !");
        setShowLocation(true);
        setLoading(false);
      }
    } catch (e) {
      toast.error("Location not found!");
      console.log(e);
    }
    setLoading(false);
  };

  const handleShowModal = () => {
    setShowLocation(false);
    setMapView(false);
  };

  return (
    <>
      {loading ? (
        <Loader screen={"full"} />
      ) : (
        <Dialog open={showLocation} onOpenChange={handleCloseLocation}>
          <DialogOverlay
            className={`${theme == "light" ? (setting.setting?.default_city == null && city?.city == null ? "bg-white/100" : "bg-white/10") : setting.setting?.default_city == null && city?.city == null ? "bg-black/100" : "bg-black/10"}`}
          />
          <DialogContent onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader className="text-lg font-extrabold flex-row items-center flex justify-between">
              <div>{t("select_location")}</div>
              {setting.setting?.default_city == null && city?.city == null ? (
                <></>
              ) : (
                <div>
                  <IoIosCloseCircle
                    size={32}
                    onClick={() => handleShowModal()}
                  />
                </div>
              )}
            </DialogHeader>
            <div className="flex">
              {!mapView ? (
                <div className="flex flex-col gap-3 w-full">
                  <div className="relative h-[100px]  m-8">
                    <Image
                      src={setting?.setting?.web_settings?.web_logo}
                      fill
                      className=" object-contain"
                      alt="logo"
                    />
                  </div>
                  <h2 className=" text-center font-extrabold text-lg">
                    {t("select_delivery_location")}
                  </h2>
                  <button
                    className="w-full m-auto rounded-lg primaryBorder p-1 font-medium flex items-center justify-center gap-1 mt-7"
                    onClick={handleViewMap}
                  >
                    <FaLocationCrosshairs /> {t("use_my_current_location")}
                  </button>
                  <div className="flex items-center justify-between my-4 gap-2">
                    <hr className="flex-grow border-t-2 border-solid border-gray-300" />
                    <span className="  font-bold text-base">OR</span>
                    <hr className="flex-grow border-t-2 border-solid border-gray-300" />
                  </div>
                  <StandaloneSearchBox
                    onLoad={(ref) => (inputRef.current = ref)}
                    onPlacesChanged={handlePlaceChanged}
                  >
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder={t("select_delivery_location")}
                      className="w-full p-2 buttonBackground outline-none rounded-lg text-sm placeholder:text-center placeholder:textColor"
                      onFocus={() => {
                        setcurrLocationClick(false);
                        setisInputFields(true);
                      }}
                      onBlur={() => {
                        setisInputFields(false);
                      }}
                    />
                  </StandaloneSearchBox>
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-full">
                  <div className="w-full flex flex-col gap-4">
                    <StandaloneSearchBox
                      onLoad={(ref) => (inputRef.current = ref)}
                      onPlacesChanged={handleMoveMarkerOnMap}
                    >
                      <input
                        type="text"
                        name=""
                        id=""
                        placeholder={t("search_delivery_location")}
                        className="w-full p-2 buttonBackground outline-none roundΩed-lg text-sm placeholder:text-left placeholder:textColor py-3"
                        onFocus={() => {
                          setcurrLocationClick(false);
                          setisInputFields(true);
                        }}
                        onBlur={() => {
                          setisInputFields(false);
                        }}
                      />
                    </StandaloneSearchBox>
                    <GoogleMap
                      streetViewControl={false}
                      tilt={true}
                      options={{
                        streetViewControl: false,
                        styles: theme == "dark" ? darkThemeStyles : [],
                      }}
                      zoom={11}
                      center={center}
                      mapContainerStyle={{ height: "400px" }}
                      onClick={handleMapClick}
                    >
                      <MarkerF
                        position={center}
                        draggable={true}
                        onDragStart={onMarkerDragStart}
                        onDragEnd={handleDragEnd}
                      />
                    </GoogleMap>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-center font-semibold text-base">
                      <b>{t("address")} : </b>
                      {addressLoading
                        ? "...."
                        : localLocation.formatted_address}
                    </p>
                  </div>
                  <button
                    onClick={handleConfirmLocation}
                    className="w-full primaryBorder p-1 rounded-lg"
                  >
                    {t("confirm")}
                  </button>
                  <button onClick={() => setMapView(false)} className="w-full ">
                    {t("go_back")}
                  </button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Location;
