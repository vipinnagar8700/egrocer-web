import MetaData from "@/components/metadata-component/MetaData";
import { extractJSONFromMarkup } from "@/utils/helperFunction";
import axios from "axios";
import dynamic from "next/dynamic";
const HomePage = dynamic(() => import("@/components/pagecomponents/Homepage"), {
  ssr: false,
});


let serverSidePropsFunction = null;

if(process.env.NEXT_PUBLIC_SEO == "true"){
 serverSidePropsFunction = async() => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SUBURL}/settings/get_seo_settings`,
      {
        params: {
          page_type: "Home",
        },
      },
    );

    let metatitle = process.env.NEXT_PUBLIC_META_TITLE;
    let metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION;
    let metaKeywords = process.env.NEXT_PUBLIC_META_KEYWORDS;
    let ogImage = "";
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
      },
    };
  } catch (error) {
    console.log("error", error);
  }
}
}

export const getServerSideProps = serverSidePropsFunction



export default function Home({
  title,
  description,
  keywords,
  ogImage,
  schemaMarkup,
}) {
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
  return (
    <>
      <MetaData
        title={title}
        description={description}
        keywords={keywords}
        pageName="/"
        structuredData={schemaMarkup}
        ogImage={ogImage}
        productUrl={pageUrl}
      />
      <HomePage />
    </>
  );
}
