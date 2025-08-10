import React, { use, useEffect, useState } from 'react'
import { t } from "@/utils/translation"
import { CiCirclePlus } from "react-icons/ci";
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from "react-icons/ri";
import AddressCard from '../cards/AddressCard';
import NewAddressModal from '../newaddressmodal/NewAddressModal';
import * as api from "@/api/apiRoutes"
import { useSelector, useDispatch } from 'react-redux';
import { setAllAddresses } from '@/redux/slices/addressSlice';
import CardSkeleton from '../skeleton/CardSkeleton';
import { GoPlusCircle } from 'react-icons/go';


const Address = () => {

    const dispatch = useDispatch();

    const addresses = useSelector(state => state.Addresses)
    const [showAddAddres, setShowAddAddres] = useState(false)
    const [isAddressSelected, setIsAddressSelected] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchAddress()
    }, [])

    // const addressPerPage = 10;

    const fetchAddress = async () => {
        setLoading(true)
        try {
            const response = await api.getAddress();
            if (response.status == 1) {
                dispatch(setAllAddresses({ data: response.data }))
            } else {
                dispatch(setAllAddresses({ data: [] }))
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log("Error", error)
        }
    }

    

    const handleshowAddres = () => {
        setIsAddressSelected(false)
        setShowAddAddres(true)
    }



    return (
        <div className='w-full cardBorder rounded-sm '>
            <div className='backgroundColor flex justify-between p-4 items-center'>
                <h2 className='font-bold text-xl'>{t("manage_address")}</h2>
                {addresses?.allAddresses?.length > 0 && <button className=' flex items-center gap-2 py-1 px-1.5 md:py-2 md:px-3 rounded-sm text-base font-medium primaryBackColor text-white' onClick={handleshowAddres}><CiCirclePlus size={25} className='font-bold' />{t("add_new_address")}</button>}

            </div>
            <div className=''>
                {loading ? Array?.from({ length: 6 })?.map((_, index) => {
                    return (
                        <CardSkeleton key={index} height={200} padding="2px" />
                    )
                }) : addresses?.allAddresses?.length > 0 ? addresses?.allAddresses && addresses?.allAddresses?.map((address) => {
                    return (
                        <div key={address?.id}>
                            <AddressCard address={address} setShowAddAddres={setShowAddAddres} setIsAddressSelected={setIsAddressSelected} fetchAddress={fetchAddress} fromAddress={true} />
                        </div>
                    )
                }) : <div className=' flex justify-center  my-2 cursor-pointer' onClick={() => setShowAddAddres(true)}>
                    <div className='border-2 border-dashed p-3 w-1/3  flex items-center justify-center gap-2 font-bold text-xl'>
                        <GoPlusCircle /> {t("add_address")}
                    </div>
                </div>}

                {/* {total > addresses?.lenght &&
                    <div className='flex justify-center my-2'>
                        <button onClick={handleLoadMore} className='bg-[#29363f] py-2 px-4 text-white rounded-sm text-lg font-normal'>{t("load_more")}</button>
                    </div>
                } */}

            </div>
            <NewAddressModal showAddAddres={showAddAddres} setShowAddAddres={setShowAddAddres} isAddressSelected={isAddressSelected} fetchAddress={fetchAddress} />
        </div>
    )
}

export default Address