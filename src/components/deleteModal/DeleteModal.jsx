import React from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { t } from "@/utils/translation";
import { useSelector } from "react-redux";
import * as api from "@/api/apiRoutes";
import { clearAllFilter } from "@/redux/slices/productFilterSlice";
import {
  logoutAuth,
  setJWTToken,
  setCurrentUser,
  setAuthType,
} from "@/redux/slices/userSlice";
import {
  setCart,
  setCartProducts,
  setCartSubTotal,
  setIsGuest,
} from "@/redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FirebaseData from "@/utils/firebase";

const DeleteModal = ({ showDelete, setShowDelete }) => {
  const { auth } = FirebaseData();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.User);
  const theme = useSelector((state) => state.Theme.theme);

  const handleHideDelete = () => {
    setShowDelete(false);
  };

  const handleDelete = async () => {
    try {
      const response = await api.deleteUser({ uid: user?.authId });
      if (response.status == 1) {
        if (user?.authType == "phone" || user?.authType == "google") {
          // const user = auth.currentUser;
          try {
            // const res = await user.delete();
            dispatch(clearAllFilter());
            dispatch(logoutAuth());
            dispatch(setJWTToken({ data: "" }));
            dispatch(setCurrentUser({ data: null }));
            dispatch(setCart({ data: [] }));
            dispatch(setCartProducts({ data: [] }));
            dispatch(setCartSubTotal({ data: 0 }));
            dispatch(setCartProducts({ data: [] }));
            dispatch(setIsGuest({ data: true }));
            router.push("/");
            setShowDelete(false);
            toast.success(response.message);
          } catch (error) {
            console.log("error", error);
          }
        } else {
          dispatch(clearAllFilter());
          dispatch(logoutAuth());
          dispatch(setJWTToken({ data: "" }));
          dispatch(setCurrentUser({ data: null }));
          dispatch(setCart({ data: [] }));
          dispatch(setCartProducts({ data: [] }));
          dispatch(setCartSubTotal({ data: 0 }));
          dispatch(setCartProducts({ data: [] }));
          dispatch(setIsGuest({ data: true }));
          router.push("/");
          setShowDelete(false);
          toast.success(response.message);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <Dialog open={showDelete}>
      <DialogOverlay
        className={`${theme == "light" ? "bg-white/80" : "bg-black/80"}`}
      />
      <DialogContent>
        <div>
          <h1 className="font-bold">{t("delete")}</h1>
          <h1 className="font-bold">{t("delete_user_message")}</h1>
          <div className="flex gap-2 mt-3">
            <button
              className="px-4 py-1 bg-red-700 text-white font-bold rounded-sm"
              onClick={handleHideDelete}
            >
              {" "}
              {t("cancel")}
            </button>
            <button
              className="px-4 py-1 bg-green-700 text-white font-bold rounded-sm"
              onClick={handleDelete}
            >
              {t("Ok")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;