'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useContext, useEffect, useState } from "react";
import RootContext from "@/components/config/rootcontext";
import SignIn from "@/components/common/login";
import MenuHeader from "@/components/menuheader";
import Loader from "@/components/common/loader";
import Toast from "@/components/common/toast";
import { contextObject } from "@/components/config/contextobject";
import RegisterForm from "@/components/common/signup";
import { usePathname } from "next/navigation";
import SidebarLayout from "@/components/sidebar";
import Dashboard from "@/components/dashboard";
import DashboardLayout from "@/components/dashboardlayout";
import { users } from '@/components/config/data'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  const context = useContext(RootContext);
  const pathName = usePathname();
  const [rootContext, setRootContext] = useState(context);

  useEffect(() => {
    var resp = contextObject;
    const user_details = localStorage && JSON.parse(localStorage.getItem("user_details"));
    resp.loader = false;
    if (user_details) {
      resp.authenticated = true;
      resp.loader = false;
      resp.user = user_details
    }
    setRootContext({ ...resp });
  }, [])
  console.log("rootContext", rootContext)

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootContext.Provider value={{ rootContext, setRootContext }}>
          <div>
            {(pathName === "/signup" && !rootContext.authenticated && !rootContext.loader) ? <RegisterForm /> : rootContext.loader ?
              <Loader /> :
              (!rootContext.authenticated && !rootContext.loader) ?
                <SignIn /> : <div>
                  <DashboardLayout />
                </div>}
          </div>
          <Toast />
        </RootContext.Provider>
      </body>
    </html>
  );
}
