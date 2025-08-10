import { useEffect, useState } from 'react'
import { t } from "@/utils/translation"
import * as api from "@/api/apiRoutes"
import { useSelector } from 'react-redux'
import WishlistCard from '../productcards/WishlistCard'
import CardSkeleton from '../skeleton/CardSkeleton'
import NoWishListImage from "@/assets/not_found_images/Empty_Wishlist.svg"
import Image from 'next/image'

const Wishlist = () => {
    const city = useSelector(state => state.City.city)
    const [wishlistProducts, setWishlistProducts] = useState([])
    const [offset, setOffset] = useState(0)
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(null)


    const itemPerPage = 10;

    useEffect(() => {
        handleFetchLikedProducts();
    }, [])


    const handleFetchLikedProducts = async (isAppend = false) => {
        setLoading(true)
        try {
            const response = await api.getFavorite({ latitude: city?.latitude, longitude: city.longitude, limit: itemPerPage, offset: offset })
            if (response.status == 1) {
                setWishlistProducts(isAppend ? state => [...state, ...response.data] : response.data)
                setLoading(false)
                setTotal(response.total)
            } else {
                setLoading(false)
                setTotal(0)
                console.log(response.message)
            }
        } catch (error) {
            setLoading(false)
            console.log("Error", error)
        }
    }


    const handleLoadMore = () => {

        handleFetchLikedProducts(true)
        setOffset(offset => offset + itemPerPage);
    }



    return (

        <div className='w-full cardBorder rounded-sm '>
            <div className='backgroundColor flex justify-between p-4 items-center'>
                <h2 className='font-bold text-xl'>{t("wishlist")}</h2>
            </div>
            <div className="overflow-auto">
                {loading ?
                    Array?.from({ length: 6 })?.map((_, index) => {
                        return (
                            <CardSkeleton height={200} padding="3px" key={index} />
                        )
                    })
                    : wishlistProducts?.length > 0 ? wishlistProducts?.map((prdct) => {
                        return (
                            <div key={prdct?.id}>
                                <WishlistCard product={prdct} setWishlistProducts={setWishlistProducts} wishlistProducts={wishlistProducts} setTotal={setTotal} handleFetchLikedProducts={handleFetchLikedProducts} />
                            </div>
                        )
                    }) : <div className=' col-span-12 h-full w-full flex items-center justify-center flex-col gap-2 p-2'>
                        <Image src={NoWishListImage} alt='Your wishlist is Empty' height={0} width={0} className='h-1/2 w-1/2' />
                        <h2 className='text-2xl font-bold'>{t("enter_wishlist_message")}</h2>
                    </div>}
                {(total > wishlistProducts?.length) &&
                    <div className='flex justify-center my-2'>
                        <button onClick={handleLoadMore} className='bg-[#29363f] py-2 px-4 text-white rounded-sm text-lg font-normal'>{t("load_more")}</button>
                    </div>
                }
            </div>

        </div>


    )
}

export default Wishlist