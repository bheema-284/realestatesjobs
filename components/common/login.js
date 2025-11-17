"use client";
import React, { useContext, useState } from "react";
import Input from "./input";
import CheckBox from "./checkbox";
import RootContext from "../config/rootcontext";
import { contextObject } from "../config/contextobject";
import { usePathname, useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { companyData } from "../config/data";
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

  const authenticateUser = async (email, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      // Authenticate user via API
      const authResult = await authenticateUser(formData.email, formData.password);

      // Find user details from local data (for name, etc.)
      const allUsers = [...(users || []), ...(companyData || [])];
      const userDetail = allUsers.find((c) => c.email.includes(formData.email));

      // Success - Create user session
      const username = userDetail?.name || formData.email.split("@")[0];
      const resp = {
        ...contextObject,
        authenticated: true,
        user: {
          name: username,
          email: formData.email,
          mobile: userDetail?.mobile || "",
          role: authResult.user?.role || "applicant",
          token: authResult.token,
          id: userDetail?._id || authResult.user?._id || 1,
        },
        remember: formData.remember,
      };

      setRootContext(prev => ({
        ...prev,
        authenticated: true,
        user: {
          name: username,
          email: formData.email,
          mobile: userDetail?.mobile || "",
          role: authResult.user?.role || "applicant",
          token: authResult.token,
          id: userDetail?._id || authResult.user?._id || 1,
        },
        toast: {
          show: true,
          dismiss: true,
          type: "success",
          title: "Login Successful",
          message: "Welcome back!",
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
        {screen === "login" ? <div className="w-full md:w-[45%] p-8 md:p-10 bg-white/80 flex flex-col justify-center">
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
          </form>
        </div> : <div className="w-full md:w-[45%] p-8 md:p-10 bg-white/80 flex flex-col justify-center">  <ForgetPassword setScreen={setScreen} /></div>}
      </div>
    </section>
  );
};

export default SignIn;