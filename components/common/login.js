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

  // Helper function to find user details
  const findUserByEmail = (email) => {
    if (!users || !Array.isArray(users)) return null;

    const searchEmail = email.toLowerCase();

    // First, search in main users
    const mainUser = users.find(user =>
      user.email && user.email.toLowerCase() === searchEmail
    );

    if (mainUser) {
      // If it's a recruiter within a company
      if (mainUser.role === "recruiter" && mainUser.companyId) {
        const company = users.find(u => u._id === mainUser.companyId);
        return {
          ...mainUser,
          companyDetails: company ? {
            name: company.name,
            profileImage: company.profileImage,
            email: company.email,
            mobile: company.mobile,
            location: company.location
          } : null
        };
      }
      return mainUser;
    }

    // If not found in main users, check recruiters in companies
    for (const company of users) {
      if (company.recruiters && Array.isArray(company.recruiters)) {
        const recruiter = company.recruiters.find(r =>
          r.email && r.email.toLowerCase() === searchEmail
        );

        if (recruiter) {
          return {
            ...recruiter,
            role: "recruiter",
            isRecruiter: true,
            companyId: company._id,
            companyName: company.name,
            companyProfileImage: company.profileImage,
            companyDetails: {
              name: company.name,
              profileImage: company.profileImage,
              email: company.email,
              mobile: company.mobile,
              location: company.location
            },
            mainUserRole: company.role
          };
        }
      }
    }

    return null;
  };

  // Authenticate user function
  const authenticateUser = (email, password) => {
    // Check for superadmin first
    const SUPERADMIN_CREDENTIALS = {
      email: "superadmin@realestatejobs.co.in",
      password: "Superadmin@2025"
    };

    if (email.toLowerCase() === SUPERADMIN_CREDENTIALS.email.toLowerCase() &&
      password === SUPERADMIN_CREDENTIALS.password) {
      return {
        success: true,
        user: {
          _id: "superadmin-" + Date.now(),
          role: "superadmin",
          email: email,
          name: "Super Administrator",
          isSuperAdmin: true
        }
      };
    }

    // Find user in the database
    const userDetail = findUserByEmail(email);

    if (!userDetail) {
      throw new Error('User not found. Please check your email address.');
    }

    // IMPORTANT: In a real app, you should compare hashed passwords
    // Since we have plain passwords in the data, we compare directly
    // Note: This is for demo purposes only - in production, use proper password hashing
    if (userDetail.password !== password) {
      // If this is a recruiter, check if they have password field
      if (userDetail.role === "recruiter" && userDetail.password !== password) {
        throw new Error('Invalid password. Please try again.');
      }
      // For main users, the password should match
      throw new Error('Invalid password. Please try again.');
    }

    return {
      success: true,
      user: userDetail
    };
  };

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

  const onSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      // Authenticate user
      const authResult = authenticateUser(formData.email, formData.password);

      // Prepare user session data
      const userDetail = authResult.user;

      let userSessionData;

      if (userDetail.role === "superadmin") {
        // Superadmin login
        userSessionData = {
          _id: userDetail._id,
          name: userDetail.name,
          email: userDetail.email,
          role: "superadmin",
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
        // Regular user login
        userSessionData = {
          _id: userDetail._id,
          name: userDetail.name,
          email: userDetail.email,
          mobile: userDetail.mobile || "",
          role: userDetail.role || (userDetail.isRecruiter ? "recruiter" : userDetail.role),
          position: userDetail.position || "",
          profileImage: userDetail.profileImage || "",
          company: userDetail.company || "",
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
            mainUserRole: userDetail.mainUserRole || "company"
          }),
          // Add other relevant user data from your database
          ...(userDetail.location && { location: userDetail.location }),
          ...(userDetail.experience && { experience: userDetail.experience }),
          ...(userDetail.education && { education: userDetail.education }),
          ...(userDetail.skills && { skills: userDetail.skills }),
          ...(userDetail.summary && { summary: userDetail.summary }),
          ...(userDetail.dateOfBirth && { dateOfBirth: userDetail.dateOfBirth }),
          ...(userDetail.gender && { gender: userDetail.gender })
        };
      }

      console.log("User session data prepared:", userSessionData);

      // Success - Create user session
      const resp = {
        ...contextObject,
        authenticated: true,
        user: userSessionData,
        remember: formData.remember,
      };

      // Set success message
      let successMessage = "Welcome back!";
      let successTitle = "Login Successful";

      if (userSessionData.role === "superadmin") {
        successMessage = "Welcome Super Administrator! Full system access granted.";
        successTitle = "Superadmin Login Successful";
      } else if (userSessionData.isRecruiter) {
        successMessage = `Welcome back, ${userSessionData.name}! (Recruiter Access)`;
        successTitle = "Recruiter Login Successful";
      } else if (userSessionData.role === "applicant") {
        successMessage = `Welcome back, ${userSessionData.name}!`;
        successTitle = "Applicant Login Successful";
      } else if (userSessionData.role === "company") {
        successMessage = `Welcome back, ${userSessionData.name}!`;
        successTitle = "Company Login Successful";
      }

      // Update context
      setRootContext(prev => ({
        ...prev,
        authenticated: true,
        user: userSessionData,
        loader: false,
        toast: {
          show: true,
          dismiss: true,
          type: "success",
          title: successTitle,
          message: successMessage,
        },
      }));

      // Store user details based on remember preference
      const storage = formData.remember ? localStorage : sessionStorage;
      storage.setItem("user_details", JSON.stringify(userSessionData));

      // Always store in localStorage as backup
      localStorage.setItem("user_details", JSON.stringify(userSessionData));
      localStorage.setItem("auth_token", `token-${Date.now()}-${userSessionData._id}`);

      // Redirect based on role and current path
      setTimeout(() => {
        if (pathname === "/login") {
          if (userSessionData.role === "superadmin") {
            router.push('/admin/dashboard');
          } else if (userSessionData.role === "company" || userSessionData.role === "recruiter") {
            router.push('/company/dashboard');
          } else if (userSessionData.role === "applicant") {
            router.push('/applicant/dashboard');
          } else {
            router.push('/');
          }
        } else {
          router.back();
        }
      }, 1000);

    } catch (error) {
      console.error("Login error:", error);
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