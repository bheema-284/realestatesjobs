
"use client";
import React, { useState } from "react";
import CheckBox from "./checkbox";
import Input from "./input";
import Button from "./button";
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

  const tabs = ["Applicant", "Company Profile"];
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  return (
    <section className="bg-gray-50 dark:bg-gray-900 mt-5">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Image alt={"image"} width={100} height={10} src="https://realestatejobs.co.in/images/logo.png" />
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
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
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-full w-fit">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${activeTab === tab
                      ? "bg-indigo-600 text-white"
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
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
              <Button type={"button"} onClick={handleSubmit} title={"Register"} />
              <p className="text-sm font-light text-gray-500 dark:text-gray-400 flex gap-2">
                Already have an account?{" "}
                <Link
                  href="/"
                  className="font-medium text-violet-600 hover:underline dark:text-voilet-500"
                >
                  Login Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;