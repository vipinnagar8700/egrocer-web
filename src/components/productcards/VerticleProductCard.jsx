import React, { useState, useEffect } from 'react'
import { FaRegHeart, FaRegEye, FaRegStar, FaStar, FaShoppingBasket, FaMinus, FaPlus } from "react-icons/fa";
import Link from 'next/link';
import { t } from "@/utils/translation"
import { MdArrowDropDown } from "react-icons/md";
import VariantsModal from '../variantsmodal/VariantsModal'
import ProductDetailModal from '../productdetailmodal/ProductDetailModal';
import { useDispatch, useSelector } from 'react-redux';
import { addGuestCartTotal, addtoGuestCart, setCart, setCartProducts, setCartSubTotal, subGuestCartTotal } from '@/redux/slices/cartSlice';
import * as api from "@/api/apiRoutes"
import { toast } from 'react-toastify';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import { setFavoriteProductIds } from '@/redux/slices/FavoriteSlice';
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import SingleSellerConfirmationModal from '../single-seller-confirmation-modal/SingleSellerConfirmationModal';
import { isRtl } from '@/lib/utils';
import { GoEye } from 'react-icons/go';


const VerticleProductCard = ({ product, largeImage = false }) => {
    const isLtr = isRtl()
    const dispatch = useDispatch();

    const cart = useSelector(state => state.Cart)
    const setting = useSelector(state => state.Setting.setting)
    const user = useSelector(state => state.User)
    const favoriteProducts = useSelector(state => state.Favorite.favouriteProductIds)

    const [selectedVariant, setSelectedVariant] = useState([])
    const [showVariants, setShowVariants] = useState(false)
    const [showProductDetail, setShowProductDetail] = useState(false)
    const [showSingleSellerModal, setSingleSellerModal] = useState(false)

    useEffect(() => {
        const inStockVariant = product?.variants?.find((variant) => variant?.is_unlimited_stock === 0 && variant?.stock > 0)
        if (inStockVariant == undefined) {
            setSelectedVariant(product?.variants?.[0])
        } else {
            setSelectedVariant(inStockVariant)
        }
    }, [])
    const calculateDiscount = (discountPrice, actualPrice) => {
        const difference = actualPrice - discountPrice;
        const actualDiscountPrice = (difference / actualPrice)
        return actualDiscountPrice * 100;
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
    // cart functionality
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
    const AddToGuestCart = (product, productId, productVariantId, Qty, isExisting, flag) => {
        const finalPrice = selectedVariant?.discounted_price !== 0 ? selectedVariant?.discounted_price : selectedVariant?.price
        if (isExisting) {
            let updatedProducts;
            if (Qty !== 0) {
                if (flag == "add") {
                    dispatch(addGuestCartTotal({ data: finalPrice }));
                } else if (flag == "remove") {
                    dispatch(subGuestCartTotal({ data: finalPrice }));
                }
                updatedProducts = cart?.guestCart?.map((product) => {
                    if (product?.product_id == productId && product?.product_variant_id == productVariantId) {
                        return { ...product, qty: Qty };
                    } else {
                        // dispatch(addGuestCartTotal({ data: finalPrice }));
                        return product;
                    }
                });
            } else {
                if (flag == "add") {
                    dispatch(addGuestCartTotal({ data: finalPrice }));
                } else if (flag == "remove") {
                    dispatch(subGuestCartTotal({ data: finalPrice }));
                }
                updatedProducts = cart?.guestCart?.filter(product =>
                    product?.product_id != productId && product?.product_variant_id != productVariantId
                );
            }
            dispatch(addtoGuestCart({ data: updatedProducts }));
        } else {
            if (flag == "add") {
                dispatch(addGuestCartTotal({ data: finalPrice }));
            } else if (flag == "remove") {
                dispatch(subGuestCartTotal({ data: finalPrice }));
            }
            // dispatch(addGuestCartTotal({ data: finalPrice }))
            const productData = { product_id: productId, product_variant_id: productVariantId, qty: Qty, productPrice: finalPrice };
            dispatch(addtoGuestCart({ data: [...cart?.guestCart, productData] }));
        }
    };
    const handleValidateAddExistingGuestProduct = (productQuantity, product, quantity) => {
        const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.id)?.qty;

        if (Number(product.is_unlimited_stock !== 0)) {

            if (productQty >= Number(product?.total_allowed_quantity)) {
                toast.error(t("max_cart_limit_error"));
            }
            else {
                AddToGuestCart(product, product?.id, selectedVariant?.id, quantity, 1, "add");
            }
        }
        else {
            if (productQty >= Number(selectedVariant?.stock)) {
                toast.error(t("out_of_stock_message"));
            }
            else if (productQty >= Number(product?.total_allowed_quantity)) {
                toast.error(t("max_cart_limit_error"));
            }
            else {
                AddToGuestCart(product, product?.id, selectedVariant?.id, quantity, 1, "add");
            }
        }
    };
    const handleAddNewProductGuest = (productQuantity, product) => {
        const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.id)?.qty
        if (selectedVariant?.is_unlimited_stock == 0 && selectedVariant?.stock == 0) {
            toast.error(t("out_of_stock_message"));
        }
        else if (Number(productQty || 0) < Number(product.total_allowed_quantity)) {
            AddToGuestCart(product, product.id, selectedVariant?.id, 1, 0, "add");
        } else {
            toast.error(t("out_of_stock_message"));
        }
    };
    const handleValidateAddNewProduct = (productQuantity, product) => {
        const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.id)?.qty

        if ((productQty || 0) >= Number(product?.total_allowed_quantity)) {

            toast.error(t("out_of_stock_message"));
        } else if (selectedVariant?.is_unlimited_stock == 0 && selectedVariant?.stock <= 0) {
            toast.error(t("out_of_stock_message"));
        }
        else if (Number(product.is_unlimited_stock)) {
            addToCart(product.id, selectedVariant.id, 1);
        } else {
            if (selectedVariant?.status) {
                addToCart(product.id, selectedVariant?.id, 1);
            } else {

                toast.error(t("out_of_stock_message"));
            }
        }

    };
    const handleIntialAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (cart?.isGuest) {
            const quantity = getProductQuantities(cart?.cartProducts)
            handleAddNewProductGuest(quantity, product)
        } else {
            const quantity = getProductQuantities(cart?.cartProducts)
            handleValidateAddNewProduct(quantity, product)
        }
    }
    const handleValidateAddExistingProduct = (productQuantity, product) => {
        const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.id)?.qty
        if (Number(product.is_unlimited_stock)) {
            if (productQty < Number(product?.total_allowed_quantity)) {
                addToCart(product.id, selectedVariant?.id, cart?.cartProducts?.find(prdct => prdct?.product_variant_id == selectedVariant?.id)?.qty + 1);
            } else {
                toast.error(t("max_cart_limit_error"))
            }
        } else {
            if (productQty >= Number(selectedVariant.stock)) {
                toast.error(t("out_of_stock_message"));
            }
            else if (Number(productQty) >= Number(product.total_allowed_quantity)) {
                toast.error(t("max_cart_limit_error"))
            } else {
                addToCart(product.id, selectedVariant?.id, cart?.cartProducts?.find(prdct => prdct?.product_variant_id == selectedVariant?.id)?.qty + 1);
            }
        }
    };
    const handleQuantityIncrease = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (cart?.isGuest) {
            const productQuantity = getProductQuantities(cart?.guestCart)
            handleValidateAddExistingGuestProduct(
                productQuantity,
                product,
                cart?.guestCart?.find(prdct => prdct?.product_id == product?.id && prdct?.product_variant_id == selectedVariant?.id)?.qty + 1
            )
        } else {
            const quantity = getProductQuantities(cart?.cartProducts)
            handleValidateAddExistingProduct(quantity, product)
        }
    }
    const handleQuantityDecrease = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (cart?.isGuest) {
            AddToGuestCart(
                product,
                product?.id,
                selectedVariant?.id,
                cart?.guestCart?.find((prdct) => prdct?.product_variant_id == selectedVariant?.id)?.qty - 1,
                1,
                "remove"
            );
        } else {
            if (cart?.cartProducts?.find((prdct) => prdct?.product_variant_id == selectedVariant?.id).qty == 1) {
                removeFromCart(product?.id, selectedVariant?.id)
            } else {
                addToCart(product.id, selectedVariant.id, cart?.cartProducts?.find(prdct => prdct?.product_variant_id == selectedVariant?.id)?.qty - 1);
            }
        }
    }
    const handleShowVariantModal = (e, product) => {
        e.preventDefault()
        e.stopPropagation()
        if (product.variants.length > 1) {
            setShowVariants(true)
        } else {
            return
        }
    }
    const handleShowDetailModal = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setShowProductDetail(true)
    }

    const handleProductLikes = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isAlreadyLikes = favoriteProducts?.includes(product?.id)
        try {
            if (user?.jwtToken) {
                if (!isAlreadyLikes) {
                    const response = await api.addToFavorite({ product_id: product?.id })
                    if (response.status == 1) {
                        const updatedFavProducts = [...favoriteProducts, product?.id]
                        dispatch(setFavoriteProductIds({ data: updatedFavProducts }))
                        toast.success(response.message)
                    } else {
                        toast.error(response.message)
                    }
                } else {
                    const response = await api.removeFromFavorite({ product_id: product?.id })
                    if (response.status == 1) {
                        const updatedFavProducts = favoriteProducts?.filter((prdctId) => prdctId != product?.id)
                        dispatch(setFavoriteProductIds({ data: updatedFavProducts }))
                        toast.success(response.message)
                    } else {
                        toast.error(response.message)
                    }
                }
            } else {
                toast.error(t("required_login_message_for_wishlist"))
            }

        } catch (error) {
            console.log("Error", error)
        }
    }

    const productsVariants = product.variants


    const isProductAlreadyAdded = ((cart?.isGuest === false && cart?.cartProducts?.find((prdct) => prdct?.product_variant_id == selectedVariant?.id)?.qty > 0) ||
        (cart?.isGuest === true && cart?.guestCart?.find((prdct) => prdct?.product_variant_id === selectedVariant?.id)?.qty > 0))

    const addedQuantity = cart.isGuest === false ?
        cart?.cartProducts?.find(prdct => prdct?.product_variant_id == selectedVariant?.id)?.qty
        : cart?.guestCart?.find(prdct => prdct?.product_variant_id == selectedVariant?.id)?.qty

    const isProductAvailabel = ((product?.variants?.length <= 1 && product?.variants?.[0]?.is_unlimited_stock == 0 && product?.variants?.[0]?.stock == 0) || (selectedVariant?.stock <= 0 && selectedVariant?.is_unlimited_stock == 0) || (product?.variants?.length <= 1 && product?.variants?.[0]?.status == 0))
    return (
        <div>
            <Link href={`/product/${product?.slug}`} className='flex flex-col p-2 cardBorder group  headerBackgroundColor textColor cardBorder hover:shadow-lg [.image-card_&]:rounded-none [.cardBorder_&]:rounded-none rounded-md'>
                <div className='flex relative textColor'>
                    <div className='relative aspect-square w-full h-48 [.verticle-card_&]:h-44 [.image-card_&]:h-64 [.verticle-card_&]:md:h-72'>
                        <ImageWithPlaceholder className='rounded-lg object-cover h-full w-full' alt={product.name} src={product.image_url} />
                        {selectedVariant?.discounted_price !== 0 && selectedVariant?.discounted_price !== selectedVariant?.price ? <span className="bg-[#db3d26] rounded-[4px] text-white text-[14px] font-medium left-0 leading-[16px] px-2 py-1 absolute text-center uppercase top-0">
                            {calculateDiscount(selectedVariant?.discounted_price, selectedVariant?.price).toFixed(2)}% {t("off")}
                        </span> : null}
                        <ul className="absolute right-3 top-5 flex flex-col gap-2 translate-x-3 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                            <li className='buttonBorder hover:primaryBorder hover:primaryColor rounded-full h-[30px] w-[30px] flex justify-center items-center bodyBackgroundColor' onClick={handleProductLikes}><span>{favoriteProducts && favoriteProducts?.includes(product?.id) ? <BiSolidHeart size={20} className='primaryFilledColor' /> : <BiHeart size={20} />}</span></li>
                            <li className='buttonBorder hover:primaryBorder hover:primaryColor rounded-full h-[30px] w-[30px] flex justify-center items-center bodyBackgroundColor'><div onClick={handleShowDetailModal} ><GoEye size={20} /></div></li>
                        </ul>
                    </div>
                </div>
                <div className='h-[100px] flex flex-col justify-between '>
                    <h3 className="flex textColor text-[16px] font-bold leading-[1.2] mt-3 max-h-[2.4em] overflow-hidden text-ellipsis capitalize w-full group-hover:primaryColor py-[2px]">{product?.name}</h3>
                    {product?.average_rating > 0 ?
                        <div className="rating">
                            <div className="flex">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        return (
                                            <FaStar
                                                key={star}
                                                size={15}
                                                className={`${star <= parseInt(product?.average_rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-gray-200 text-gray-200'
                                                    }`}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        : null}
                    <div className='flex'>
                        {selectedVariant?.discounted_price !== 0 && selectedVariant?.discounted_price !== selectedVariant?.price ? <>  <p className='textColortext-base font-bold'>{setting?.currency}{selectedVariant?.discounted_price}</p>
                            <p className='textColor text-[14px] font-normal leading-[17px] m-1 line-through'>{setting?.currency}{selectedVariant?.price}</p></> : <p className='textColor text-base font-bold'>{setting?.currency}{selectedVariant?.price}</p>}
                    </div>
                </div>
                {!isProductAvailabel ? <div className='flex gap-0 md:gap-3 h-[80px] md:h-[44px] w-full flex-col md:flex-row'>
                    <button onClick={(e) => handleShowVariantModal(e, product)} className='md:w-1/2 w-full flex items-center my-[5px] justify-between  rounded-[4px] px-2 py-1.5 md:py-2  buttonBackground text-sm md:text-nowrap' >{`${selectedVariant?.measurement} ${selectedVariant?.stock_unit_name}`}{productsVariants?.length > 1 ? <div><MdArrowDropDown size={16} /></div> : <></>}</button>
                    {isProductAlreadyAdded ?
                        <div className='md:w-1/2 w-full cardBorder flex justify-between rounded-sm my-1'>
                            <button className=' md:px-0.5 flex items-center justify-center primaryBackColor  text-white font-bold text-sm w-8  h-[34px] rounded-[2px]' onClick={handleQuantityDecrease}><FaMinus /></button>
                            <input value={addedQuantity} disabled className='w-1/2  text-center' min={"1"} max={selectedVariant?.stock} />
                            <button className=' flex items-center justify-center font-bold text-sm  md:p-1 primaryBackColor text-white w-8  rounded-[2px] h-[34px] ' onClick={handleQuantityIncrease}><FaPlus /></button>
                        </div>
                        : <button className={`w-full md:w-1/2 flex gap-1 text-base  my-[5px] p-1 md:p-0 items-center  justify-center rounded-[4px]  hover:primaryBackColor transition-all duration-300 hover:text-white addToCartColor primaryColor `} onClick={handleIntialAddToCart}><FaShoppingBasket size={20} /><span>{t("add")}</span></button>}

                </div> : <div className='flex items-center h-[80px] md:h-[44px]  text-[#db3d26] font-extrabold '>{t("OutOfStock")}</div>}
            </Link>
            <ProductDetailModal product={product} showDetailModal={showProductDetail} setShowDetailModal={setShowProductDetail} />
            <VariantsModal product={product} showVariants={showVariants} setShowVariants={setShowVariants} />
            <SingleSellerConfirmationModal showSingleSellerModal={showSingleSellerModal} setSingleSellerModal={setSingleSellerModal} product={product} selectedVariant={selectedVariant} />
        </div>
    )
}

export default VerticleProductCard;
