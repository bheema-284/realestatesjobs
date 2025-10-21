"use client";
import React, { useState } from "react";
import Input from "./input";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { users } from '../config/data'
import Image from "next/image";
import Link from "next/link";

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [isEmail, setIsemail] = useState({
    isErr: false,
    errVisible: false
  });

  const [isPassword, setIsPassword] = useState({
    isErr: false,
    errVisible: false
  });

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
    } else if (field === "password") {
      updatedformData[field] = e.target.value;
    } else if (field === "termsAccepted") {
      updatedformData[field] = e;
    }
    setFormData(updatedformData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add validation or send data to backend here
    if (formData.confirmPassword === formData.password) {
      setIsPassword({
        isErr: true,
        errVisible: false
      });
      users.push({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        passward: formData.password,
        token: formData.token,
        isAdmin: false,
      })
      router.push("/")
    } else {
      setIsPassword({
        isErr: false,
        errVisible: true
      });
    }
  };
  const [activeTab, setActiveTab] = useState("Applicant");

  const tabs = ["Applicant", "Recruiter"];
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

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
          <div className="w-full bg-white rounded-lg px-12 mt-5">
            <div className="p-5 space-y-4 md:space-y-6">
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-full w-fit">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200
        ${activeTab === tab
                        ? tab === "Applicant"
                          ? "bg-gradient-to-r from-yellow-600 to-red-500 text-white"
                          : tab === "Recruiter"
                            ? "bg-gradient-to-r from-red-500 via-orange-500 to-indigo-500 text-white"
                            : "bg-blue-700 text-white"
                        : "bg-transparent text-gray-700"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="space-y-4 md:space-y-6">
                <Input
                  title={"Your Name"}
                  type={"text"}
                  placeholder={"Enter Name"}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={true}
                />
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
                <div className="relative">
                  <Input
                    title={"Confirm Password"}
                    type={showCPassword ? "text" : "password"}
                    placeholder={"Confirm Enter Password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    onBlur={(e) => handleChange(e, "confirmPassword")}
                    required={true}
                    isError={isPassword.errVisible}
                    errormsg={"Passwords do not match!"}
                  />
                  <span
                    onClick={() => setShowCPassword(!showCPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showCPassword ? (
                      <EyeIcon className="w-4 h-4 text-gray-400" />
                    ) : (
                      <EyeSlashIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </span>
                </div>
                <div className="text-center items-center justify-center">
                  <Button disabled={formData.name !== "" && formData.email !== "" && formData.password !== "" && formData.confirmPassword !== ""} type={"button"} onClick={handleSubmit} title={"Register"} />
                  <p className="text-sm font-light text-gray-500 flex gap-2 pt-3">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-violet-600 hover:underline"
                    >
                      Login Now
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;