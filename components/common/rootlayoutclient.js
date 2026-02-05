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
    const [hasError, setHasError] = useState(false); // Track if error occurred
    const [hideFooter, setHideFooter] = useState(false); // Track if footer should be hidden

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

    // Monitor rootContext for loader states
    useEffect(() => {
        // Hide footer when loader is showing
        if (rootContext.loader) {
            setHideFooter(true);
        } else {
            setHideFooter(false);
        }
    }, [rootContext.loader]);

    // Monitor specific pages that should hide footer
    useEffect(() => {
        // Check if current page is company detail page without data
        const isCompanyDetailPage = pathName.startsWith('/companies/') && pathName.split('/').length > 2;

        // You can add more conditions here for other pages that should hide footer
        // For example, if you have a flag in context that indicates "no data"
        const shouldHideFooter =
            rootContext.loader || // Hide during loader
            (isCompanyDetailPage && rootContext.hideFooterOnNoData); // Hide on company detail with no data

        setHideFooter(shouldHideFooter);

    }, [pathName, rootContext.loader, rootContext.hideFooterOnNoData]);

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
                setHasError(true); // Set error state
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

    // Check if footer should be shown
    const shouldShowFooter = () => {
        // Don't show footer if there's an error
        if (hasError) return false;

        // Don't show footer when hideFooter flag is true
        if (hideFooter) return false;

        // Don't show footer on login/signup pages
        if (pathName === "/login" || pathName === "/signup") return false;

        return true;
    };

    // Check if navbar should be shown
    const shouldShowNavbar = () => {
        // Don't show navbar if there's an error on login/signup pages
        if (hasError && (pathName === "/login" || pathName === "/signup")) return false;

        // Don't show navbar on login/signup pages (normal case)
        if (pathName === "/login" || pathName === "/signup") return false;

        return true;
    };

    // If there's an error, show error message
    if (hasError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                    <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-100 text-red-500">
                        <svg
                            className="w-12 h-12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-3">Something went wrong</h1>
                    <p className="text-gray-600 mb-6">
                        We encountered an error while loading the application. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Refresh Page
                    </button>
                    <p className="text-sm text-gray-500 mt-4">
                        If the problem persists, please contact support.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {shouldShowNavbar() && (
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
                <main className={`w-full ${hideFooter ? 'min-h-screen' : ''}`}>
                    {children}
                </main>
            </div>
            {shouldShowFooter() && <Footer />}
            {rootContext?.toast && <Toast />}
        </>
    );
}

// Main layout component
export default function RootLayoutClient({ children }) {
    const [hasGlobalError, setHasGlobalError] = useState(false);

    // Global error boundary for layout
    useEffect(() => {
        const handleGlobalError = (error) => {
            console.error("Global error caught:", error);
            setHasGlobalError(true);
        };

        window.addEventListener('error', handleGlobalError);

        return () => {
            window.removeEventListener('error', handleGlobalError);
        };
    }, []);

    // If there's a global error, show minimal error layout
    if (hasGlobalError) {
        return (
            <html lang="en" className={inter.variable}>
                <body className="w-full mx-auto min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center p-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Application Error
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Sorry, something went wrong with the application.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Reload Application
                        </button>
                    </div>
                </body>
            </html>
        );
    }

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