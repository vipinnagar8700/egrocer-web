import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import { t } from "@/utils/translation"
import { IoIosCloseCircle } from 'react-icons/io'
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import * as api from "@/api/apiRoutes"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { BiCurrentLocation } from 'react-icons/bi';
import Loader from '../loader/Loader';
import { setAllAddresses, setSelectedAddres } from '@/redux/slices/addressSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { darkThemeStyles } from '@/utils/mapColor'


const NewAddressModal = ({ showAddAddres, setShowAddAddres, isAddressSelected, fetchAddress }) => {
    const dispatch = useDispatch();
    const addresses = useSelector(state => state.Addresses)
    const city = useSelector(state => state.City.city)
    const theme = useSelector(state => state.Theme.theme)
    const [addressLoading, setAddressLoading] = useState("")
    const [loading, setLoading] = useState(false)
    const [center, setCenter] = useState()
    const [addressDetails, setaddressDetails] = useState({
        name: '',
        mobile_num: '',
        alternate_mobile_num: '',
        address: '',
        landmark: '',
        city: '',
        area: '',
        pincode: '',
        state: '',
        country: '',
        address_type: 'Home',
        is_default: true,
    });
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
            setlocalLocation({ lat: lat, lng: lng })
        });
    }, [showAddAddres])

    useEffect(() => {
        const center = {
            lat: localLocation.lat,
            lng: localLocation.lng,
            streetViewControl: false
        }
        setCenter(center)
    }, [localLocation.lat, localLocation.lng])

    useEffect(() => {
        if (addressDetails.address !== '') {
            const geocoder = new window.google.maps.Geocoder();
            const fullAddress = `${addressDetails.address}, ${addressDetails.city}, ${addressDetails.state}, ${addressDetails.country}`;
            geocoder.geocode({ address: fullAddress }, (results, status) => {
                if (status === 'OK') {
                    const location = results[0].geometry.location;
                    setlocalLocation({ lat: location.lat(), lng: location.lng() });
                } else {
                    console.error('Geocode was not successful for the following reason:', status);
                }
            });
        }
    }, [addressDetails]);

    useEffect(() => {
        if (isAddressSelected && addresses.selectedEditAddress) {
            setaddressDetails({
                name: addresses.selectedEditAddress.name,
                mobile_num: addresses.selectedEditAddress.mobile,
                alternate_mobile_num: addresses.selectedEditAddress.alternate_mobile,
                address: addresses.selectedEditAddress.address,
                landmark: addresses.selectedEditAddress.landmark,
                city: addresses.selectedEditAddress.city,
                area: addresses.selectedEditAddress.area,
                pincode: addresses.selectedEditAddress.pincode,
                state: addresses.selectedEditAddress.country,
                country: addresses.selectedEditAddress.country,
                address_type: addresses.selectedEditAddress.type,
                is_default: addresses.selectedEditAddress.is_default === 1 ? true : false,
            });
        }
        if (!isAddressSelected) {
            setlocalLocation({
                lat: parseFloat(city?.city ? city?.city?.latitude : 0),
                lng: parseFloat(city?.city ? city?.city?.longitude : 0),
            });
        }
    }, [isAddressSelected, addresses?.selectedEditAddress, showAddAddres]);

    const handleConfirmAddress = async (e) => {
        e.preventDefault();
        let lat = center.lat;
        let lng = center.lng;
        if (!isAddressSelected) {
            setLoading(true);
            const response = await api.addAddress({ name: addressDetails.name, mobile: addressDetails.mobile_num, type: addressDetails.address_type, address: addressDetails.address, landmark: addressDetails.landmark, area: addressDetails.area, pincode: addressDetails.pincode, city: addressDetails.city, state: addressDetails.state, country: addressDetails.country, alternate_mobile: addressDetails.alternate_mobile_num, latitiude: lat, longitude: lng, is_default: addressDetails.is_default })
            if (response.status == 1) {
                fetchAddress()
                setLoading(false)
                toast.success(t("address_added_success"))
            } else {
                setLoading(false)
            }
            setaddressDetails({
                name: '',
                mobile_num: '',
                alternate_mobile_num: '',
                address: '',
                landmark: '',
                city: '',
                area: '',
                pincode: '',
                state: '',
                country: '',
                address_type: 'Home',
                is_default: false,
            });
            setShowAddAddres(false)
        }
        else {
            setLoading(true);
            const response = await api.updateAddress({ id: addresses.selectedEditAddress.id, name: addressDetails.name, mobile: addressDetails.mobile_num, type: addressDetails.address_type, address: addressDetails.address, landmark: addressDetails.landmark, area: addressDetails.area, pincode: addressDetails.pincode, city: addressDetails.city, state: addressDetails.state, country: addressDetails.country, alternate_mobile: addressDetails.alternate_mobile_num, latitiude: lat, longitude: lng, is_default: addressDetails.is_default })
            if (response.status === 1) {
                toast.success('Succesfully Updated Address!');
                fetchAddress()
                setShowAddAddres(false)
            } else {
                setLoading(false)
            }
        }
    };

    const handleHideAddressModal = () => {
        setaddressDetails({
            name: '',
            mobile_num: '',
            alternate_mobile_num: '',
            address: '',
            landmark: '',
            city: '',
            area: '',
            pincode: '',
            state: '',
            country: '',
            address_type: 'Home',
            is_default: false,
        });
        setShowAddAddres(false)
    }

    const onMarkerDragStart = () => {
        setAddressLoading(true);
    };

    const onMarkerDragEnd = (e) => {

        const prev_latlng = {
            lat: localLocation.lat,
            lng: localLocation.lng,
        };
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({
            location: {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            }
        })
            .then(response => {
                if (response.results[0]) {
                    setlocalLocation({
                        lat: parseFloat(response.results[0].geometry.location.lat()),
                        lng: parseFloat(response.results[0].geometry.location.lng()),
                    });

                    let address = '', country = '', pincode = '', landmark = '', area = '', state_ = '', city = '';
                    response.results[0].address_components.forEach((res_add) => {
                        if (res_add.types.includes('premise') || res_add.types.includes('plus_code') || res_add.types.includes('route')) {
                            address = res_add.long_name;
                        }
                        if (res_add.types.includes("political")) {
                            landmark = res_add.long_name;
                        }
                        if (res_add.types.includes('administrative_area_level_3') || res_add.types.includes('administrative_area_level_2') || res_add.types.includes("sublocality")) {
                            area = res_add.long_name;
                        }
                        if (res_add.types.includes("administrative_area_level_1")) {
                            state_ = res_add.long_name;
                        }
                        if (res_add.types.includes('country')) {
                            country = res_add.long_name;
                        }
                        if (res_add.types.includes('postal_code')) {
                            pincode = res_add.long_name;
                        }
                        if (res_add.types.includes("locality")) {
                            city = res_add.long_name;
                        }
                    });

                    if (address === '' || area === '') {
                        setlocalLocation({
                            lat: prev_latlng.lat,
                            lng: prev_latlng.lng
                        });
                    }
                    else {
                        setaddressDetails(state => ({
                            ...state,
                            address: address,
                            landmark: landmark,
                            city: city,
                            area: area,
                            pincode: pincode,
                            country: country,
                            state: state_,
                        }));
                    }
                    setAddressLoading(false);
                }
                else {
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const mapContainerStyle = {
        width: "100%",
        height: window.innerWidth > 990 ? "700px" : "400px"
    };

    const handleCurrentLocationClick = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latLng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setlocalLocation({
                    lat: parseFloat(latLng.lat),
                    lng: parseFloat(latLng.lng),
                });
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({
                    location: latLng
                }).then(response => {
                    if (response.results[0]) {
                        let address = '', country = '', pincode = '', landmark = '', area = '', state_ = '', city = '';
                        response.results[0].address_components.forEach((res_add) => {
                            if (res_add.types.includes('premise') || res_add.types.includes('plus_code') || res_add.types.includes('route')) {
                                address = res_add.long_name;
                            }
                            if (res_add.types.includes("political")) {
                                landmark = res_add.long_name;
                            }
                            if (res_add.types.includes('administrative_area_level_3') || res_add.types.includes('administrative_area_level_2') || res_add.types.includes("sublocality")) {
                                area = res_add.long_name;
                            }
                            if (res_add.types.includes("administrative_area_level_1")) {
                                state_ = res_add.long_name;
                            }
                            if (res_add.types.includes('country')) {
                                country = res_add.long_name;
                            }
                            if (res_add?.types?.includes('postal_code')) {
                                pincode = res_add?.long_name;
                            }
                            if (res_add.types.includes("locality")) {
                                city = res_add.long_name;
                            }
                        });
                        setaddressDetails(state => ({
                            ...state,
                            address: address,
                            landmark: landmark,
                            city: city,
                            area: area,
                            pincode: pincode,
                            country: country,
                            state: state_,
                        }));

                    }
                    else {
                        console.log("No result found");
                    }
                }).catch(error => {
                    console.log(error);
                });
                if (!("geolocation" in navigator)) {
                    console.log("geolocation not present in navigator");
                }
            });
    };

    const handleSetAddressType = (value) => {
        setaddressDetails(state => ({ ...state, address_type: value }))
    }



    const handleCheckboxChange = (e) => {
        setaddressDetails((prevDetails) => ({
            ...prevDetails,
            is_default: e.target.checked,
        }));
    }


    return (
        <Dialog open={showAddAddres} >
            <DialogContent className="max-w-5xl overflow-y-scroll h-full">
                <DialogHeader>
                    <div className='flex flex-row justify-between items-center'>
                        <h2 className='font-bold text-xl'>{t("new_address")}</h2>
                        <IoIosCloseCircle size={32} onClick={() => handleHideAddressModal()} />
                    </div>
                </DialogHeader>
                <div className='p-2 '>
                    <div className='flex gap-5 flex-col md:flex-row'>
                        <div className='w-full md:w-1/2 relative'>
                            <div className='absolute z-50 top-[10px] right-14 bg-white p-[10px] cursor-pointer text-black' onClick={handleCurrentLocationClick}>
                                <BiCurrentLocation size={20} className=' ' />
                            </div>
                            <GoogleMap streetViewControl={false} tilt={true} options={{
                                streetViewControl: false,
                                styles: theme == "dark" ? darkThemeStyles : []
                            }} zoom={11} center={center} mapContainerStyle={mapContainerStyle} className="h-full">
                                <MarkerF position={center} draggable={true} onDragStart={onMarkerDragStart} onDragEnd={onMarkerDragEnd} />
                            </GoogleMap>
                        </div>
                        <div className='w-full md:w-1/2 h-full'>
                            {addressLoading ? <div className='flex items-center justify-center'><Loader height={600} width={600} /></div> : <div className='flex flex-col'>
                                <form className='flex flex-col gap-5' onSubmit={handleConfirmAddress}>
                                    <div className='flex flex-col gap-2'>
                                        <h1>{t("contact_details")}</h1>
                                        <div className='flex flex-col gap-2'>
                                            <input type="text" placeholder={t("name")} className='w-full outline-none cardBorder p-1 rounded-sm' value={addressDetails.name} onChange={(e) => setaddressDetails(state => ({ ...state, name: e.target.value }))} required />
                                            <input type="number" placeholder={t("mobileNumber")} className='w-full outline-none cardBorder p-1 rounded-sm' value={addressDetails.mobile_num} onChange={(e) => setaddressDetails(state => ({ ...state, mobile_num: e.target.value }))} required />
                                            <input type="number" placeholder={t("alt_mobile_no")} className='w-full outline-none cardBorder p-1 rounded-sm' value={addressDetails.alternate_mobile_num} onChange={(e) => setaddressDetails(state => ({ ...state, alternate_mobile_num: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <h1>{t("address_details")}</h1>
                                        <input type="text" placeholder={t("address")} className='w-full outline-none cardBorder p-1 rounded-sm' value={addressDetails.address} onChange={(e) => setaddressDetails((state) => ({ ...state, address: e.target.value }))} required />
                                        <input type="text" placeholder={t("enter_landmark")} className='w-full outline-none cardBorder p-1 rounded-sm' value={addressDetails.landmark} onChange={(e) => setaddressDetails((state) => ({ ...state, landmark: e.target.value }))} required />
                                        <input type="text" placeholder={t("enter_area")} className='w-full outline-none cardBorder p-1 rounded-sm' value={addressDetails.area} onChange={(e) => setaddressDetails((state) => ({ ...state, area: e.target.value }))} required />
                                        <input type="text" placeholder={t("enter_pincode")} className='w-full outline-none cardBorder p-1 rounded-sm' value={addressDetails.pincode} onChange={(e) => setaddressDetails((state) => ({ ...state, pincode: e.target.value }))} required />
                                        <input type="text" placeholder={t("enter_city")} className='w-full outline-none cardBorder p-1 rounded-sm' value={addressDetails.city} onChange={(e) => setaddressDetails((state) => ({ ...state, city: e.target.value }))} required />
                                        <input type="text" placeholder={t("enter_state")} className='w-full outline-none cardBorder p-1 rounded-sm' value={addressDetails.state} onChange={(e) => setaddressDetails((state) => ({ ...state, state: e.target.value }))} required />
                                        <input type="text" placeholder={t("enter_country")} className='w-full outline-none cardBorder p-1 rounded-sm' value={addressDetails.country} onChange={(e) => setaddressDetails((state) => ({ ...state, country: e.target.value }))} required />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <h1>{t("address_type")}</h1>
                                        <div className='flex gap-1'>
                                            <ToggleGroup type="single">
                                                <ToggleGroupItem value="Home" className={`rounded-sm p-2 ${addressDetails.address_type == "Home" ? "text-white primaryBackColor" : ""}`} onClick={() => handleSetAddressType("Home")} >
                                                    <h1>{t("adress_type_home")}</h1>
                                                </ToggleGroupItem>
                                                <ToggleGroupItem value="Office" className={`rounded-sm p-2 ${addressDetails.address_type == "Office" ? "text-white primaryBackColor" : ""}`} onClick={() => handleSetAddressType("Office")}>
                                                    <h1>{t("address_type_office")}</h1>
                                                </ToggleGroupItem>
                                                <ToggleGroupItem value="Other" className={`rounded-sm p-2 ${addressDetails.address_type == "Other" ? "text-white primaryBackColor" : ""}`} onClick={() => handleSetAddressType("Other")}>
                                                    <h1>{t("address_type_other")}</h1>
                                                </ToggleGroupItem>
                                            </ToggleGroup>
                                        </div>
                                        <div className='flex gap-2 mt-2'>
                                            <input type="checkbox" name="" id="" checked={addressDetails.is_default} value={addressDetails.is_default} onChange={handleCheckboxChange} />
                                            <p className='font-bold text-sm'>{t("set_as_default_address")}</p>
                                        </div>
                                    </div>
                                    <button type="submit" className='primaryBackColor rounded-sm text-white p-2 font-bold'>{t("confirm_location")}</button>
                                </form>

                            </div>}

                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default NewAddressModal