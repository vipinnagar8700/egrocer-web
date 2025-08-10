import React from 'react'
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import * as api from "@/api/apiRoutes"
import { toast } from 'react-toastify';
import { t } from '@/utils/translation';
import { useSelector, useDispatch } from 'react-redux';
import { setCartProducts, setCartSubTotal } from '@/redux/slices/cartSlice';

const ReoderConfirmModal = ({ showReoderModal, setShowReorderModal, order }) => {
    const dispatch = useDispatch();
    const theme = useSelector(state => state.Theme.theme)
    const city = useSelector(state => state.City.city)

    const handleHideReorder = () => {
        setShowReorderModal(false)
    }

    const handleReoder = async () => {
        try {
            const variantIds = order?.items?.map((prdct) => prdct?.variant_id)?.join(',');
            const quantity = order?.items?.map((prdct) => prdct?.quantity)?.join(",")
            const response = await api.addToBulkCart({ variant_ids: variantIds, quantities: quantity })
            if (response.status == 1) {
                toast.success(t("items_added_to_cart"))
                setShowReorderModal(false)
                await fetchCart();
            } else {
                toast.error(t(response?.message))
                setShowReorderModal(false)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }


    const fetchCart = async () => {
        try {
            const cartData = await api.getCart({ latitude: city?.latitude, longitude: city?.longitude })
            if (cartData.status == 1) {
                dispatch(setCartSubTotal({ data: cartData?.data?.sub_total }));
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
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <Dialog open={showReoderModal}>
            <DialogOverlay
                className={`${theme == "light" ? "bg-white/80" : "bg-black/80"}`}
            />
            <DialogContent>
                <div>
                    <h1 className="font-bold">{t("reorder")}</h1>
                    <h1 className="font-bold">{t("reOrder_warning")}</h1>
                    <div className="flex gap-2 mt-3">

                        <button
                            className="px-4 py-1 bg-red-700 text-white font-bold rounded-sm"
                            onClick={handleHideReorder}
                        >
                            {" "}
                            {t("cancel")}
                        </button>
                        <button
                            className="px-4 py-1 bg-green-700 text-white font-bold rounded-sm"
                            onClick={handleReoder}
                        >
                            {t("Ok")}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ReoderConfirmModal