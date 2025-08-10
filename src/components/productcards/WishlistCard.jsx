import React, { useState } from 'react'
import { FaMinus, FaPlus, FaShoppingBasket } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import * as api from "@/api/apiRoutes"
import { useDispatch, useSelector } from 'react-redux'
import { IoMdArrowDropdown } from 'react-icons/io'
import VariantsModal from '../variantsmodal/VariantsModal'
import { setCart, setCartProducts, setCartSubTotal } from '@/redux/slices/cartSlice';
import { toast } from 'react-toastify'
import { t } from "@/utils/translation"
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder'
import SingleSellerConfirmationModal from '../single-seller-confirmation-modal/SingleSellerConfirmationModal'

const WishlistCard = ({ product, setWishlistProducts, wishlistProducts, setTotal, handleFetchLikedProducts }) => {
    const dispatch = useDispatch();
    const setting = useSelector(state => state.Setting.setting)
    const cart = useSelector(state => state.Cart)

    const [showVariants, setShowVariants] = useState(false)
    const [showSingleSellerModal, setSingleSellerModal] = useState(false)

    const getProductQuantities = (products) => {
        return Object.entries(products?.reduce((quantities, product) => {
            const existingQty = quantities[product.product_id] || 0;
            return { ...quantities, [product.product_id]: existingQty + product.qty };
        }, {})).map(([productId, qty]) => ({
            product_id: parseInt(productId),
            qty
        }));
    }

    const handleRemoveFromWishlist = async (prdctId) => {
        try {
            const response = await api.removeFromFavorite({ product_id: prdctId })
            if (response.status == 1) {
                const updateProducts = wishlistProducts?.filter((prdct) => prdct?.id != prdctId)
                setWishlistProducts(updateProducts)
                setTotal((prevTotal) => prevTotal - 1);
                await handleFetchLikedProducts()
            } else {
                console.log(response.message)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }



    const handleShowVariatModal = () => {
        if (product?.variants?.length > 0) {
            setShowVariants(true)
        } else {
            return;
        }
    }

    const handleQuantityIncrease = (e) => {
        const quantity = getProductQuantities(cart?.cartProducts)
        handleValidateAddExistingProduct(quantity, product)
    }
    const handleQuantityDecrease = (e) => {
        if (cart?.cartProducts?.find((prdct) => prdct?.product_variant_id == product?.variants[0]?.id).qty == 1) {
            removeFromCart(product?.id, product?.variants[0]?.id)
        } else {
            addToCart(product.id, product?.variants[0].id, cart?.cartProducts?.find(prdct => prdct?.product_variant_id == product?.variants[0]?.id)?.qty - 1);
        }
    }

    const removeFromCart = async (productId, variantId) => {
        try {
            const response = await api.removeFromCart({ product_id: productId, product_variant_id: variantId })
            if (response?.status === 1) {
                const updatedProducts = cart?.cartProducts?.filter(product => ((product?.product_id != productId) && (product?.product_variant_id != variantId)));
                dispatch(setCartSubTotal({ data: response?.sub_total }));
                dispatch(setCartProducts({ data: updatedProducts }));
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    const handleValidateAddExistingProduct = (productQuantity, product) => {
        const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.id)?.qty
        if (Number(product.is_unlimited_stock)) {
            if (productQty < Number(product?.total_allowed_quantity)) {
                addToCart(product.id, product?.variants[0]?.id, cart?.cartProducts?.find(prdct => prdct?.product_variant_id == product?.variants[0]?.id)?.qty + 1);
            } else {
                toast.error(t("max_cart_limit_error"));
            }
        } else {
            if (productQty >= Number(product?.variants[0].stock)) {
                toast.error(t("out_of_stock_message"));
            }
            else if (Number(productQty) >= Number(product.total_allowed_quantity)) {
                toast.error(t("max_cart_limit_error"));
            } else {
                addToCart(product.id, product?.variants[0]?.id, cart?.cartProducts?.find(prdct => prdct?.product_variant_id == product?.variants[0]?.id)?.qty + 1);
            }
        }
    };

    const addToCart = async (productId, productVId, qty) => {
        try {
            const response = await api.addToCart({ product_id: productId, product_variant_id: productVId, qty: qty })
            if (response.status === 1) {
                if (cart?.cartProducts?.find((product) => ((product?.product_id == productId) && (product?.product_variant_id == productVId)))?.qty == undefined) {
                    dispatch(setCart({ data: response }));
                    const updatedCartCount = [...cart?.cartProducts, { product_id: productId, product_variant_id: productVId, qty: qty }];
                    dispatch(setCartProducts({ data: updatedCartCount }));
                    dispatch(setCartSubTotal({ data: response?.sub_total }));
                }
                else {
                    const updatedProducts = cart?.cartProducts?.map(product => {
                        if (((product.product_id == productId) && (product?.product_variant_id == productVId))) {
                            return { ...product, qty: qty };
                        } else {
                            return product;
                        }
                    });
                    dispatch(setCart({ data: response }));
                    dispatch(setCartProducts({ data: updatedProducts }));
                    dispatch(setCartSubTotal({ data: response?.sub_total }));
                }
            } else if (response?.data?.one_seller_error_code == 1) {
                setSingleSellerModal(true)
            }
            else {
                toast.error(response.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleValidateAddNewProduct = (productQuantity, product) => {
        const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.id)?.qty

        if ((productQty || 0) >= Number(product?.total_allowed_quantity)) {

            toast.error(t("out_of_stock_message"));
        }
        else if (Number(product.is_unlimited_stock)) {
            addToCart(product.id, product?.variants[0].id, 1);
        } else {
            if (product?.variants[0]?.status) {
                addToCart(product.id, product?.variants[0]?.id, 1);
            } else {

                toast.error(t("out_of_stock_message"));
            }
        }

    };

    const handleIntialAddToCart = (e) => {
        const quantity = getProductQuantities(cart?.cartProducts)
        handleValidateAddNewProduct(quantity, product)

    }

    const isProductAlreadyAdded = ((cart?.isGuest === false && cart?.cartProducts?.find((prdct) => prdct?.product_variant_id == product?.variants[0]?.id)?.qty > 0))
    const addedQuantity = cart?.cartProducts?.find(prdct => prdct?.product_variant_id == product?.variants[0]?.id)?.qty


    return (
        <div className='cardBorder min-w-[700px]'>
            <div className="grid grid-cols-12 items-center gap-4 p-4 border-b ">
                {/* Product Image and Details */}
                <div className="col-span-4 flex space-x-5">
                    <div className="w-16 h-16 rounded-sm">
                        <ImageWithPlaceholder
                            src={product?.image_url}
                            alt="Image"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-bold text-lg">{product?.name}</h2>
                        <p className="font-normal text-sm flex gap-1 items-center cursor-pointer" onClick={handleShowVariatModal}>
                            {product?.variants[0]?.measurement}
                            {product?.variants[0]?.stock_unit_name}
                            {product?.variants?.length > 1 && <IoMdArrowDropdown />}
                        </p>
                    </div>
                </div>

                {/* Quantity Selector */}
                <div className="col-span-4 flex items-center justify-center rounded">
                    {isProductAlreadyAdded ? (
                        <div className='cardBorder flex w-[100px] h-[30px] justify-between rounded-sm my-1'>
                            <button className='md:p-1 flex items-center justify-center primaryBackColor text-white font-bold text-sm w-8 rounded-[2px]' onClick={handleQuantityDecrease}>
                                <FaMinus />
                            </button>
                            <input value={addedQuantity} disabled className='w-full h-full text-center' min="1" max={product?.variants[0]?.stock} />
                            <button className='flex items-center justify-center font-bold text-sm md:p-1 primaryBackColor text-white w-8 rounded-[2px]' onClick={handleQuantityIncrease}>
                                <FaPlus />
                            </button>
                        </div>
                    ) : (
                        <button className='flex gap-2 w-[100px] h-full  justify-center items-center primaryColor py-2 px-3 rounded-sm text-base font-semibold bg-[#55AE7B1F]' onClick={handleIntialAddToCart}>
                            <FaShoppingBasket size={22} />
                            {t("add")}
                        </button>
                    )}
                </div>

                {/* Product Price */}
                <div className="col-span-2 text-center">
                    {product?.variants[0]?.discounted_price !== 0 ? (
                        <>
                            <p className='textColor text-base font-bold'>{setting?.currency}{product?.variants[0]?.discounted_price}</p>
                            <p className='textColor text-[14px] font-normal leading-[17px] m-1 line-through'>{setting?.currency}{product?.variants[0]?.price}</p>
                        </>
                    ) : (
                        <p className='textColor text-base font-bold'>{setting?.currency}{product?.variants[0]?.price}</p>
                    )}
                </div>

                {/* Remove Button */}
                <div className="col-span-2 text-center">
                    <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveFromWishlist(product?.id)}
                    >
                        <RiDeleteBin6Line size={26} />
                    </button>
                </div>
            </div>
            {/* Variants Modal */}
            <VariantsModal product={product} showVariants={showVariants} setShowVariants={setShowVariants} />
            <SingleSellerConfirmationModal showSingleSellerModal={showSingleSellerModal} setSingleSellerModal={setSingleSellerModal} product={product} selectedVariant={product?.variants[0]} />
        </div>
    )
}

export default WishlistCard