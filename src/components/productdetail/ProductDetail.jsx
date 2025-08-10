"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as api from "@/api/apiRoutes"
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { FaLink, FaRegHeart, FaShoppingBasket, FaStar } from 'react-icons/fa';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { t } from "@/utils/translation"
import VegIcon from "@/assets/VegIcon.svg";
import NonVegIcon from "@/assets/NonVegIcon.svg";
import NonCancelable from "@/assets/NotCancelable.svg";
import Cancelable from "@/assets/Cancelable.svg";
import Returnable from "@/assets/Returnable.svg";
import ProductNotFoundImage from "@/assets/not_found_images/No_product_found.svg"
import NotReturnable from "@/assets/NotReturnable.svg";
import { WhatsappShareButton, WhatsappIcon, TwitterIcon, TwitterShareButton, FacebookIcon, FacebookShareButton } from "react-share";
import ProductDescription from './ProductDescription';
import BreadCrumb from '../breadcrumb/BreadCrumb';
import Loader from '../loader/Loader';
import { toast } from 'react-toastify';
import { addGuestCartTotal, addtoGuestCart, setCart, setCartProducts, setCartSubTotal, setGuestCartTotal } from '@/redux/slices/cartSlice';
import { setFavoriteProductIds } from '@/redux/slices/FavoriteSlice';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import SimilarProducts from '../productslist/SimilarProducts';
import { usePathname } from 'next/navigation';
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import SingleSellerConfirmationModal from '../single-seller-confirmation-modal/SingleSellerConfirmationModal';
import Link from 'next/link';


