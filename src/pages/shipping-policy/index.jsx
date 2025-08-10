import MetaData from "@/components/metadata-component/MetaData";
const ShippingPolicyPage = dynamic(
  import("@/components/pagecomponents/ShippingPolicyPage"),
  { ssr: false },
);
import { extractJSONFromMarkup } from "@/utils/helperFunction";
import axios from "axios";
import dynamic from "next/dynamic";
import React from "react";


let serverSidePropsFunction = null;

if(process.env.NEXT_PUBLIC_SEO == "true"){
serverSidePropsFunction = async() => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SUBURL}/settings/get_seo_settings`,
      {
        params: {
          page_type: "Shipping policy",
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



const index = ({ title, description, keywords, ogImage, schemaMarkup,favicon }) => {
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/shipping-policy`;
  return (
    <div>
      <MetaData
        pageName="/shipping-policy"
        title={title}
        description={description}
        keywords={keywords}
        ogUrl={pageUrl}
        ogImage={ogImage}
        structuredData={schemaMarkup}
        favicon={favicon}
      />
      <ShippingPolicyPage />
    </div>
  );
};

export default index;
