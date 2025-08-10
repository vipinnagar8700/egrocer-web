import React from 'react'
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { useSelector, useDispatch } from 'react-redux';
import { t } from '@/utils/translation';
import * as api from "@/api/apiRoutes"
import { setCart, setCartProducts, setCartSubTotal } from '@/redux/slices/cartSlice';

const SingleSellerConfirmationModal = ({ showSingleSellerModal, setSingleSellerModal, product, selectedVariant }) => {
    const dispatch = useDispatch();
    const theme = useSelector(state => state.Theme.theme)
    const cart = useSelector(state => state.Cart)

    const handleHideSingleSeller = () => {
        setSingleSellerModal(false)
    }



    const handleAddToCart = async () => {
        try {
            // await handleDeleteCart()
            const res = await api.deleteCart();
            if (res.status == 1) {
                dispatch(setCart({ data: [] }));
                dispatch(setCartSubTotal({ data: 0 }));
                dispatch(setCartProducts({ data: [] }));
                const response = await api.addToCart({ product_id: product?.id, product_variant_id: selectedVariant?.id, qty: 1 })
                if (response.status === 1) {
                    if (cart?.cartProducts?.find((prdct) => ((prdct?.product_id == product?.id) && (prdct?.product_variant_id == selectedVariant?.id)))?.qty == undefined) {
                        dispatch(setCart({ data: response }));
                        const cartProduct = {
                            product_id: product?.id,
                            product_variant_id: selectedVariant?.id,
                            qty: 1
                        }
                        dispatch(setCartProducts({
                            data: [cartProduct]
                        }));
                        dispatch(setCartSubTotal({ data: response?.sub_total }));
                    }
                    setSingleSellerModal(false)
                }
            }

        } catch (error) {
            console.log("Error", error)
        }
    }


    return (
        <Dialog open={showSingleSellerModal}>
            <DialogOverlay
                className={`${theme == "light" ? "bg-white/80" : "bg-black/80"}`}
            />
            <DialogContent>
                <div className=''>
                    <div className='flex flex-col gap-2 font-bold'><span>{t("single_seller_warning")}</span><span>{t("clear_cart_warning")}</span></div>
                    <div className='flex gap-2 mt-2'>


                        <button
                            className="px-4 py-1 bg-red-700 text-white font-bold rounded-sm"
                            onClick={handleHideSingleSeller}
                        >
                            {" "}
                            {t("cancel")}
                        </button>
                        <button
                            className="px-4 py-1 bg-green-700 text-white font-bold rounded-sm"
                            onClick={handleAddToCart}
                        >
                            {t("Ok")}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SingleSellerConfirmationModal