const ProductDetail = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { slug } = router.query;
    const pathname = usePathname()
    const city = useSelector(state => state.City.city)
    const setting = useSelector(state => state.Setting)
    const language = useSelector(state => state.Language.selectedLanguage)


    const cart = useSelector(state => state.Cart)
    const user = useSelector(state => state.User)
    const favoriteProducts = useSelector(state => state.Favorite.favouriteProductIds)

    const [product, setProduct] = useState([])
    const [selectVariant, setSelectedVariant] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [ratingData, setRatingData] = useState({})
    const [quantity, setQuantity] = useState(1)
    const [productImages, setProductImages] = useState([])
    const [selectedImage, setSelectedImage] = useState("")
    const [showSingleSellerModal, setSingleSellerModal] = useState(false);
    const [isVariantAvailable, setIsVariantAvailable] = useState(false)
    const [productNotAvailable, setProductNotAvailable] = useState(false)

    const ratingsCount = 10;

    useEffect(() => {
        if (city) {
            handleFetchBySlug()
        }
    }, [slug, city])

    useEffect(() => {
        handleIsVariantAvailable()
    }, [selectVariant])

    useEffect(() => {
        fetchRatings()
    }, [product])

    const handleFetchBySlug = async () => {
        setIsLoading(true)
        try {
            const res = await api.getProductById({ slug: slug, latitude: city.latitude, longitude: city.longitude, id: -1 })
            if (res.status == 1) {
                setProduct(res?.data)
                setSelectedVariant(res?.data?.variants?.[0])
                setProductImages([res?.data?.image_url, ...res?.data?.images])
                setSelectedImage(res?.data?.image_url)
            } else {
                setProductNotAvailable(true)
            }
        } catch (error) {
            console.log("error", error)
        } finally {
            setIsLoading(false)

        }
    }

    const handleIsVariantAvailable = () => {
        if (((product?.is_unlimited_stock == 0 && selectVariant?.stock <= 0) || selectVariant?.status == 0)) {
            setIsVariantAvailable(false)
        } else {
            setIsVariantAvailable(true)
        }

    }

    const fetchRatings = async () => {
        try {
            const result = await api.getProductRatings({ id: product?.id, limit: ratingsCount, offset: 0 })
            setRatingData(result?.data)
        } catch (error) {
            console.log("error", error)
        }
    }

    const currency = setting?.setting?.currency;

    const handleChangeVariant = (variant) => {
        setQuantity(1)
        setSelectedVariant(variant)
    }
    const calculateDiscount = (discountPrice, actualPrice) => {
        const difference = actualPrice - discountPrice;
        const actualDiscountPrice = (difference / actualPrice)
        return actualDiscountPrice * 100;
    }

    const handleDecreaseQuantity = () => {
        if (quantity <= 1) {
            return
        }
        else {
            setQuantity(quantity - 1)
        }
    }
    const handleIncreseQuantity = () => {
        if ((Number(product?.is_unlimited_stock) == 0) && quantity >= selectVariant?.stock) {
            toast.error(t("out_of_stock"))
        } else if (quantity >= product?.total_allowed_quantity) {
            toast.error(t("max_cart_limit_error"))
        } else {
            setQuantity(quantity + 1)
        }
    }


    const handleCalculateTotal = (products) => {
        const total = products.reduce((prev, curr) => {
            prev += curr.productPrice * curr.qty
            return prev
        }, 0)
        dispatch(setGuestCartTotal({ data: total }))
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

    const handleAddToCart = async () => {
        let productQuantity = cart?.isGuest ? getProductQuantities(cart?.guestCart) : getProductQuantities(cart?.cartProducts)
        const isExisting = cart.guestCart.find((cartProduct) => cartProduct?.product_id == product?.id && cartProduct?.product_variant_id == selectVariant?.id)
        const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.id)?.qty;
        const cartProductQty = cart.cartProducts.find(prdct => prdct?.product_id == product?.id && selectVariant?.id == prdct?.product_variant_id)
        const totalQty = productQty ? productQty + quantity : quantity
        if ((Number(product?.is_unlimited_stock) == 0) && selectVariant?.stock <= 0) {
            toast.error(t("out_of_stock_message"));
            return
        }
        if (cart?.isGuest) {
            if (totalQty > product?.total_allowed_quantity) {
                toast.error(t("max_cart_limit_error"))
            } else {
                if (isExisting) {
                    const updatedProduct = cart.guestCart?.map((cartProduct) => {
                        if (cartProduct?.product_id == product?.id && cartProduct?.product_variant_id == selectVariant?.id) {
                            return ({ ...cartProduct, qty: cartProduct.qty + quantity })
                        } else {
                            return cartProduct
                        }
                    })
                    dispatch(addtoGuestCart({ data: updatedProduct }))
                    handleCalculateTotal(updatedProduct)
                    setQuantity(1)
                    toast.success(t("product_added_successfully"))
                } else {
                    const productPrice = selectVariant.discounted_price !== 0 ? selectVariant.discounted_price : selectVariant.price
                    const productData = { product_id: product.id, product_variant_id: selectVariant?.id, qty: quantity, productPrice: productPrice };
                    dispatch(addtoGuestCart({ data: [...cart?.guestCart, productData] }))
                    let products = [...cart.guestCart, productData]
                    handleCalculateTotal(products)
                    setQuantity(1)
                    toast.success(t("product_added_successfully"))
                }
            }
        } else {
            try {
                if (totalQty > product?.total_allowed_quantity) {
                    toast.error(t("max_cart_limit_error"))
                } else {
                    const response = await api.addToCart({ product_id: product.id, product_variant_id: selectVariant.id, qty: cartProductQty ? cartProductQty.qty + quantity : quantity })
                    if (response.status == 1) {
                        if (cartProductQty) {
                            const updatedProducts = cart.cartProducts.map((cartProduct) => {
                                if (cartProduct.product_id == product.id && cartProduct.product_variant_id == selectVariant.id) {
                                    return { ...cartProduct, qty: cartProductQty ? cartProductQty.qty + quantity : quantity }
                                } else {
                                    return cartProduct
                                }
                            })
                            dispatch(setCartProducts({ data: updatedProducts }))
                        } else {
                            const productData = [...cart.cartProducts, { product_id: product.id, product_variant_id: selectVariant?.id, qty: quantity }];
                            dispatch(setCartProducts({ data: productData }))
                        }

                        dispatch(setCart({ data: response }))
                        dispatch(setCartSubTotal({ data: response.sub_total }))
                        toast.success(t("product_added_successfully"))
                    } else {
                        setSingleSellerModal(true)
                    }
                }
            } catch (error) {
                console.log("Error", error)
            }
        }
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

    const handleChangeCoverImage = (image) => {
        setSelectedImage(image)
    }

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`)
        toast.success(t("link_copied_to_clipboard"))
    }




    return (

        <section>
            {isLoading ? <div className='h-[100vh]'><Loader screen="full" /></div> : productNotAvailable == true ? <div className='h-full w-full flex flex-col items-center my-4'>
                <ImageWithPlaceholder src={ProductNotFoundImage} alt={"not product found"} />
                <p className='text-3xl font-bold w-1/3 text-center'>{t("oops")} {t("product_is_either_unavailable_or_does_not_exist")}</p>
                <Link href={"/"} className='px-4 py-2 rounded-md font-medium primaryBackColor text-white'>{t("go_back")}</Link>
            </div> : <>
                <BreadCrumb />
                <div className='container px-2 mb-6'>
                    <div className='mt-1'>
                        <div className='flex flex-col justify-center'>
                            <div className='grid  grid-cols-1 md:grid-cols-12 mt-2 gap-4 items-start  '>
                                <div className='col-span-12 md:col-span-4 '>
                                    <div className='relative aspect-square h-auto w-full'>
                                        <ImageWithPlaceholder src={selectedImage} alt={product?.name} className='h-full w-full aspect-square rounded-sm' />
                                        {selectVariant?.discounted_price !== 0 && selectVariant?.discounted_price !== selectVariant?.price ? <span className="bg-[#db3d26] rounded-[4px] text-white text-[14px] font-bold left-2 leading-[16px] px-2 py-1 absolute text-center uppercase top-2">
                                            {calculateDiscount(selectVariant?.discounted_price, selectVariant?.price).toFixed(2)}% {t("off")}
                                        </span> : null}
                                    </div>
                                    <div dir={language?.type} className={`mt-[10px] ${language?.type == "RTL" ? "flex-row-reverse" : ""}`}>
                                        <Swiper
                                            spaceBetween={10}
                                            modules={[Navigation]}
                                            className="brand-swiper"
                                            breakpoints={{
                                                1200: {
                                                    slidesPerView: 3.5,
                                                },
                                                1024: {
                                                    slidesPerView: 3,
                                                },
                                                768: {
                                                    slidesPerView: 3,
                                                },
                                                375: {
                                                    slidesPerView: 3,
                                                },
                                                0: {
                                                    slidesPerView: 2.5,
                                                },
                                            }}
                                        >
                                            {productImages?.map((image, index) => (
                                                <SwiperSlide key={product.id} >
                                                    <div className='h-auto relative w-full aspect-square' key={index} >
                                                        <ImageWithPlaceholder src={image} alt={product?.name} className='h-full w-full aspect-square rounded-sm' handleOnClick={() => handleChangeCoverImage(image)} />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>
                                <div className='col-span-12 md:col-span-8 flex flex-col gap-6'>
                                    <div className='pb-6 border-b-2 flex flex-col gap-2'>
                                        <h2 className='font-bold text-2xl break-all'>{product?.name}</h2>
                                        <div className='flex gap-4 items-center flex-wrap'>
                                            <div className='flex gap-4'>
                                                {ratingData?.average_rating > 0 ?
                                                    <div className='border-r-2 px-2'>
                                                        <div className="flex gap-1 items-center">
                                                            <div className="flex">
                                                                {[1, 2, 3, 4, 5].map((star, index) => (
                                                                    <FaStar
                                                                        key={star}
                                                                        size={15}

                                                                        className={`${star <= ratingData?.average_rating
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'fill-gray-200 text-gray-200'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            {`(${ratingData?.rating_list?.length})`}
                                                        </div>
                                                    </div>
                                                    : null}
                                            </div>
                                            {product?.seller_name !== null && <div className="px-2 py-1">
                                                <div className='flex text-xs'>
                                                    <span>{t("seller")}:<span className='font-bold'>{product?.seller_name}</span></span>
                                                </div>
                                            </div>}
                                            {product?.fssai_lic_no !== "" && (
                                                <div
                                                    className="text-gray-200 border-l-2 border-gray-200 h-6 hidden md:block"
                                                ></div>
                                            )}
                                            {product?.fssai_lic_no !== "" &&
                                                <div className='flex items-center gap-3'>
                                                    <div className='text-xs'>
                                                        {product?.fssai_lic_img && <Image width={0} height={0} src={product?.fssai_lic_img} className="w-9 h-9 object-contain" alt="fssaiImage" />}
                                                    </div>
                                                    <div className='text-xs'>{t("fssai_license_no")} {product?.fssai_lic_no}</div>
                                                </div>}
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        {selectVariant?.discounted_price !== 0 && selectVariant?.discounted_price !== selectVariant?.price ? <>
                                            <h2 className='font-bold text-3xl '>{currency}{selectVariant?.discounted_price}</h2><h3 className='line-through font-bold text-base text-gray-500'>{currency}{selectVariant?.price}</h3>
                                        </> : <> <h2 className='font-bold text-3xl '>{currency}{selectVariant?.price}</h2></>}
                                    </div>
                                    {/* <div dangerouslySetInnerHTML={{ __html: product?.description }}>
                                    </div> */}
                                    <div className='flex flex-col'>
                                        <p className='font-normal text-base'>{t("chooseVariant")}</p>
                                        <div className=' grid grid-cols-12'>
                                            {
                                                product?.variants?.map((variant) => {
                                                    const discountPrice = variant?.discounted_price
                                                    const price = variant?.price
                                                    return (
                                                        <div className={`flex flex-col md:col-span-4 lg:col-span-3 col-span-6 mx-1 my-1 text-center rounded-md  justify-center items-center cursor-pointer p-2 gap-1 ${selectVariant?.id == variant?.id ? "primaryBorder addToCartColor" : "cardBorder"}`} key={variant.id} onClick={() => handleChangeVariant(variant)}>
                                                            <p className='font-bold text-sm'>{`${variant?.measurement} ${variant?.stock_unit_name}`}</p>
                                                            <span className='flex gap-1 text-[13px] line-clamp-1 font-semibold'><p>{currency}{discountPrice != 0 && discountPrice !== price ? discountPrice : price}</p>{discountPrice != 0 && discountPrice !== price ? <p className='line-through'>{currency}{price}</p> : <></>}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className='flex gap-4 flex-col lg:flex-row '>
                                        {isVariantAvailable ?
                                            <div className='flex gap-4 items-center '>
                                                <div className='flex border-2 rounded-sm p-1 lg:py-[8px] items-center w-[120px]'>
                                                    <button className=' font-bold text-xl' onClick={handleDecreaseQuantity}><FiMinus /></button>
                                                    <input type="text" disabled value={quantity} className=' text-center font-medium text-base bg-transparent w-[70px]' />
                                                    <button className=' font-bold text-xl' onClick={handleIncreseQuantity}><FiPlus /></button>
                                                </div>
                                                <div>
                                                    <button className='primaryBackColor flex gap-2 text-white py-[6px] px-5 md:px-5 lg:py-3 rounded-sm text-base font-semibold text-nowrap' onClick={handleAddToCart}><FaShoppingBasket size={22} />{t("add_to_cart")}</button>
                                                </div>
                                            </div>
                                            : <div className='flex items-center h-[80px] md:h-[38px]  text-[#db3d26] font-extrabold '>{t("OutOfStock")}</div>}


                                        <div className='flex gap-2 items-center'>
                                            <span className='rounded-full border-2 p-2' onClick={handleProductLikes}>
                                                {favoriteProducts && favoriteProducts?.includes(product?.id) ? <BiSolidHeart size={20} /> : <BiHeart size={20} />}
                                            </span>
                                            <span> {favoriteProducts && favoriteProducts?.includes(product?.id) ?
                                                t("removeTowishlist") : t("addToWishlist")}</span>
                                        </div>
                                    </div>
                                    <div className='backgroundColor rounded-sm p-4 flex flex-col gap-4'>
                                        {product?.indicator ? product?.indicator == 1 ? <div className='flex gap-4 items-center'>
                                            <div className='h-[28px] w-[28px] relative object-cover'>
                                                <Image src={VegIcon} fill alt={product?.name} className='h-full w-full ' />
                                            </div>
                                            <p> {t("vegetarian")}</p>
                                        </div> :
                                            <div className='flex gap-4 items-center'>
                                                <div className='h-[32px] w-[32px] relative object-cover'>
                                                    <Image src={NonVegIcon} fill alt={product?.name} className='h-full w-full ' />
                                                </div>
                                                <p> {t("non-vegetarian")}</p>
                                            </div>
                                            : null
                                        }
                                        {product?.cancelable_status == 1 ?
                                            <div className='flex items-center  gap-2'>
                                                <div className='h-[32px] w-[32px] relative object-cover'>

                                                    <Image fill src={Cancelable} alt='cancelableIcon' className='h-full w-full' />
                                                </div>
                                                <span className='cancelDetail'>
                                                    {t("cancelable")}
                                                    {product?.till_status == 1 ?
                                                        <p className='font-semibold text-base'>{t("payment_pending")}</p>
                                                        :
                                                        null
                                                    }
                                                    {product?.till_status == 2 ?
                                                        <p className='font-semibold text-base'>{t("received")}</p>
                                                        :
                                                        null
                                                    }
                                                    {product?.till_status == 3 ?
                                                        <p className='font-semibold text-base'>{t("processed")}</p>
                                                        :
                                                        null
                                                    }
                                                    {product?.till_status == 4 ?
                                                        <p className='font-semibold text-base'>{t("shipped")}</p>
                                                        :
                                                        null
                                                    }
                                                    {product?.till_status == 5 ?
                                                        <p className='font-semibold text-base'>{t("out_for_delivery")}</p>
                                                        :
                                                        null
                                                    }
                                                </span>
                                            </div>
                                            :
                                            <div className='flex items-center gap-2'>
                                                <div className='h-[32px] w-[32px] relative object-cover'>
                                                    <Image src={NonCancelable} alt='cancelableIcon' className='h-full w-full' fill />
                                                </div>
                                                <span className='font-semibold text-base'>{t("non-cancelable")}</span>
                                            </div>
                                        }

                                        {product?.return_status == 1 ?
                                            <div className='flex items-center gap-2'>
                                                <div className='h-[32px] w-[32px] relative object-cover'>
                                                    <Image fill src={Returnable} alt='returnableIcon' className='h-full w-full' />
                                                </div>
                                                <span className='font-semibold text-base'>{t("returnable")} {product?.return_days} {t("days")}</span>
                                            </div>
                                            :
                                            <div className='flex items-center gap-2'>
                                                <div className='h-[32px] w-[32px] relative object-cover'>
                                                    <Image fill src={NotReturnable} alt='nonReturnableIcon' className='h-full w-full' />
                                                </div>
                                                <span className='font-semibold text-base'>{t("non-returnable")}</span>
                                            </div>
                                        }



                                    </div>
                                    <div className='flex justify-between items-center my-2 md:my-0'>
                                        <span className='text-sm font-normal'>{t("shareProduct")}:</span>
                                        <div className='flex gap-3'>
                                            <WhatsappShareButton url={`${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`}>
                                                <WhatsappIcon className='h-8 w-8 rounded-full' />
                                            </WhatsappShareButton>
                                            <TwitterShareButton url={`${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`}>
                                                <TwitterIcon className='h-8 w-8 rounded-full' />
                                            </TwitterShareButton>
                                            <FacebookShareButton url={`${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`}>
                                                <FacebookIcon className='h-8 w-8 rounded-full' />
                                            </FacebookShareButton>
                                            {/* <InstapaperShareButton>
                                            <InstapaperIcon className='h-10 w-10 rounded-full' />
                                        </InstapaperShareButton> */}
                                            <FaLink className='h-8 w-8 rounded-full bg-gray-400 p-2 hover:cursor-pointer' onClick={handleCopyToClipboard} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <ProductDescription product={product} ratingData={ratingData} />
                </div>
                <SimilarProducts slug={slug} tag_names={product?.tag_names} />
            </>}
            <SingleSellerConfirmationModal showSingleSellerModal={showSingleSellerModal} setSingleSellerModal={setSingleSellerModal} product={product} selectedVariant={selectVariant} />
        </section>
    )
}

export default ProductDetail