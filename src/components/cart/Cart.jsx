import React, { useEffect, useState } from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import CartProductCard from './CartProductCard'
import CartCouponCard from './CartCouponCard'
import { t } from '@/utils/translation'
import { useSelector, useDispatch } from 'react-redux'
import { setCartProducts, setCartSubTotal } from '@/redux/slices/cartSlice'
import * as api from "@/api/apiRoutes"
import CouponCodeDrawer from '@/components/couponcode/CouponCodeDrawer'
import Link from 'next/link'
import Image from 'next/image'
import NoCartData from "@/assets/Empty_Cart.svg"
import Loader from '../loader/Loader'


const Cart = () => {
    const dispatch = useDispatch();
    const city = useSelector(state => state.City.city);
    const cart = useSelector(state => state.Cart)
    const user = useSelector(state => state.User)


    const [cartProductsData, setCartProductsData] = useState([])
    const [showCouponCode, setShowCouponCode] = useState(false)
    const [cartData, setCartData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (cart?.isGuest == true && cart?.guestCart?.length == 0) {
            setCartProductsData([])
        }
        else if (cart.isGuest == false) {
            fetchCart()
        } else if (cart?.guestCart?.length > 0 && cart?.isGuest == true) {
            fetchGuestCart()
        }
    }, [])

    const fetchGuestCart = async () => {
        setLoading(true)
        try {
            const variantIds = cart?.guestCart?.map((p) => p.product_variant_id);
            const quantities = cart?.guestCart?.map((p) => p.qty);
            const response = await api.getGuestCart({ latitude: city?.latitude, longitude: city?.longitude, variant_ids: variantIds?.join(","), quantities: quantities?.join(",") })
            if (response.status == 1) {
                setCartProductsData(response.data.cart);
                dispatch(setCartSubTotal({ data: response?.data?.sub_total }));
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log("Error", error)
        }
    }

    const fetchCart = async () => {
        setLoading(true)
        try {
            const cartData = await api.getCart({ latitude: city?.latitude, longitude: city?.longitude })
            if (cartData?.status == 1) {
                setCartProductsData(cartData?.data?.cart)
                dispatch(setCartSubTotal({ data: cartData?.data?.sub_total }));
                setCartData(cartData?.data)
                setLoading(false)
                const productsData = cartData?.data?.cart?.map((product) => {
                    return {
                        product_id: product?.product_id,
                        product_variant_id: product?.product_variant_id,
                        qty: product?.qty
                    };
                });
                dispatch(setCartProducts({ data: productsData }));
            } else {
                dispatch(setCartProducts({ data: [] }));
                dispatch(setCartSubTotal({ data: 0 }));
                setCartProductsData([])
                // setCartData([])
                setCartSubTotal(0)
                setLoading(false)
            }

        } catch (error) {
            setLoading(false)
            console.log("error", error)
        }
    }





    return (
        loading ? <Loader height={800} /> :
            <section>
                <BreadCrumb />
                <div div className="container" >
                    {cartProductsData?.length > 0 ? <div className="my-12 px-2">
                        <div className="flex flex-col gap-1">
                            <h1 className="font-bold text-2xl">{t("myCart")}</h1>
                            <p className="font-medium text-base">{`${t("there_are")} ${cartProductsData?.length}  ${t("product_in_your_cart")}`}</p>
                        </div>
                        <div className="grid grid-cols-12  gap-4 mt-6 ">
                            <div className="col-span-12 md:col-span-8 cardBorder rounded-sm w-full overflow-hidden">
                                <div className="w-full overflow-x-auto">
                                    <div className="grid grid-cols-12 gap-4 min-w-[600px] p-4 font-medium border-b border-gray-300">
                                        <div className="col-span-4 font-bold">{t("product")}</div>
                                        <div className="col-span-2 text-center font-bold">{t("price")}</div>
                                        <div className="col-span-3 text-center font-bold">{t("quantity")}</div>
                                        <div className="col-span-2 text-center font-bold">{t("total")}</div>
                                        <div className="col-span-1 text-center font-bold">{t("action")}</div>
                                    </div>

                                    {cartProductsData?.map((product) => {
                                        if (cart?.cartProducts?.find((prdct) => prdct?.product_variant_id == product?.product_variant_id)?.qty > 0 || cart?.guestCart?.find((prdct) => prdct?.product_variant_id == product?.product_variant_id)?.qty > 0) {
                                            return (
                                                <CartProductCard
                                                    key={product?.id}
                                                    product={product}
                                                    cartProductsData={cartProductsData}
                                                    setCartProductsData={setCartProductsData}
                                                />
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <CartCouponCard setShowCouponCode={setShowCouponCode} />
                            </div>
                        </div>
                    </div> : <div className='flex items-center justify-center h-full my-auto mx-10'>
                        <div className='flex items-center justify-center flex-col gap-2 my-4'>
                            <Image src={NoCartData} alt='No Cart Data' height={0} width={0} className='h-full w-full' />
                            <h1 className='font-bold text-[22px] text-center py-2'>{t("empty_cart_list_message")}</h1>
                            <p className='font-bold text-xs text-center'>{t("empty_cart_list_description")}</p>
                            <Link href="/products" className="primaryBackColor text-white font-bold p-1 rounded-sm">{t("empty_cart_list_button_name")}</Link>
                        </div>
                    </div>}

                </div >
                <CouponCodeDrawer showCouponCode={showCouponCode} setShowCouponCode={setShowCouponCode} />
            </section >
    );

}

export default Cart