import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import { IoIosCloseCircle } from 'react-icons/io'
import { t } from '@/utils/translation'
import * as api from "@/api/apiRoutes"
import {
    GoogleMap, Marker, Polyline
} from '@react-google-maps/api';
import { BiChevronRight, BiPhoneCall } from 'react-icons/bi'
import { IoLocationOutline } from 'react-icons/io5'
import Link from 'next/link'

const LiveTrackingModal = ({ showLiveTracking, setShowLiveTracking, order }) => {
    const [map, setMap] = useState(null);
    const [riderLocation, setRiderLocation] = useState();
    const [userLocation, setUserLocation] = useState({
        lat: null,
        lng: null,
    });

    const [showOverlay, setShowOverlay] = useState(false);

    const fetchLocation = async () => {
        try {
            const res = await api.liveOrderTracking({ orderId: order?.id });
            if (res.status == 0) {
                setShowOverlay(true);
            } else {
                const latitude = parseFloat(res?.data?.latitude);
                const longitude = parseFloat(res?.data?.longitude);
                setRiderLocation({ lat: latitude, lng: longitude })
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        if (showLiveTracking) {
            fetchLocation(order?.id);
        }
    }, [order, showLiveTracking])

    useEffect(() => {
        let interval;
        if (showLiveTracking) {
            interval = setInterval(() => {
                if (showLiveTracking) {
                    fetchLocation(order?.id);
                }
            }, 15000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [showLiveTracking, fetchLocation]);

    useEffect(() => {
        if (order?.latitude && order?.longitude) {
            setUserLocation({
                lat: parseFloat(order?.latitude),
                lng: parseFloat(order?.longitude)
            });
        }
    }, [order]);

    const handleHideLiveTracking = () => {
        setShowLiveTracking(false)
    }
    // const { isLoaded } = useJsApiLoader({
    //     id: 'google-map-script',
    //     googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API
    // })

    const GOOGLE_MAPS_LIBRARIES = ["places", "geometry"];

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(riderLocation && riderLocation);
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    const containerStyle = {
        width: '100%',
        height: 'calc(50vh - 100px)',
    };

    const polylineOptions = {
        strokeColor: "#FF0000",
        strokeOpacity: 0.5,
        strokeWeight: 5,
        icons: [
            {
                icon: {
                    path: "M 0,-1 0,1",
                    strokeOpacity: 1,
                    scale: 4,
                },
                offset: "0",
                repeat: "20px",
            },
        ],
    };


    return (
        <Dialog open={showLiveTracking}  >
            <DialogContent className="w-full ">
                <DialogHeader className="font-bold text-2xl text-start flex flex-row justify-between">
                    {t("livetracking")}
                    <div>
                        <IoIosCloseCircle size={32} onClick={handleHideLiveTracking} />
                    </div>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="w-full">
                        {/* {isLoaded ?  */}

                        <div className="relative">
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={riderLocation && riderLocation}
                                zoom={7}
                                onLoad={onLoad}
                                onUnmount={onUnmount}
                            >
                                {riderLocation && userLocation && (
                                    <>
                                        <Marker position={riderLocation}></Marker>
                                        <Marker position={userLocation}></Marker>
                                    </>
                                )}
                                {riderLocation && userLocation && (
                                    <Polyline
                                        path={[riderLocation, userLocation]}
                                        options={polylineOptions}
                                    />
                                )}
                            </GoogleMap>
                            {showOverlay && (
                                <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/90">
                                    <div className='bg-white rounded-lg shadow-md p-5 text-center'>
                                        <p className="text-[#dc3545] font-bold">{t("unable_to_load_tracking_data")}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* : null} */}
                    </div>
                    <div className="w-full pt-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h1 className="text-xl font-semibold">{t("orderDetail")}</h1>
                            <h3 className="flex items-center text-lg">
                                {t("order")} #{order?.id} <BiChevronRight />
                            </h3>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <IoLocationOutline size={30} />
                            <div>
                                <h3 className="text-lg font-semibold">{t("deliveryAddress")}</h3>
                                <p className="text-sm m-0">{order?.address}</p>
                            </div>
                        </div>
                        {order?.delivery_boy_name && (
                            <div className="mt-4">
                                <p className="text-lg font-medium">{t("delivery_partner_details ")}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h2 className="text-lg font-semibold">
                                                {order?.delivery_boy_name}
                                            </h2>
                                            <p className="text-sm">{order?.delivery_boy_mobile}</p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-500 p-2 rounded-full">
                                        <Link
                                            href={`tel:${order?.delivery_boy_mobile || ""}`}
                                            className="text-white"
                                        >
                                            <BiPhoneCall size={25} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LiveTrackingModal