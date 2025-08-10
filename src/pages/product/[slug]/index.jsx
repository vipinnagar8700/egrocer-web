import React from "react";
// const SocialPages = dynamic(() => import('@/components/commonComponents/SocialPages'), { ssr: false })
import dynamic from "next/dynamic";
const ProductDescriptionPage = dynamic(
  () => import("@/components/pagecomponents/ProductDescriptionPage"),
  { ssr: false },
);
import MetaData from "@/components/metadata-component/MetaData";
import axios from "axios";
import { extractJSONFromMarkup } from "@/utils/helperFunction";


let serverSidePropsFunction = null;

if(process.env.NEXT_PUBLIC_SEO == "true"){
  serverSidePropsFunction = async(context) => {
  const { slug } = context.params;
  let isMetadata = false;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SUBURL}/products/get_seo_things`,
      {
        params: {
          slug: slug,
        },
      },
    );

    if (
      response.data.data?.meta_title != null &&
      response.data.data?.meta_description != null &&
      response.data.data?.meta_keywords != null
    ) {
      isMetadata = true;
    }
    let metatitle = process.env.NEXT_PUBLIC_META_TITLE;
    let metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION;
    let metaKeywords = process.env.NEXT_PUBLIC_META_KEYWORDS;
    let schemaMarkup = null;
    let og_image = null;
    let favicon = null;
    if (process.env.NEXT_PUBLIC_SEO == "true" && isMetadata == true) {
      const seoData = response.data.data;
      metatitle = seoData.meta_title;
      metaDescription = seoData.meta_description;
      metaKeywords = seoData.meta_keywords;
      og_image = seoData.og_image;
      favicon = seoData.favicon;
      if (seoData.schema_markup) {
        schemaMarkup = extractJSONFromMarkup(seoData.schema_markup);
      }
    }
    return {
      props: {
        slug: slug,
        title: metatitle,
        description: metaDescription,
        keywords: metaKeywords,
        og_image,
        schemaMarkup: schemaMarkup ? JSON.stringify(schemaMarkup) : null,
        favicon: favicon ? favicon : null,
      },
    };
  } catch (error) {
    console.log("error", error);
  }
}
}

export const getServerSideProps = serverSidePropsFunction

 

export default function Index({
  slug,
  title,
  description,
  keywords,
  og_image,
  schemaMarkup,
  favicon
}) {
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/product/${slug}`;
  return (
    <>
      <MetaData
        pageName="/product/"
        title={title}
        description={description}
        keywords={keywords}
        structuredData={schemaMarkup}
        ogUrl={pageUrl}
        ogImage={og_image}
        favicon={favicon}
      />
      <ProductDescriptionPage />
    </>
  );
}
