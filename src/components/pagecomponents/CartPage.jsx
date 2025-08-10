import React, { useEffect } from 'react'
import Layout from '../layout/Layout'
import Cart from '../cart/Cart'
import { useSelector } from 'react-redux'

const CartPage = () => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language])
    return (
        <Layout><Cart /></Layout>
    )
}

export default CartPage