import React, { useEffect } from "react";
import Layout from "../layout/Layout";
import AboutUs from "../about-us/AboutUs";
import { useSelector } from "react-redux";

const AboutUsPage = () => {

  const language = useSelector(state => state.Language.selectedLanguage)

  useEffect(() => { }, [language])

  return (
    <Layout>
      <AboutUs />
    </Layout>
  );
};

export default AboutUsPage;
