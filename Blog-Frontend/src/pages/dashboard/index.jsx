import { AppSidebar } from '@/components/ui/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { fetchLoggedUser } from '@/src/features/auth/authSlice'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const RootDashboardLayout = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchLoggedUser());
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex min-h-svh flex-1 flex-col">
                <SidebarTrigger />
                <div className="flex flex-1 flex-col">{children}</div>
            </main>
        </SidebarProvider>
    )
}

export default RootDashboardLayout