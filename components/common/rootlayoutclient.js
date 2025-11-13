'use client';
import "../../app/globals.css";
import React, { useEffect, useRef, useState } from "react";
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
        jobs: [
            // ... your existing jobs data
            {
                "id": "job-1753249533581-t8lcig7",
                "jobTitle": "Real Estate Sales",
                "jobDescription": "Sell properties in a fast-paced real estate market.",
                "employmentTypes": ["full-time"],
                "workingSchedule": {
                    "dayShift": true,
                    "nightShift": false,
                    "weekendAvailability": true,
                    "custom": "Flexible weekends"
                },
                "salaryType": "hourly",
                "salaryAmount": "80,000 + Commission",
                "salaryFrequency": "Weekly",
                "hiringMultiple": true,
                "location": "Bangalore",
                "postedOn": "2025-07-23"
            },
            // ... rest of your jobs data
        ],
        notification: false,
        tasksColumns: [
            // ... your existing tasksColumns data
        ],
        schedule: [
            // ... your existing schedule data
        ]
    });

    useEffect(() => {
        const user_details = typeof window !== "undefined" && JSON.parse(localStorage.getItem("user_details"));
        const updatedContext = { ...rootContext, loader: false };

        if (user_details) {
            updatedContext.authenticated = true;
            updatedContext.user = { ...updatedContext.user, ...user_details };
            console.log("User role from localStorage:", user_details.role); // Debug log
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

        console.log("Current role:", role, "Authenticated:", authenticated, "Path:", pathName); // Debug log

        // Define public routes that don't require authentication
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
            console.log("Sidebar: Not authenticated");
            return false;
        }

        const role = rootContext?.user?.role;
        console.log("Sidebar: Current role:", role); // Debug log

        // Roles that should see sidebar
        const sidebarRoles = ["recruiter", "company", "superadmin"];

        if (!sidebarRoles.includes(role)) {
            console.log("Sidebar: Role not in sidebar roles");
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

        console.log("Sidebar: Should show?", shouldShow, "Path:", pathName);
        return shouldShow;
    };

    // Debug sidebar status
    useEffect(() => {
        if (ready) {
            console.log("Sidebar Status:", {
                authenticated: rootContext.authenticated,
                role: rootContext?.user?.role,
                pathName: pathName,
                shouldShow: shouldShowSidebar()
            });
        }
    }, [ready, rootContext.authenticated, rootContext?.user?.role, pathName]);

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
                        <main className={`w-full m-auto ${shouldShowSidebar() ? 'lg:ml-64' : ''}`}>
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