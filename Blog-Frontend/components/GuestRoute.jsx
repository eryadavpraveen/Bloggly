import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const GuestRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default GuestRoute;