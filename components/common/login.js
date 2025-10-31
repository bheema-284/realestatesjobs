"use client";
import React, { useContext, useState } from "react";
import Input from "./input";
import CheckBox from "./checkbox";
import RootContext from "../config/rootcontext";
import { contextObject } from "../config/contextobject";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { candidatesData, companyData, users } from "../config/data";
import Image from "next/image";
import Link from "next/link";

const SignIn = () => {
  const { setRootContext } = useContext(RootContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    mobile: "",
    email: "",
    password: "",
    remember: false,
  });

  const [isEmail, setIsemail] = useState({
    isErr: false,
    errVisible: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const emailregex = () => /^[\w-.]+@[\w.]+/gm;

  const handleChange = (e, field) => {
    const updated = { ...formData };

    if (field === "email") {
      if (updated.email !== "" && emailregex().test(e.target.value)) {
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

  const onSave = (e) => {
    e.preventDefault();

    const userByEmail = users.find((u) => u.email === formData.email);
    const userByPassword = users.find((u) => u.password === formData.password);
    const allUsers = [...(candidatesData || []), ...(companyData || [])];
    const userDetail = allUsers.find((c) => c.email.includes(formData.email));

    if (!userByEmail && !userByPassword) {
      return setRootContext((prev) => ({
        ...prev,
        toast: {
          show: true,
          type: "error",
          title: "Login Failed",
          message: "User not found. Please sign up.",
        },
      }));
    } else if (!userByEmail) {
      return setRootContext((prev) => ({
        ...prev,
        toast: {
          show: true,
          type: "error",
          title: "Login Failed",
          message: "Email not found. Please sign up.",
        },
      }));
    } else if (!userByPassword) {
      return setRootContext((prev) => ({
        ...prev,
        toast: {
          show: true,
          type: "error",
          title: "Login Failed",
          message: "Incorrect password. Please try again.",
        },
      }));
    }

    // Success
    const username = formData.name || userByEmail.email.split("@")[0];
    const resp = {
      ...contextObject,
      authenticated: true,
      user: {
        name: userDetail?.name || username,
        email: userByEmail.email,
        mobile: userByEmail.mobile,
        password: userByEmail.password,
        role: userByEmail.role,
        token: userByEmail.token,
        id: userDetail?.id || 1,
      },
      remember: formData.remember,
    };

    setRootContext({
      ...resp,
      toast: {
        show: true,
        type: "success",
        title: "Login Successful",
        message: "Welcome back!",
      },
    });
    localStorage.setItem("user_details", JSON.stringify(resp.user));
    router.push("/");
  };

  const Button = ({ title, type, disabled, onClick }) => (
    <button
      type={type}
      className={`w-1/2 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out 
        bg-gradient-to-r from-orange-400 via-purple-500 to-purple-700 
        hover:from-orange-500 hover:via-purple-600 hover:to-purple-800 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {title}
    </button>
  );

  return (
    <section
      className="flex items-center justify-center w-screen h-screen bg-no-repeat"
      style={{
        backgroundImage: "url('/login/bg.jpg')",
        backgroundSize: "100% auto",
        backgroundPosition: "center 00px", // pushes image 80px down
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
                onChange={(e) => handleChange(e, "password")}
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
              <Link href="/" className="text-sm text-purple-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                disabled={!formData.email || !formData.password}
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
        </div>
      </div>
    </section>
  );
};

export default SignIn;