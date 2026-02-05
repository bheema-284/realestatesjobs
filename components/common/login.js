"use client";
import React, { useContext, useState } from "react";
import Input from "./input";
import CheckBox from "./checkbox";
import RootContext from "../config/rootcontext";
import { contextObject } from "../config/contextobject";
import { usePathname, useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useSWRFetch } from "../config/useswrfetch";
import ForgetPassword from "./forgetpassword";

const SignIn = () => {
  const { setRootContext } = useContext(RootContext);
  const pathname = usePathname();
  const router = useRouter();
  const { data: users = [], error, isLoading } = useSWRFetch(`/api/users`);
  const [screen, setScreen] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [isEmail, setIsemail] = useState({
    isErr: false,
    errVisible: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create flattened array of all users (main users + recruiters)
  const allUsers = [
    ...(users || []).map(u => ({
      ...u,
      name: u.name || "",
      email: u.email || "",
      mobile: u.mobile || "",
      password: u.password || "",
      isRecruiter: false,
      userType: "main"
    })),
    ...(users || []).flatMap(c =>
      (c.recruiters || []).map(r => ({
        ...r,
        name: r.name || "",
        email: r.email || "",
        mobile: r.mobile || "",
        password: r.password || "",
        isRecruiter: true,
        userType: "recruiter",
        companyId: c._id,
        companyName: c.name,
        companyProfileImage: c.profileImage,
        mainUserRole: c.role
      }))
    )
  ];

  // Superadmin credentials
  const SUPERADMIN_CREDENTIALS = {
    email: "superadmin@realestatejobs.co.in",
    password: "Superadmin@2025"
  };

  console.log("allUsers", allUsers);

  const handleChange = (e, field) => {
    const updated = { ...formData };

    if (field === "email") {
      if (updated.email !== "") {
        setIsemail({ isErr: true, errVisible: false });
      } else {
        setIsemail({ isErr: false, errVisible: true });
      }
      updated.email = e.target.value;
    } else if (field === "password") {
      updated.password = e.target.value;
    } else if (field === "remember") {
      updated.remember = e;
    }
    setFormData(updated);
  };

  // Function to check if it's superadmin login
  const isSuperAdminLogin = (email, password) => {
    return email.toLowerCase() === SUPERADMIN_CREDENTIALS.email.toLowerCase() &&
      password === SUPERADMIN_CREDENTIALS.password;
  };

  // Function to find user in the flattened allUsers array
  const findUserByEmail = (email) => {
    if (!allUsers || !Array.isArray(allUsers)) return null;

    const searchEmail = email.toLowerCase();

    // Find user in the flattened allUsers array
    const userDetail = allUsers.find((user) =>
      user.email && user.email.toLowerCase() === searchEmail
    );

    return userDetail || null;
  };

  // Simple authentication function that checks against users data
  const authenticateUser = (email, password) => {
    // Check for superadmin first
    if (isSuperAdminLogin(email, password)) {
      return {
        success: true,
        user: {
          role: "superadmin",
          email: email,
          name: "Super Administrator"
        },
        token: "superadmin-token-" + Date.now()
      };
    }

    // Find user in the allUsers data
    const userDetail = findUserByEmail(email);

    if (!userDetail) {
      throw new Error('User not found. Please check your email address.');
    }

    return {
      success: true,
      user: userDetail,
      token: "user-token-" + Date.now() + "-" + (userDetail._id || userDetail.id)
    };
  };

  const onSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      // Authenticate user against users data
      const authResult = authenticateUser(formData.email, formData.password);

      // Prepare user session data
      let userSessionData;

      if (authResult.user?.role === "superadmin") {
        // Superadmin login
        userSessionData = {
          name: "Super Administrator",
          email: formData.email,
          mobile: "",
          role: "superadmin",
          token: authResult.token,
          id: "superadmin-" + Date.now(),
          isSuperAdmin: true,
          permissions: {
            canPostJobs: true,
            canViewApplications: true,
            canManageJobs: true,
            canManageRecruiters: true,
            canManageCompanies: true,
            canManageAllData: true,
            canAccessAnalytics: true,
            canManageUsers: true
          }
        };
      } else {
        // Regular user or recruiter login
        const userDetail = authResult.user;

        userSessionData = {
          name: userDetail.name || formData.email.split("@")[0],
          email: formData.email,
          mobile: userDetail.mobile || "",
          role: userDetail.role || (userDetail.isRecruiter ? "recruiter" : "user"),
          token: authResult.token,
          id: userDetail._id || userDetail.id,
          ...(userDetail.isRecruiter && {
            companyId: userDetail.companyId,
            companyName: userDetail.companyName,
            companyProfileImage: userDetail.companyProfileImage,
            permissions: userDetail.permissions || {
              canPostJobs: true,
              canViewApplications: true,
              canManageJobs: false,
              canManageRecruiters: false
            },
            isRecruiter: true,
            mainUserRole: userDetail.mainUserRole,
            recruiterId: userDetail._id || userDetail.id
          })
        };
      }

      // Success - Create user session
      const resp = {
        ...contextObject,
        authenticated: true,
        user: userSessionData,
        remember: formData.remember,
      };

      // Set appropriate success message based on user type
      let successMessage = "Welcome back!";
      let successTitle = "Login Successful";

      if (userSessionData.role === "superadmin") {
        successMessage = "Welcome Super Administrator! Full system access granted.";
        successTitle = "Superadmin Login Successful";
      } else if (userSessionData.isRecruiter) {
        successMessage = `Welcome back, ${userSessionData.name}! (Recruiter Access)`;
        successTitle = "Recruiter Login Successful";
      } else {
        successMessage = `Welcome back, ${userSessionData.name}!`;
        successTitle = "Login Successful";
      }

      setRootContext(prev => ({
        ...prev,
        authenticated: true,
        user: userSessionData,
        toast: {
          show: true,
          dismiss: true,
          type: "success",
          title: successTitle,
          message: successMessage,
        },
      }));

      // Store user details
      if (formData.remember) {
        localStorage.setItem("user_details", JSON.stringify(resp.user));
      } else {
        sessionStorage.setItem("user_details", JSON.stringify(resp.user));
      }
      localStorage.setItem("user_details", JSON.stringify(resp.user));

      // Store auth token
      localStorage.setItem("auth_token", authResult.token);

      // Redirect based on role and current path
      if (pathname === "/login") {
        router.push('/');
      } else {
        router.back();
      }

    } catch (error) {
      setRootContext((prev) => ({
        ...prev,
        toast: {
          show: true,
          type: "error",
          title: "Login Failed",
          message: error.message || "Invalid email or password. Please try again.",
        },
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const Button = ({ title, type, disabled, onClick }) => (
    <button
      type={type}
      className={`w-1/2 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out 
        bg-gradient-to-r from-orange-400 via-purple-500 to-purple-700 
        hover:from-orange-500 hover:via-purple-600 hover:to-purple-800 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled || isSubmitting}
      onClick={onClick}
    >
      {isSubmitting ? "Signing In..." : title}
    </button>
  );

  return (
    <section
      className="flex items-center justify-center w-screen h-screen bg-no-repeat"
      style={{
        backgroundImage: "url('/login/bg.jpg')",
        backgroundSize: "100% auto",
        backgroundPosition: "center 00px",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full h-screen flex flex-col lg:flex-row overflow-hidden">
        {/* Left Text / Illustration Section */}
        <div className="hidden lg:flex flex-col justify-center w-[63%] text-white p-10">
          <div className="absolute top-8 p-5 z-10 text-gray-900">
            <p className="text-3xl font-semibold mb-5">Login into {" "}<span className="text-4xl font-bold mb-5">Real Estate</span> Jobs</p>
            <p className="text-4xl font-bold mb-2">Now You <span className="text-lg font-semibold">can apply for your intreseted Real Estate Jobs</span> </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        {screen === "login" ? (
          <div className="w-full md:w-[45%] p-8 md:p-10 bg-white/80 flex flex-col justify-center">
            <div className="mb-6 flex justify-center">
              <Image
                alt="logo"
                width={160}
                height={60}
                src="/logo.webp"
              />
            </div>

            <form className="space-y-5 bg-white p-6 rounded-lg">
              <Input
                title="Your Email"
                type="text"
                placeholder="Enter Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={(e) => handleChange(e, "email")}
                isError={isEmail.errVisible}
                errormsg="Enter Valid Email"
                required
              />

              <div className="relative">
                <Input
                  title="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? (
                    <EyeIcon className="w-4 h-4" />
                  ) : (
                    <EyeSlashIcon className="w-4 h-4" />
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <CheckBox
                    isChecked={formData.remember}
                    onChange={(e) => handleChange(e, "remember")}
                  />
                  <label className="ml-2 text-sm text-gray-500">Remember me</label>
                </div>
                <button
                  type="button"
                  onClick={() => setScreen("otp")}
                  className="text-sm font-semibold text-purple-500 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="flex justify-center pt-2">
                <Button
                  disabled={!formData.email || !formData.password || isEmail.errVisible}
                  type="button"
                  onClick={onSave}
                  title="Sign In"
                />
              </div>

              <p className="text-sm text-gray-500 text-center pt-3">
                New User?{" "}
                <span
                  onClick={() => router.push("/signup")}
                  className="font-medium cursor-pointer text-purple-500 hover:underline"
                >
                  Sign up Now
                </span>
              </p>

              {/* Updated Info message about different access levels */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 text-center">
                  <strong>Access Levels:</strong>
                  <br />
                  • <strong>Superadmin:</strong> Full system access & management
                  <br />
                  • <strong>Companies:</strong> Post jobs, manage recruiters & projects
                  <br />
                  • <strong>Recruiters:</strong> Post jobs & view applications
                  <br />
                  • <strong>Applicants:</strong> Apply jobs & manage profile
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-full md:w-[45%] p-8 md:p-10 bg-white/80 flex flex-col justify-center">
            <ForgetPassword setScreen={setScreen} />
          </div>
        )}
      </div>
    </section>
  );
};

export default SignIn;