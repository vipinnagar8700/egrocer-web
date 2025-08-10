import React, { useEffect } from 'react'
import Category from '../categories/Category'
import Layout from "../layout/Layout"
import { useSelector } from 'react-redux'

const CategoriesPages = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout>

            <Category />
        </Layout>
    )
}

export default CategoriesPages