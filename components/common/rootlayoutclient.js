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
        setRootContext, // Add this to update context
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

    // Load user from storage on component mount
    useEffect(() => {
        const loadUserFromStorage = () => {
            try {
                // Check localStorage first, then sessionStorage
                let userData = localStorage.getItem("user_details");

                if (!userData) {
                    userData = sessionStorage.getItem("user_details");
                }

                if (userData) {
                    const parsedUser = JSON.parse(userData);

                    // Check if we have auth token
                    const authToken = localStorage.getItem("auth_token");

                    if (parsedUser && authToken) {
                        // Update context with user data
                        setRootContext(prev => ({
                            ...prev,
                            authenticated: true,
                            user: parsedUser,
                            loader: false
                        }));

                        console.log("User loaded from storage:", parsedUser);
                    }
                }
            } catch (error) {
                console.error("Error loading user from storage:", error);
                // Clear invalid data
                localStorage.removeItem("user_details");
                sessionStorage.removeItem("user_details");
                localStorage.removeItem("auth_token");
            }
        };

        // Only load if not already authenticated
        if (!rootContext.authenticated) {
            loadUserFromStorage();
        }

        // Hide loader after some time
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [rootContext.authenticated, setRootContext]);

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

    // Check if sidebar should be shown
    const shouldShowSidebar = () => {
        const role = rootContext?.user?.role;
        const isAuth = rootContext?.authenticated;

        if (!isAuth) return false;

        const allowedRoles = ["recruiter", "company", "superadmin"];

        if (!allowedRoles.includes(role)) return false;

        const noSidebarRoutes = [
            "/login",
            "/signup",
            "/",
            "/about",
            "/services",
            "/jobs",
            "/companies"
        ];

        return !noSidebarRoutes.includes(pathName);
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
                <main className={`w-full`}>
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
                    <LayoutContent>{children}</LayoutContent>
                </RootContextProvider>
            </body>
        </html>
    );
}