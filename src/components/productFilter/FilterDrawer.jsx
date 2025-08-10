import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Filter from './ProductFilter';
import { t } from '@/utils/translation';
import { IoIosCloseCircle } from 'react-icons/io';
import { useSelector } from 'react-redux';

const FilterDrawer = ({ showFilter, setShowFilter, setProductResult, setOffset, minPrice, maxPrice, values, setValues, setMinPrice, setMaxPrice }) => {

  const language = useSelector(state => state.Language.selectedLanguage)

  return (
    <Sheet open={showFilter}>
      <SheetContent className="p-2 w-full sm:w-[900px] overflow-y-auto" side={language?.type == "RTL" ? "left" : "right"}>
        <SheetHeader className="px-0 py-3  flex justify-between text-left ">
          <SheetTitle className="text-2xl font-bold flex flex-row items-center p-0 justify-between">
            <p className='text-2xl font-bold'>{t("filter")}</p>
            <div>
              <IoIosCloseCircle size={32} onClick={() => setShowFilter(false)} />
            </div>
          </SheetTitle>
        </SheetHeader>
        <div>
          <Filter setProductResult={setProductResult} setOffset={setOffset} minPrice={minPrice} maxPrice={maxPrice} values={values} setValues={setValues} setMaxPrice={setMaxPrice} setMinPrice={setMinPrice} setShowFilter=
            {setShowFilter} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default FilterDrawer