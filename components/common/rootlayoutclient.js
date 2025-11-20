'use client';
import "../../app/globals.css";
import React, { useEffect, useState, useContext } from "react";
import RootContext, { RootContextProvider } from "@/components/config/rootcontext";
import Loader from "@/components/common/loader";
import Toast from "@/components/common/toast";
import { usePathname, useRouter } from "next/navigation";
import { Inter } from 'next/font/google';
import Footer from "@/components/common/footer";
import Sidebar from "@/components/common/sidebar";
import { Navbar } from "@/components/common/navbar";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// Inner component that uses the context
function LayoutContent({ children }) {
    const pathName = usePathname();
    const router = useRouter();
    const [showLoader, setShowLoader] = useState(true);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const {
        rootContext,
        logOut,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        removeNotification,
        clearAllNotifications,
        toggleNotificationDropdown,
        setNotificationsLoading,
        setNotificationsError,
        updateNotifications,
        refreshUserData
    } = useContext(RootContext);

    useEffect(() => {
        if (!rootContext.loader) {
            const role = rootContext?.user?.role;
            const authenticated = rootContext?.authenticated;

            const publicRoutes = [
                "/",
                "/about",
                "/companies",
                "/jobs",
                "/login",
                "/signup"
            ];

            // Define role-based allowed routes
            const getAllowedRoutes = (userRole) => {
                const baseRoutes = [
                    "/",
                    "/about",
                    "/services",
                    "/details"
                ];

                const roleSpecificRoutes = {
                    applicant: [
                        "/jobs",
                        "/companies",
                        `/details/${rootContext?.user?.id || 1}/${rootContext?.user?.name || ""}`,
                        "/projects"
                    ],
                    recruiter: [
                        "/dashboard",
                        "/applications",
                        "/candidates",
                        "/tasks",
                        "/calendar",
                        "/analytics",
                        "/settings",
                        "/projects"
                    ],
                    company: [
                        "/dashboard",
                        "/applications",
                        "/candidates",
                        "/tasks",
                        "/calendar",
                        "/analytics",
                        "/settings",
                        "/projects",
                        "/recruiters"
                    ],
                    superadmin: [
                        "/dashboard",
                        "/applications",
                        "/candidates",
                        "/tasks",
                        "/calendar",
                        "/analytics",
                        "/settings",
                        "/projects",
                        "/recruiters",
                        "/admin"
                    ]
                };

                return [...baseRoutes, ...(roleSpecificRoutes[userRole] || [])];
            };

            // Redirect logic
            if (authenticated) {
                const allowedRoutes = getAllowedRoutes(role);
                const isAllowed = allowedRoutes.some(route => pathName.startsWith(route));

                if (!isAllowed) {
                    // Redirect to appropriate default page based on role
                    const defaultRoutes = {
                        applicant: "/",
                        recruiter: "/dashboard",
                        company: "/dashboard",
                        superadmin: "/dashboard"
                    };
                    router.push(defaultRoutes[role] || "/");
                }
            } else {
                // If not authenticated and trying to access protected route, redirect to login
                const isPublicRoute = publicRoutes.some(route => pathName === route || pathName.startsWith(route));
                if (!isPublicRoute) {
                    router.push("/login");
                }
            }
        }
    }, [rootContext, pathName, router]);

    useEffect(() => {
        setShowLoader(true);
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [pathName]);

    // Check if sidebar should be shown
    const shouldShowSidebar = () => {
        if (!rootContext.authenticated) {
            return false;
        }

        const role = rootContext?.user?.role;

        // Roles that should see sidebar
        const sidebarRoles = ["recruiter", "company", "superadmin"];

        if (!sidebarRoles.includes(role)) {
            return false;
        }

        // Don't show sidebar on these pages
        const noSidebarRoutes = [
            "/",
            "/services",
            "/about",
            "/login",
            "/signup",
            "/jobs",
            "/companies"
        ];

        const shouldShow = !noSidebarRoutes.some(route =>
            pathName === route || pathName.startsWith(route)
        );
        return shouldShow;
    };

    return (
        <>
            {(pathName !== "/login" && pathName !== "/signup") && (
                <Navbar
                    rootContext={rootContext}
                    showLoader={showLoader}
                    logOut={logOut}
                    // Pass all notification functions to Navbar
                    markNotificationAsRead={markNotificationAsRead}
                    markAllNotificationsAsRead={markAllNotificationsAsRead}
                    removeNotification={removeNotification}
                    clearAllNotifications={clearAllNotifications}
                    toggleNotificationDropdown={toggleNotificationDropdown}
                    setNotificationsLoading={setNotificationsLoading}
                    setNotificationsError={setNotificationsError}
                    updateNotifications={updateNotifications}
                    refreshUserData={refreshUserData}
                />
            )}
            <div className={`${(pathName === "/login" || pathName === "/signup") ? "pt-0" : "pt-26 sm:pt-20"} flex`}>
                {rootContext.loader && <Loader />}

                {/* Sidebar */}
                {shouldShowSidebar() && (
                    <Sidebar
                        isMobileOpen={isMobileSidebarOpen}
                        toggleSidebar={setMobileSidebarOpen}
                        userRole={rootContext?.user?.role}
                        authenticated={rootContext.authenticated}
                    />
                )}

                {/* Main content */}
                <main className={`w-full ${shouldShowSidebar() ? 'lg:ml-64' : ''}`}>
                    {children}
                </main>
            </div>
            {(pathName !== "/login" && pathName !== "/signup") && <Footer />}
            {rootContext?.toast && <Toast />}
        </>
    );
}

// Main layout component
export default function RootLayoutClient({ children }) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="w-full mx-auto">
                <RootContextProvider>
                    <LayoutContent children={children} />
                </RootContextProvider>
            </body>
        </html>
    );
}