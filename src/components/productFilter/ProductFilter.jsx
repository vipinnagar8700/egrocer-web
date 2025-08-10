import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilterCategory, clearAllFilter, setFilterBrands, setFilterMinMaxPrice } from "@/redux/slices/productFilterSlice";
import * as api from "@/api/apiRoutes";
import { t } from "@/utils/translation";
import CategoryTree from "./CategoryTree";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FaChevronDown } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from "next/dynamic";
// import { resetSelectedCategories } from "@/redux/slices/productFilterSlice";
const PriceSlider = dynamic(() => import("./PriceSlider"), { ssr: false });
import FilterSkeleton from "./FilterSkeleton";

const Filter = ({ setProductResult, setOffset, minPrice, maxPrice, values, setValues, setMinPrice, setMaxPrice, setShowFilter }) => {
    const filter = useSelector(state => state.ProductFilter)
    const setting = useSelector(state => state?.Setting?.setting)
    const city = useSelector(state => state.City)
    const dispatch = useDispatch();
    const [categories, setCategories] = useState(null)
    const [treeData, setTreeData] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([])
    const [brands, setbrands] = useState(null)
    const [totalBrands, setTotalBrands] = useState()
    const [brandOffset, setBrandOffset] = useState(0);
    const [tempMinPrice, setTempMinPrice] = useState(null)
    const [tempMaxPrice, setTempMaxPrice] = useState(null)
    const [activeKey, setActiveKey] = useState(["1", "2", "3"]);
    const brandLimit = 10;
    const [loading, setLoading] = useState(false)




    useEffect(() => {
        if (brands == null) {
            fetchBrands(0)
        }
        if (categories == null) {
            fetchCategories()
        }
    }, [])

    const handleActiveKey = (key) => {
        setActiveKey((prevActiveKeys) =>
            prevActiveKeys.includes(key)
                ? prevActiveKeys.filter((item) => item !== key)
                : [...prevActiveKeys, key]
        );
    };


    const fetchCategories = async () => {
        setLoading(true)
        try {
            const categories = await api.getCategories()
            setCategories(categories.data)
        } catch (error) {
            console.log("erorr", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCategoryChange = (categories) => {
        setSelectedCategories(categories);
        setProductResult([]); // Reset products
        setOffset(0); // Reset offset
        dispatch(setFilterCategory({ data: categories.join(",") }));
    };


    const fetchBrands = async (bOffset) => {
        setLoading(true)
        try {
            const result = await api.getBrands({ limit: brandLimit, offset: bOffset, latitude: city?.city?.latitude, longitude: city?.city?.longitude });
            if (result.status === 1) {
                if (brands == null) {
                    setbrands(result?.data)
                } else {
                    setbrands(prevBrands => [...prevBrands, ...result?.data]);
                }
                setTotalBrands(result?.total)
            }
        } catch (error) {
            console.log("Error", error)
        } finally {
            setLoading(false)
        }
    };

    const filterbyBrands = (brand) => {
        var brand_ids = [...filter.brand_ids];
        if (brand_ids.includes(brand.id)) {
            brand_ids.splice(brand_ids.indexOf(brand.id), 1);
        }
        else {
            brand_ids.push(parseInt(brand.id));
        }
        const sorted_brand_ids = sort_unique_brand_ids(brand_ids);
        dispatch(setFilterBrands({ data: sorted_brand_ids }));
    };

    const sort_unique_brand_ids = (int_brand_ids) => {
        if (int_brand_ids.length === 0) return int_brand_ids;
        int_brand_ids = int_brand_ids.sort(function (a, b) { return a * 1 - b * 1; });
        var ret = [int_brand_ids[0]];
        for (var i = 1; i < int_brand_ids.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
            if (int_brand_ids[i - 1] !== int_brand_ids[i]) {
                ret.push(int_brand_ids[i]);
            }
        }
        return ret;
    };

    const loadMoreBrands = () => {
        setBrandOffset(prevOffset => prevOffset + brandLimit);
        fetchBrands(brandOffset + brandLimit) // Increase offset to fetch next set of brands
    };




    return (
        <>
            {loading ? <FilterSkeleton /> :
                <div className="md:cardBorder rounded-md headerBackgroundColor ">
                    <div className='p-3 md:p-4 bottomBorder '>
                        <div className='flex justify-between items-center  '>
                            <h5 className="text-xl font-bold">{t("filters")}</h5>
                            <p className='m-0 text-sm font-normal text-[#DB3D26] cursor-pointer'
                                onClick={() => {
                                    setSelectedCategories([]);
                                    setMinPrice(null);
                                    setMaxPrice(null);
                                    dispatch(clearAllFilter());
                                    // dispatch(resetSelectedCategories())
                                    setOffset(0)
                                    setProductResult([])
                                }}
                            >
                                {t("clearAll")}
                            </p>
                        </div>
                    </div>
                    <Collapsible open={activeKey.includes("1")} className="w-full bottomBorder" onOpenChange={() => handleActiveKey("1")}>
                        <CollapsibleTrigger className="w-full p-4 flex justify-between items-center">
                            <div className="text-start font-medium textColor md:text-base">{t("product_category")}</div>
                            <div className={`transition-transform duration-250 ${activeKey.includes("1") ? "rotate-0" : "-rotate-90"}`}>
                                <FaChevronDown />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className='filter-row'>
                                <CategoryTree
                                    categories={categories}
                                    selectedCategories={selectedCategories}
                                    onCategoryChange={handleCategoryChange}
                                    initialFilter={filter}
                                />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                    {brands && brands?.length > 0 &&
                        <Collapsible open={activeKey.includes("2")} className="w-full bottomBorder" onOpenChange={() => handleActiveKey("2")}>
                            <CollapsibleTrigger className="w-full p-4 flex justify-between items-center">
                                <div className="text-base font-medium textColor">{t("brands")}</div>
                                <div className={`transition-transform duration-250 ${activeKey.includes("2") ? "rotate-0" : "-rotate-90"}`}>
                                    <FaChevronDown />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className='filter-row px-2 pb-4 md:px-2 lg:px-4'>
                                    {brands?.map((brand, index) => {
                                        const isChecked = filter.brand_ids.includes(brand.id);
                                        return (
                                            <div key={brand.id} className="flex items-center ml-1 my-2 md:ml-1.5 lg:ml-2 gap-2">
                                                <Checkbox
                                                    className="data-[state=checked]:primaryBackColor shadow-sm border-gray-300 border-[1.5px]"
                                                    checked={isChecked}
                                                    onCheckedChange={() => {
                                                        setProductResult([])
                                                        filterbyBrands(brand)
                                                    }}
                                                />
                                                <span className="text-sm font-normal textColor">{brand.name}</span>
                                            </div>
                                        );
                                    })
                                    }
                                    {brands?.length < totalBrands ? <a className='brand-view-more textColor' onClick={loadMoreBrands}>{t("showMore")}</a> : <></>}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    }

                    <Collapsible open={activeKey.includes("3")} className="w-full bottomBorder" onOpenChange={() => handleActiveKey("3")}>
                        <CollapsibleTrigger className="w-full p-4 flex justify-between items-center">
                            <div className="text-base font-medium textColor">{t("priceRange")}</div>
                            <div className={`transition-transform duration-250 ${activeKey.includes("3") ? "rotate-0" : "-rotate-90"}`}>
                                <FaChevronDown />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className='px-2 pb-4 md:px-2 lg:px-4'>
                            <div className="flex flex-col gap-4">
                                <PriceSlider
                                    minPrice={minPrice}
                                    maxPrice={maxPrice}
                                    setValues={setValues}
                                    setTempMaxPrice={setTempMaxPrice}
                                    setTempMinPrice={setTempMinPrice}
                                    values={values}
                                />
                                <div className='range-prices flex justify-between'>
                                    <p>{setting?.currency}{values[0]}</p>
                                    <p>{setting?.currency}{values[1]}</p>

                                </div>
                                <button className="rounded py-2 px-4 buttonBackground text-xl"
                                    onClick={(newValues) => {
                                        setOffset(0)
                                        setProductResult([])
                                        dispatch(setFilterMinMaxPrice({ data: { min_price: tempMinPrice, max_price: tempMaxPrice } }))
                                    }}>
                                    {t("apply")}
                                </button>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            }
        </>
    );
};

export default Filter;