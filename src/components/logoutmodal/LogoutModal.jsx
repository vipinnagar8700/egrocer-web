import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogOverlay
} from "@/components/ui/dialog"
import { t } from "@/utils/translation"
import { useSelector } from 'react-redux'
import * as api from "@/api/apiRoutes"
import { clearAllFilter } from "@/redux/slices/productFilterSlice";
import { logoutAuth, setJWTToken, setCurrentUser, setAuthType, } from "@/redux/slices/userSlice"
import { clearCartPromo, setCart, setCartProducts, setCartSubTotal, setIsGuest } from "@/redux/slices/cartSlice"
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const LogoutModal = ({ showLogout, setShowLogout }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const theme = useSelector(state => state.Theme.theme)

    const handleHideLogout = () => {
        setShowLogout(false)
    }

    const handleLogout = async () => {
        try {
            const response = await api.logout();
            if (response.status == 1) {
                dispatch(clearAllFilter())
                dispatch(logoutAuth())
                dispatch(setJWTToken({ data: "" }))
                dispatch(setCurrentUser({ data: null }))
                dispatch(setCart({ data: [] }))
                dispatch(setCartProducts({ data: [] }))
                dispatch(setCartSubTotal({ data: 0 }))
                dispatch(setCartProducts({ data: [] }))
                dispatch(clearCartPromo())
                dispatch(setIsGuest({ data: true }))
                router.push("/")
                setShowLogout(false)
                toast.success(response.message)
            } else {
                toast.error(response.message)

            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <Dialog open={showLogout} >
            <DialogOverlay className={`${theme == "light" ? "bg-white/80" : "bg-black/80"}`} />
            <DialogContent>
                <div>
                    <h1 className='font-bold'>{t("logout_title")}</h1>
                    <h1 className='font-bold'>{t("logout_message")}</h1>
                    <div className='flex gap-2 mt-3'>
                        <button className='px-4 py-1 bg-red-700 text-white font-bold rounded-sm' onClick={handleHideLogout}> {t("cancel")}</button>
                        <button className='px-4 py-1 bg-green-700 text-white font-bold rounded-sm' onClick={handleLogout}>{t("Ok")}</button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LogoutModal