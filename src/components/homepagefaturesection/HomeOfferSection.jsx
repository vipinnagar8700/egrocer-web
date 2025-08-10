import React from "react";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { useRouter } from "next/router";
import { setFilterCategory } from "@/redux/slices/productFilterSlice";
import { useDispatch } from "react-redux";

const HomeOfferSection = ({ offer }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleOfferClick = () => {
    if (offer?.type == "product") {
      router.push(`/product/${offer.product.slug}`);
    } else if (offer?.type == "category") {
      if (offer?.category?.has_child == true) {
        router.push(`/categories/${offer?.type_slug}`);
      } else {
        dispatch(setFilterCategory({ data: offer?.category?.id.toString() }));
        router.push(`/products`);
      }
    } else if (offer?.offer_url) {
      window.open(offer?.offer_url, "_blank");
    }
  };

  return (
    <div className="py-3 px-2 relative " key={offer?.id}>
      <ImageWithPlaceholder
        src={offer?.image_url}
        alt="Offer image"
        height={0}
        width={0}
        className="object-contain max-h-[270px] h-full w-full rounded-sm"
        handleOnClick={handleOfferClick}
      />
    </div>
  );
};

export default HomeOfferSection;
