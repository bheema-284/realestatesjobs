"use client"
import React, { useContext, useState } from "react";
import Input from "./input";
import CheckBox from "./checkbox";
import RootContext from "../config/rootcontext";
import { contextObject } from "../config/contextobject";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { users } from '../config/data'
import Image from "next/image";
import Link from "next/link";
const SignIn = () => {
  const { rootContext, setRootContext } = useContext(RootContext);
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
          name: username,
          email: userByEmail.email,
          mobile: userByEmail.mobile,
          password: userByEmail.password,
          role: userByEmail.role,
          token: userByEmail.token,
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
      // Optional: Navigate to dashboard
      router.push("/");
    }
  };


  const Button = ({ title, type, btnType, disabled, className, onClick }) => {
    const baseClasses = "w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out";
    const gradientClasses = "bg-gradient-to-r from-orange-400 via-purple-500 to-purple-700 hover:from-orange-500 hover:via-purple-600 hover:to-purple-800";
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
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Image alt={"logo"} width={100} height={10} src="https://realestatejobs.co.in/images/logo.png" />
        <form onSubmit={onSave} className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
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
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                </div>
                <Link href="/" className="text-sm text-purple font-medium text-purple-500 hover:underline dark:text-primary-500">
                  Forgot password?
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <Button disabled={formData.email === "" && formData.password === ""} type={"submit"} btnType={"save"} title={"Sign In"} />
              </div>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                New User ?{" "}
                <span onClick={() => router.push("/signup")} className="font-medium cursor-pointer text-purple-500 hover:underline dark:text-primary-500">
                  Sign up Now
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignIn;
