import React, { useEffect, useState } from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import * as api from "@/api/apiRoutes";
import CategoryCard from "./CategoryCard";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setFilterCategory } from "@/redux/slices/productFilterSlice";
import { setSelectedCategories } from "@/redux/slices/productFilterSlice";
import CardSkeleton from "../skeleton/CardSkeleton";

const Category = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = router.query;
  const selectedCategories = useSelector(
    (state) => state.ProductFilter?.selectedCategories
  );
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const categoryPerPage = 12;
  const slug_id = slug == "all" ? "" : slug;
  useEffect(() => {
    fetchCategories(slug_id);
  }, []);

  const fetchCategories = async (Slug = "") => {
    setIsLoading(true);
    try {
      const result = await api.getCategories({
        limit: categoryPerPage,
        slug: Slug,
      });
      setCategories(result);
    } catch (error) {
      console.log("Error", error);
    }
    setIsLoading(false);
  };

  const handleCategoryClick = (category) => {
    // console.log(category)
    dispatch(setSelectedCategories({ data: category?.id }));
    if (category?.has_child) {
      // const activeChildSlug = category?.cat_active_childs?.[0]?.slug;
      // fetchCategories(activeChildSlug);
      router.push(`/categories/${category?.slug}`);
    } else {
      const cats = [...selectedCategories, category?.id];
      dispatch(setFilterCategory({ data: cats.join(",") }));
      router.push(`/products`);
    }
  };

  return (
    <section>
      <BreadCrumb />
      <div className="container">
        <div
          className={`grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 h-auto my-5 px-2`}
        >
          {categories &&
            categories?.data?.map((category) => {
              return (
                <div
                  key={category?.id}
                  className={"col-span-1"}
                  onClick={() => handleCategoryClick(category)}
                >
                  <CategoryCard category={category} />
                </div>
              );
            })}
          {isLoading &&
            Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="col-span-1">
                <CardSkeleton height={180} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
