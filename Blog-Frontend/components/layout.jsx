import React, { Fragment } from 'react'
import Navbar from './navbar'
import Footer from './footer'

const RootLayout = ({ children }) => {
    return (
        <Fragment>
            <Navbar />
            {children}
            <Footer />
        </Fragment>
    )
}

export default RootLayout