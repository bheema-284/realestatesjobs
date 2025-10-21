"use client"
import React, { useContext, useState } from "react";
import Input from "./input";
import CheckBox from "./checkbox";
import RootContext from "../config/rootcontext";
import { contextObject } from "../config/contextobject";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { candidatesData, companyData, users } from '../config/data'
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
    errVisible: false
  });
  const [showPassword, setShowPassword] = useState(false);
  function emailregex() {
    const regex = /^[\w-.]+@[\w.]+/gm;
    return regex;
  }

  const handleChange = (e, field) => {
    const updatedformData = { ...formData };
    if (field === "email") {
      if (updatedformData.email !== "" && emailregex().test(e.target.value)) {
        setIsemail({
          isErr: true,
          errVisible: false
        });
      } else {
        setIsemail({
          isErr: false,
          errVisible: true
        });
      }
    } else if (field === "mobile") {
      updatedformData[field] = e.target.value;
    } else if (field === "password") {
      updatedformData[field] = e.target.value;
    } else if (field === "remember") {
      updatedformData[field] = e;
    }
    setFormData(updatedformData);
  };

  const onSave = (e) => {
    e.preventDefault(); // Prevent page refresh

    const userByEmail = users.find((user) => user.email === formData.email);
    const userByPassword = users.find((user) => user.password === formData.password);
    const allUsers = [
      ...(candidatesData || []),
      ...(companyData || [])
    ];
    const userDetail = (allUsers || []).find(
      (c) => c.email.includes(formData.email)
    );
    if (!userByEmail && !userByPassword) {
      // User not found
      setRootContext((prevContext) => ({
        ...prevContext,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          title: "Login Failed",
          message: "User not found. Please sign up.",
        },
      }));
    }
    else if (!userByEmail) {
      // Email not found
      setRootContext((prevContext) => ({
        ...prevContext,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          title: "Login Failed",
          message: "Email not found. Please sign up.",
        },
      }));
    } else if (!userByPassword) {
      // Email found, but password wrong
      setRootContext((prevContext) => ({
        ...prevContext,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          title: "Login Failed",
          message: "Incorrect password. Please try again.",
        },
      }));
    } else {
      // Email and password correct
      const username = formData.name || userByEmail.email.split("@")[0];

      const resp = {
        ...contextObject,
        authenticated: true,
        loader: false,
        user: {
          name: userDetail?.name || username,
          email: userByEmail.email,
          mobile: userByEmail.mobile,
          password: userByEmail.password,
          role: userByEmail.role,
          token: userByEmail.token,
          id: userDetail.id || 1
        },
        remember: formData.remember,
      };

      setRootContext({
        ...resp,
        toast: {
          show: true,
          dismiss: true,
          type: "success",
          title: "Login Successful",
          message: "Welcome back!",
        },
      });
      localStorage.setItem("user_details", JSON.stringify(resp.user));
      router.push("/");
    }
  };

  const Button = ({ title, type, disabled, className, onClick }) => {
    const baseClasses = "w-1/2 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out";
    const gradientClasses = "bg-gradient-to-r from-orange-400 via-purple-500 to-purple-700 hover:from-orange-500 hover:via-purple-600 hover:to-purple-800 hover:rounded-full";
    const disabledClasses = "opacity-50 cursor-not-allowed";

    return (
      <button
        type={type}
        className={`${baseClasses} ${gradientClasses} ${disabled ? disabledClasses : ''} ${className}`}
        disabled={disabled}
        onClick={onClick}
      >
        {title}
      </button>
    );
  };

  return (
    <section className="flex w-screen h-screen">
      {/* Left Side - Form Section */}
      <div style={{
        backgroundImage: "url('/login/layer_7.png')",
      }} className="hidden w-[55%] mx-auto lg:flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat">
        <div className="absolute top-18 left-[38%]">
          <Image alt={"rupees"} width={150} height={60} className="scale-[150%]" src="/login/layer_9.png" />
        </div>
        <div className="absolute top-0 left-0 p-5 z-10 text-gray-900">
          <h2 className="text-4xl font-bold mb-2">Login into Real Estate Jobs</h2>
          <p className="text-4xl font-bold mb-2">Now You <span className="text-lg font-semibold">can apply for your intreseted Real Estate Jobs</span> </p>
        </div>
      </div>
      {/* Right Side - Image Section */}
      <div style={{
        backgroundImage: "url('/login/layer_8.png')",
      }} className="w-[45%] mx-auto flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat">
        <div className="w-full p-5">
          {/* REAL ESTATE JOBS Banner */}
          <Image alt={"logo"} width={150} height={60} src="https://realestatejobs.co.in/images/logo.png" />
          <div className="w-full bg-white rounded-lg px-12 py-10 mt-5">
            <div className="space-y-4 md:space-y-6">
              <Input
                title={"Your Email"}
                type={"text"}
                placeholder={"Enter Email"}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={(e) => handleChange(e, "email")}
                isError={isEmail.errVisible}
                errormsg={"Enter Valid Email"}
                required={true}
              />

              <div className="relative">
                <Input
                  title={"Password"}
                  type={showPassword ? "text" : "password"}
                  placeholder={"Enter Password"}
                  value={formData.password}
                  onChange={(e) => handleChange(e, "password")}
                  required={true}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? (
                    <EyeIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between items-center">
                <div className="flex items-start">
                  <CheckBox
                    isChecked={formData.remember}
                    onChange={(e) => handleChange(e, "remember")}
                  />
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500">
                      Remember me
                    </label>
                  </div>
                </div>
                <Link href="/" className="text-sm text-purple font-medium text-purple-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <Button disabled={formData.email === "" && formData.password === ""} type={"button"} btnType={"save"} onClick={onSave} title={"Sign In"} />
              </div>
              <p className="text-sm font-light text-gray-500">
                New User ?{" "}
                <span onClick={() => router.push("/signup")} className="font-medium cursor-pointer text-purple-500 hover:underline">
                  Sign up Now
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;