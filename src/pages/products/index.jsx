import React from "react";
const ProductsPage = dynamic(
  () => import("@/components/pagecomponents/Productspage"),
  { ssr: false },
);
import MetaData from "@/components/metadata-component/MetaData";
import axios from "axios";
import { extractJSONFromMarkup } from "@/utils/helperFunction";
import dynamic from "next/dynamic";



let serverSidePropsFunction = null;

if(process.env.NEXT_PUBLIC_SEO == "true"){
serverSidePropsFunction = async() =>  {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SUBURL}/settings/get_seo_settings`,
      {
        params: {
          page_type: "Product listing page",
        },
      },
    );
    let metatitle = process.env.NEXT_PUBLIC_META_TITLE;
    let metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION;
    let metaKeywords = process.env.NEXT_PUBLIC_META_KEYWORDS;
    let ogImage = "";
    let schemaMarkup = null;
    let favicon = null;
    if (
      process.env.NEXT_PUBLIC_SEO == "true" &&
      response.data.data?.length > 0
    ) {
      const seoData = response.data.data;

      metatitle = seoData[0].meta_title;
      metaDescription = seoData[0].meta_description;
      metaKeywords = seoData[0].meta_keyword;
      ogImage = seoData[0].og_image_url;
      favicon = seoData[0].favicon;
      if (seoData[0].schema_markup) {
        schemaMarkup = extractJSONFromMarkup(seoData[0].schema_markup);
      }
    }
    return {
      props: {
        title: metatitle,
        description: metaDescription,
        keywords: metaKeywords,
        schemaMarkup: schemaMarkup ? JSON.stringify(schemaMarkup) : null,
        ogImage: ogImage,
        favicon: favicon ? favicon : null,
      },
    };
  } catch (error) {
    console.log("error", error);
  }
}
}

export const getServerSideProps = serverSidePropsFunction



const Products = ({ title, description, keywords, schemaMarkup, ogImage,favicon }) => {
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/products`;

  return (
    <>
      <MetaData
        pageName="/products"
        title={title}
        description={description}
        keywords={keywords}
        structuredData={schemaMarkup}
        ogImage={ogImage}
        ogUrl={pageUrl}
        favicon={favicon}
      />
      <ProductsPage />
    </>
  );
};

export default Products;
