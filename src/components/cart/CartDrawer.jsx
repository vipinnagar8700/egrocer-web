import React, { useEffect, useState } from 'react';
import { t } from "@/utils/translation";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import CartProductsCard from './CartDrawerProductsCard';
import { useSelector } from 'react-redux';
import * as api from "@/api/apiRoutes"
import { IoIosCloseCircle } from 'react-icons/io';
import NoCartData from "@/assets/Empty_Cart.svg"
import Image from 'next/image';
import { clearCartPromo, setCartProducts, setCartPromo, setCartSubTotal, setGuestCartTotal } from '@/redux/slices/cartSlice';
import { useDispatch } from 'react-redux';
import Login from '../login/Login';
import { useRouter } from 'next/router';
import CouponCodeDrawer from '@/components/couponcode/CouponCodeDrawer';
import { RiCoupon3Line } from 'react-icons/ri';
import Link from 'next/link';
import Loader from '../loader/Loader';

const CartDrawer = ({ showCart, setShowCart, setMobileActiveKey }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const city = useSelector(state => state.City.city);
    const cart = useSelector(state => state.Cart)
    const user = useSelector(state => state.User)
    const setting = useSelector(state => state.Setting.setting)
    const language = useSelector(state => state.Language.selectedLanguage)
    const coupon = useSelector(state => state.Cart.promo_code)

    const [showLogin, setShowLogin] = useState(false)
    const [cartProductsData, setCartProductsData] = useState([])
    const [cartData, setCartData] = useState([])
    const [loading, setLoading] = useState(false)
    const [showCouponCode, setShowCouponCode] = useState(false)


    useEffect(() => {
        if (showCart) {
            if (cart?.isGuest == true && cart?.guestCart?.length == 0) {
                setCartProductsData([])
            }
            else if (cart.isGuest == false) {
                fetchCart()
            } else if (cart?.guestCart?.length > 0 && cart?.isGuest == true) {
                fetchGuestCart()
            }
        }
    }, [showCart])



    const fetchCart = async () => {
        setLoading(true)
        try {
            const cartData = await api.getCart({ latitude: city?.latitude, longitude: city?.longitude })
            if (cartData?.status == 1) {
                setCartProductsData(cartData?.data?.cart)
                dispatch(setCartSubTotal({ data: cartData?.data?.sub_total }));
                setCartData(cartData?.data)
                await handleApplyCoupon();
                const productsData = cartData?.data?.cart?.map((product) => {
                    return {
                        product_id: product?.product_id,
                        product_variant_id: product?.product_variant_id,
                        qty: product?.qty
                    };
                });

                dispatch(setCartProducts({ data: productsData }));
                setLoading(false)
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

    const handleApplyCoupon = async () => {
        setLoading(true)
        try {
            const response = await api.setPromoCode({ promoCodeName: coupon?.promo_code, amount: cart?.cartSubTotal })
            if (response.status == 1) {
                dispatch(setCartPromo({ data: response.data }))
                setShowCouponCode(false)
            } else {
                await handleRemoveCoupon()
            }
        } catch (error) {
            console.log("Error", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchGuestCart = async () => {
        try {
            const variantIds = cart?.guestCart?.map((p) => p.product_variant_id);
            const quantities = cart?.guestCart?.map((p) => p.qty);
            const response = await api.getGuestCart({ latitude: city?.latitude, longitude: city?.longitude, variant_ids: variantIds?.join(","), quantities: quantities?.join(",") })
            if (response.status == 1) {
                setCartProductsData(response.data.cart);
                dispatch(setCartSubTotal({ data: response?.data?.sub_total }));
                dispatch(setGuestCartTotal({ data: response?.data?.sub_total }))
            }
        } catch (error) {
            console.log("Error", error)
        }
    }



    const handleCheckoutbtnClick = () => {
        if (cart.isGuest) {
            setShowCart(false)
            setShowLogin(true)
        } else {
            router.push("/checkout")
        }
    }

    const isCouponApplied = cart?.promo_code != null;
    const handleRemoveCoupon = async () => {
        dispatch(clearCartPromo())
    }
    return (
        <>
            <Sheet open={showCart} >
                <SheetContent side={language?.type == "RTL" ? "left" : "right"} className="p-0  w-full flex flex-col h-screen">
                    <SheetHeader className="px-0 py-3 border-[1px] flex justify-between text-left">
                        <SheetTitle className="text-2xl font-bold flex flex-row items-center p-2 justify-between">
                            <p className='text-2xl font-bold'>{t("shoppingCart")}</p>
                            <div>
                                <IoIosCloseCircle className='hover:cursor-pointer' size={32} onClick={() => setShowCart(false)} />
                            </div>
                        </SheetTitle>
                    </SheetHeader>
                    {loading ? (
                        <p><Loader height={800} /></p>
                    ) : cartProductsData?.length !== 0 ? (
                        <>
                            <div className="flex-grow overflow-y-auto gap-2 p-2 flex flex-col">
                                {cartProductsData?.map((product) => (
                                    <div key={product?.id}>
                                        <CartProductsCard
                                            product={product}
                                            cartProductsData={cartProductsData}
                                            setCartProductsData={setCartProductsData}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="w-full mx-auto p-4 border rounded-md shadow-sm sticky bottom-0 ">
                                {cart?.isGuest == false && !isCouponApplied ?
                                    (<div className="mb-2">
                                        <div className='flex justify-between items-center'>
                                            <span className="text-sm font-bold">{t("have_coupon")}</span>
                                            <button className="p-1 border text-sm hover:primaryBackColor hover:text-white rounded-sm font-medium cardBorder" onClick={() => setShowCouponCode(true)}>
                                                {t("view_coupon")}
                                            </button>
                                        </div>
                                    </div>
                                    ) :
                                    (cart?.isGuest == false && isCouponApplied) && < div >
                                        <div className='flex  justify-between items-center primaryDashedBorder mb-2'>
                                            <div className='flex p-2  items-center gap-2'>
                                                <RiCoupon3Line size={32} className='primaryColor' />
                                                <div className='w-3/4'>
                                                    <p className="font-bold text-wrap text-ellipsis overflow-hidden whitespace-nowrap w-3/4 max-h-12">{cart?.promo_code?.promo_code}</p>
                                                    <p className='text-sm font-bold w-full'>{t("promoCodeSuccess")}</p>
                                                </div>
                                                <div className='flex flex-col justify-start'>
                                                    <p>{setting?.currency}{cart?.promo_code?.discount}</p>
                                                    <button className='text-red-500' onClick={handleRemoveCoupon}>{t("delete")}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                <div className="space-y-6">
                                    <div className="flex justify-between text-sm">
                                        <span>{t("total")}</span>
                                        <span className="font-bold">{setting?.currency}{cart.isGuest ? cart?.guestCartTotal : isCouponApplied ? (cart?.cartSubTotal - cart?.promo_code?.discount)?.toFixed(2) : cart?.cartSubTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <button className="w-full py-2  primaryBackColor rounded-md font-bold text-white" onClick={handleCheckoutbtnClick}>
                                        {user?.jwtToken ? t("checkout") : t("login_to_checkout")}
                                    </button>
                                    <button className="w-full py-2 border rounded-md font-medium cardBorder" onClick={() => router.push("/cart")}>
                                        {t("view_cart")}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='flex items-center justify-center h-full my-auto mx-10'>
                            <div className='flex items-center justify-center flex-col gap-2'>
                                <Image src={NoCartData} alt='No Cart Data' height={0} width={0} className='h-full w-full' />
                                <h1 className='font-bold text-[22px] text-center py-2'>{t("empty_cart_list_message")}</h1>
                                <p className='font-bold text-xs text-center'>{t("empty_cart_list_description")}</p>
                                <Link href="/products" className="primaryBackColor text-white font-bold p-1 rounded-sm">{t("empty_cart_list_button_name")}</Link>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
            <Login showLogin={showLogin} setShowLogin={setShowLogin} setMobileActiveKey={setMobileActiveKey} />
            <CouponCodeDrawer showCouponCode={showCouponCode} setShowCouponCode={setShowCouponCode} />
        </>
    );
};

export default CartDrawer;
