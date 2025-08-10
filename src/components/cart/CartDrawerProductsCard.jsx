import React from 'react'
import { IoClose } from 'react-icons/io5'
import { TiMinus, TiPlus } from "react-icons/ti";
import { useDispatch, useSelector } from 'react-redux';
import * as api from "@/api/apiRoutes"
import { addtoGuestCart, clearCartPromo, setCartProducts, setCartPromo, setCartSubTotal, setGuestCartTotal } from '@/redux/slices/cartSlice';
import { toast } from 'react-toastify';
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import { t } from '@/utils/translation';
import { FiMinus, FiPlus } from 'react-icons/fi';


const CartDrawerProductsCard = ({ product, cartProductsData, setCartProductsData }) => {
    const dispatch = useDispatch();
    const setting = useSelector(state => state.Setting.setting)
    const cart = useSelector(state => state.Cart)
    const coupon = useSelector(state => state.Cart.promo_code)


    const handleRemoveFromCart = async () => {
        try {
            const response = await api.removeFromCart({ product_id: product?.product_id, product_variant_id: product?.product_variant_id })
            if (response?.status == 1) {
                const remainItems = cart?.cartProducts?.filter((cartProduct) => (cartProduct?.product_variant_id !== product?.product_variant_id))
                const updatedProducts = cartProductsData?.filter((cartProduct) => (cartProduct?.product_variant_id !== product?.product_variant_id))
                setCartProductsData(updatedProducts)
                dispatch(setCartProducts({ data: remainItems }))
                dispatch(setCartSubTotal({ data: response?.sub_total }))
                if (updatedProducts?.length <= 0) {
                    dispatch(clearCartPromo())
                }
                await handleApplyCoupon()
                // toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleCalculateTotal = (products) => {
        const total = products?.reduce((prev, curr) => {
            prev += (curr?.productPrice * curr.qty)
            return prev
        }, 0)
        if (cart?.isGuest) {
            dispatch(setGuestCartTotal({ data: total }))
        } else {
            dispatch(setCartSubTotal({ data: total }))
        }
    }

    const handleGuestCartRemove = () => {
        const remainItems = cart?.guestCart?.filter((cartProduct) => (cartProduct?.product_variant_id !== product?.product_variant_id))
        const updatedProducts = cartProductsData?.filter((cartProduct) => (cartProduct?.product_variant_id !== product?.product_variant_id))
        setCartProductsData(updatedProducts)
        dispatch(addtoGuestCart({ data: remainItems }))
        handleCalculateTotal(remainItems)
    }

    const handleRemoveItem = async () => {
        if (cart.isGuest) {
            handleGuestCartRemove()
        } else {
            await handleRemoveFromCart()
        }
    }

    const getProductQuantities = (products) => {
        return Object.entries(products?.reduce((quantities, product) => {
            const existingQty = quantities[product.product_id] || 0;
            return { ...quantities, [product.product_id]: existingQty + product.qty };
        }, {})).map(([productId, qty]) => ({
            product_id: parseInt(productId),
            qty
        }));
    }



    const handleQuantityIncrease = async () => {
        try {
            let productQuantity = cart?.isGuest ? getProductQuantities(cart?.guestCart) : getProductQuantities(cart?.cartProducts)
            const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.product_id)?.qty;
            const cartProductQty = cart.cartProducts.find(prdct => prdct?.product_id == product?.product_id && prdct?.product_variant_id == product?.product_variant_id)
            if (product?.is_unlimited_stock !== 0) {
                if (productQty >= Number(product?.total_allowed_quantity)) {
                    toast.error(t("max_cart_limit_error"));
                } else {
                    if (cart.isGuest) {
                        let updatedProducts = cart?.guestCart?.map((cartProduct) => {
                            if (cartProduct?.product_id == product?.product_id && cartProduct?.product_variant_id == product?.product_variant_id) {
                                return { ...cartProduct, qty: Number(cartProduct?.qty + 1) };
                            } else {
                                return cartProduct;
                            }
                        });


                        handleCalculateTotal(updatedProducts)
                        dispatch(addtoGuestCart({ data: updatedProducts }))
                    } else {
                        try {
                            const response = await api.addToCart({ product_id: product?.product_id, product_variant_id: product?.product_variant_id, qty: Number(cartProductQty.qty + 1) })
                            if (response.status == 1) {
                                let updatedProducts = cart?.cartProducts?.map((cartProduct) => {
                                    if (cartProduct?.product_id == product?.product_id && cartProduct?.product_variant_id == product?.product_variant_id) {
                                        return { ...cartProduct, qty: cartProductQty?.qty + 1 };
                                    } else {
                                        return cartProduct;
                                    }
                                });
                                dispatch(setCartSubTotal({ data: response.sub_total }))
                                dispatch(setCartProducts({ data: updatedProducts }))
                                await handleApplyCoupon(response.sub_total)
                            }
                        } catch (error) {
                            console.log("Error", error)
                        }
                    }

                }
            }
            else {
                if (productQty >= Number(product?.stock)) {
                    toast.error(t("out_of_stock_message"));
                }
                else if (productQty >= Number(product?.total_allowed_quantity)) {
                    toast.error(t("max_cart_limit_error"));
                }
                else {
                    if (cart.isGuest) {
                        let updatedProducts = cart?.guestCart?.map((cartProduct) => {
                            if (cartProduct?.product_id == product?.product_id && cartProduct?.product_variant_id == product?.product_variant_id) {
                                return { ...cartProduct, qty: Number(cartProduct?.qty + 1) };
                            } else {
                                return cartProduct;
                            }
                        });
                        handleCalculateTotal(updatedProducts)
                        dispatch(addtoGuestCart({ data: updatedProducts }))
                    } else {
                        try {
                            const response = await api.addToCart({ product_id: product?.product_id, product_variant_id: product?.product_variant_id, qty: Number(cartProductQty.qty + 1) })
                            if (response.status == 1) {
                                let updatedProducts = cart?.cartProducts?.map((cartProduct) => {
                                    if (cartProduct?.product_id == product?.product_id && cartProduct?.product_variant_id == product?.product_variant_id) {
                                        return { ...cartProduct, qty: cartProductQty?.qty + 1 };
                                    } else {
                                        return cartProduct;
                                    }
                                });
                                dispatch(setCartSubTotal({ data: response.sub_total }))
                                dispatch(setCartProducts({ data: updatedProducts }))
                                await handleApplyCoupon(response.sub_total)
                            }
                        } catch (error) {
                            console.log("Error", error)
                        }
                    }
                }
            }

        } catch (error) {
            console.log("Error", error)
        }
    }

    // Calling this function on every increament decreament so total adjust with coupon card
    const handleApplyCoupon = async (total) => {
        try {
            const response = await api.setPromoCode({ promoCodeName: coupon?.promo_code, amount: total })
            if (response.status == 1) {
                dispatch(setCartPromo({ data: response.data }))
            } else {
                await handleRemoveCoupon()
            }
        } catch (error) {
            console.log("Error", error)
        }
    }


    const handleRemoveCoupon = async () => {
        dispatch(clearCartPromo())
    }

    const handleQuantityDecrease = async () => {
        try {
            let productQuantity;
            if (cart?.isGuest) {
                productQuantity = getProductQuantities(cart?.guestCart)
            } else {
                productQuantity = getProductQuantities(cart?.cartProducts)
            }
            const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.product_id)?.qty;
            const variantQty = cart?.guestCart?.find(prdct => prdct?.product_id == product?.product_id && prdct?.product_variant_id == product?.product_variant_id)?.qty;
            const cartProductQty = cart.cartProducts.find(prdct => prdct?.product_id == product?.product_id && prdct?.product_variant_id == product?.product_variant_id)
            if (cart.isGuest) {
                if (variantQty <= 1) {
                    return;
                }
                let updatedProducts = cart?.guestCart?.map((cartProduct) => {
                    if (cartProduct?.product_id == product?.product_id && cartProduct?.product_variant_id == product?.product_variant_id) {
                        return { ...cartProduct, qty: Number(cartProduct?.qty - 1) };
                    } else {
                        return cartProduct
                    }
                });
                handleCalculateTotal(updatedProducts)
                dispatch(addtoGuestCart({ data: updatedProducts }))
            } else {
                if (cartProductQty.qty <= 1) {
                    return;
                }
                try {
                    const response = await api.addToCart({ product_id: product?.product_id, product_variant_id: product?.product_variant_id, qty: Number(cartProductQty.qty - 1) })
                    if (response.status == 1) {
                        let updatedProducts = cart?.cartProducts?.map((cartProduct) => {
                            if (cartProduct?.product_id == product?.product_id && cartProduct?.product_variant_id == product?.product_variant_id) {
                                return { ...cartProduct, qty: cartProductQty?.qty - 1 };
                            } else {
                                return cartProduct;
                            }
                        });
                        dispatch(setCartSubTotal({ data: response.sub_total }))
                        dispatch(setCartProducts({ data: updatedProducts }))
                        await handleApplyCoupon(response.sub_total)
                    }
                } catch (error) {
                    console.log("Error", error)
                }
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const addedQuantity = cart.isGuest === false ?
        cart?.cartProducts?.find(prdct => prdct?.product_variant_id == product?.product_variant_id)?.qty
        : cart?.guestCart?.find(prdct => prdct?.product_variant_id == product?.product_variant_id)?.qty



    return (
        <div>
            <div className='grid grid-cols-12 p-2 cardBorder mx-2 my-1 gap-2 rounded-sm '>
                <div className='col-span-4 '>
                    <div className='h-full w-full object-cover aspect-square relative'>
                        <ImageWithPlaceholder src={product?.image_url} alt='Image' className='h-full w-full object-cover' />
                    </div>
                </div>
                <div className='col-span-8'>
                    <div className='flex flex-col justify-between h-full'>
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis w-[80%]">
                                {product?.name}
                            </h2>
                            <IoClose size={20} onClick={handleRemoveItem} />
                        </div>

                        <div className='mt-2'>
                            <span className='flex items-center gap-1'>{product?.measurement} {product?.unit_code}</span>
                        </div>
                        <div className='flex justify-between items-center mt-4'>
                            <div className='flex border-2 items-center leading-5 w-1/2 justify-between p-1 rounded-sm'>
                                <button className='text-2xl font-bold px-1' onClick={handleQuantityDecrease}><FiMinus size={20} /></button>
                                <span className='w-full text-center'>{addedQuantity}</span>
                                <button className='text-2xl font-bold px-1' onClick={() => handleQuantityIncrease()}><FiPlus size={20} /></button>
                            </div>
                            {/* <div className='flex gap-1 items-center'>
                                {product?.discounted_price != 0 && product?.discounted_price !== product?.price ? <> <h2 className='text-base font-bold'> {setting?.currency}{product?.discounted_price}</h2>
                                    <p className='text-sm font-normal line-through'>{setting?.currency} {product?.price}</p></> : <h2 className='text-base font-bold'>{setting?.currency} {product?.price}</h2>}
                            </div> */}

                            <div className='flex flex-col sm:flex-row gap-1 items-start sm:items-center'>
                                {product?.discounted_price != 0 && product?.discounted_price !== product?.price ? (
                                    <>
                                        <h2 className='text-base font-bold whitespace-nowrap'>{setting?.currency}{product?.discounted_price}</h2>
                                        <p className='text-sm font-normal line-through whitespace-nowrap opacity-50'>{setting?.currency} {product?.price}</p>
                                    </>
                                ) : (
                                    <h2 className='text-base font-bold whitespace-nowrap '>{setting?.currency} {product?.price}</h2>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default CartDrawerProductsCard