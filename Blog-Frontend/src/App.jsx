import React, { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Login, Register, ForgotPassword, ResetPassword, HomePage, RootDashboardLayout, CreateBlogPage, RootBlogPage, UpdateBlogPage, ViewBlogPage, AboutPage, ContactPage, PrivacyPage, TermsPage, FAQPage, AccountPage, ChangePasswordPage, DashboardHome, AuthorProfilePage } from './pages'
import RootLayout from '../components/layout'
import { Toaster } from "@/components/ui/sonner"
import ScrollToTop from "@/components/ScrollToTop";
import LoginDialog from "@/components/dialogs/LoginDialog";
import PrivateRoute from '@/components/PrivateRoute'



const App = () => {
    return (
        <Fragment>

            <Toaster richColors position="top-center" />

            <ScrollToTop />

            {/* Global Dialog */}
            <LoginDialog />

            <Routes>

                <Route path='/auth/login' element={
                    <RootLayout>
                        <Login />
                    </RootLayout>
                } />
                <Route path='/auth/register' element={
                    <RootLayout>
                        <Register />
                    </RootLayout>
                } />
                <Route path='/auth/forgot-password' element={
                    <RootLayout>
                        <ForgotPassword />
                    </RootLayout>
                } />
                <Route path='/auth/reset-password' element={
                    <RootLayout>
                        <ResetPassword />
                    </RootLayout>
                } />

                {/* /** Home Routes */}
                <Route path='/' element={
                    <RootLayout>
                        <HomePage />
                    </RootLayout>
                } />

                {/* /** Dashboard Routes */}
                <Route path='/dashboard' element={
                    <PrivateRoute>
                        <RootDashboardLayout>
                            <DashboardHome />
                        </RootDashboardLayout>
                    </PrivateRoute>
                } />
                <Route path='/dashboard/account' element={
                    <PrivateRoute>
                        <RootDashboardLayout>
                            <AccountPage />
                        </RootDashboardLayout>
                    </PrivateRoute>
                } />
                <Route path='/dashboard/account/change-password' element={
                    <PrivateRoute>
                        <RootDashboardLayout>
                            <ChangePasswordPage />
                        </RootDashboardLayout>
                    </PrivateRoute>
                } />


                {/* /** Blog Routes */}
                <Route path='/blogs' element={
                    <RootLayout>
                        <RootBlogPage isHomePage={true} />
                    </RootLayout>
                } />
                <Route path='/blog/:slug' element={
                    <RootLayout>
                        <ViewBlogPage isPublicPage={true} />
                    </RootLayout>
                } />
                <Route path='/user/:username' element={
                    <RootLayout>
                        <AuthorProfilePage />
                    </RootLayout>
                } />

                {/* /** Static / info pages */}
                <Route path='/about' element={
                    <RootLayout>
                        <AboutPage />
                    </RootLayout>
                } />
                <Route path='/contact' element={
                    <RootLayout>
                        <ContactPage />
                    </RootLayout>
                } />
                <Route path='/privacy' element={
                    <RootLayout>
                        <PrivacyPage />
                    </RootLayout>
                } />
                <Route path='/terms' element={
                    <RootLayout>
                        <TermsPage />
                    </RootLayout>
                } />
                <Route path='/faq' element={
                    <RootLayout>
                        <FAQPage />
                    </RootLayout>
                } />

                <Route path='/dashboard/blogs' element={
                    <PrivateRoute>
                        <RootDashboardLayout>
                            <RootBlogPage />
                        </RootDashboardLayout>
                    </PrivateRoute>
                } />
                <Route path='/dashboard/blog/:slug' element={
                    <PrivateRoute>
                        <RootDashboardLayout>
                            <ViewBlogPage />
                        </RootDashboardLayout>
                    </PrivateRoute>
                } />
                <Route path='/dashboard/blog/create' element={
                    <PrivateRoute>
                        <RootDashboardLayout>
                            <CreateBlogPage />
                        </RootDashboardLayout>
                    </PrivateRoute>
                } />
                <Route path='/dashboard/blog/update/:Id' element={
                    <PrivateRoute>
                        <RootDashboardLayout>
                            <UpdateBlogPage />
                        </RootDashboardLayout>
                    </PrivateRoute>
                } />
                <Route path='/dashboard/blog/delete/:Id' element={
                    <PrivateRoute>
                        <RootDashboardLayout>
                            <div>Delete Blog Page</div>
                        </RootDashboardLayout>
                    </PrivateRoute>
                } />

                {/* 404 Route */}
                <Route
                    path="*"
                    element={
                        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
                            <h1 className="text-7xl font-bold text-gray-800">404</h1>
                            <p className="mt-3 text-xl font-medium text-gray-600">
                                Page Not Found
                            </p>
                            <p className="mt-2 text-gray-500">
                                The page you are looking for doesn't exist.
                            </p>
                        </div>
                    }
                />

            </Routes >
        </Fragment>
    )
}

export default App