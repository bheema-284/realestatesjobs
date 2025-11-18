'use client';
import "../../app/globals.css";
import React, { useEffect, useState } from "react";
import RootContext from "@/components/config/rootcontext";
import Loader from "@/components/common/loader";
import Toast from "@/components/common/toast";
import { usePathname, useRouter } from "next/navigation";
import { Inter } from 'next/font/google';
import Footer from "@/components/common/footer";
import Sidebar from "@/components/common/sidebar";
import { Navbar } from "@/components/common/navbar";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayoutClient({ children }) {
    const pathName = usePathname();
    const router = useRouter();
    const [ready, setReady] = useState(false);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [rootContext, setRootContext] = useState({
        authenticated: false,
        loader: true,
        user: {
            name: "",
            email: "",
            mobile: "",
            password: "",
            token: "",
            isAdmin: "",
            role: "" // Added role field
        },
        accessToken: '',
        remember: false,
        toast: {
            show: false,
            dismiss: true,
            type: '',
            title: '',
            message: ''
        },
        jobs: [],
        notification: false,
        tasksColumns: [],
        schedule: []
    });

    useEffect(() => {
        const user_details = typeof window !== "undefined" && JSON.parse(localStorage.getItem("user_details"));
        const updatedContext = { ...rootContext, loader: false };

        if (user_details) {
            updatedContext.authenticated = true;
            updatedContext.user = { ...updatedContext.user, ...user_details };
        } else {
            updatedContext.authenticated = false;
        }

        setRootContext(updatedContext);
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready) return;

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
    }, [ready, rootContext, pathName, router]);

    const logOut = () => {
        localStorage.clear();
        const updatedContext = {
            ...rootContext,
            authenticated: false,
            loader: true,
            user: {
                name: "",
                email: "",
                mobile: "",
                role: "",
                password: "",
                token: "",
                isAdmin: "",
            },
            accessToken: '',
            remember: false,
            toast: {
                show: false,
                dismiss: true,
                type: '',
                title: '',
                message: ''
            }
        };

        setRootContext(updatedContext);
        router.push(`/`);
    };

    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        setShowLoader(true);
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [pathName]);

    // Check if sidebar should be shown - FIXED VERSION
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
        <html lang="en" className={inter.variable}>
            <body className="w-full mx-auto">
                <RootContext.Provider value={{ rootContext, setRootContext }}>
                    {(pathName !== "/login" && pathName !== "/signup") && (
                        <Navbar rootContext={rootContext} showLoader={showLoader} logOut={logOut} />
                    )}
                    <div className={`${(pathName === "/login" || pathName === "/signup") ? "pt-0" : "pt-26 sm:pt-20"} flex`}>
                        {!ready && <Loader />}

                        {/* Sidebar for authenticated users with specific roles */}
                        {(rootContext?.user?.role === "recruiter" || rootContext?.user?.role === "company" || rootContext?.user?.role === "superadmin") &&
                            rootContext.authenticated &&
                            pathName !== "/" &&
                            pathName !== "/services" &&
                            pathName !== "/about" &&
                            pathName !== "/login" &&
                            pathName !== "/signup" && (
                                <Sidebar
                                    isMobileOpen={isMobileSidebarOpen}
                                    toggleSidebar={setMobileSidebarOpen}
                                    userRole={rootContext?.user?.role}
                                    authenticated={rootContext.authenticated} // Add this line
                                />
                            )}

                        {/* Main content */}
                        <main className={`w-full p-1 ${shouldShowSidebar() ? 'lg:ml-64' : ''}`}>
                            {children}
                        </main>
                    </div>
                    {(pathName !== "/login" && pathName !== "/signup") && <Footer />}
                    {rootContext?.toast && <Toast />}
                </RootContext.Provider>
            </body>
        </html>
    );
}