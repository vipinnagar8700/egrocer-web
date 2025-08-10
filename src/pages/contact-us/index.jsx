import MetaData from "@/components/metadata-component/MetaData";
import { extractJSONFromMarkup } from "@/utils/helperFunction";
import axios from "axios";
import dynamic from "next/dynamic";
const ContactUsPage = dynamic(
  () => import("@/components/pagecomponents/ContactUsPage"),
  { ssr: false },
);
import React from "react";

let serverSidePropsFunction = null;

if(process.env.NEXT_PUBLIC_SEO == "true"){
 serverSidePropsFunction = async() => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SUBURL}/settings/get_seo_settings`,
      {
        params: {
          page_type: "Contact us",
        },
      },
    );
    let metatitle = process.env.NEXT_PUBLIC_META_TITLE;
    let metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION;
    let metaKeywords = process.env.NEXT_PUBLIC_META_KEYWORDS;
    let ogImage = "";
    let favicon = null;
    let schemaMarkup = null;
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
        structuredData: schemaMarkup,
        ogImage: ogImage,
        favicon: favicon ? favicon : null,
      },
    };
  } catch (error) {
    console.log("error", error);
  }
}
}

export const getServerSideProps = serverSidePropsFunction;



const index = ({ title, description, keywords, schemaMarkup, ogImage,favicon }) => {
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/contact-us`;

  return (
    <div>
      <MetaData
        title={title}
        description={description}
        keywords={keywords}
        structuredData={schemaMarkup}
        ogImage={ogImage}
        pageName="/contact-us"
        ogUrl={pageUrl}
        favicon={favicon}
      />
      <ContactUsPage />
    </div>
  );
};

export default index;
