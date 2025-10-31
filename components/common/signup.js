"use client";
import React, { useState } from "react";
import Input from "./input";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { users } from "../config/data";
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
    errVisible: false,
  });

  const [isPassword, setIsPassword] = useState({
    isErr: false,
    errVisible: false,
  });

  const emailregex = () => /^[\w-.]+@[\w.]+/gm;

  const handleChange = (e, field) => {
    const updatedformData = { ...formData };
    if (field === "email") {
      if (updatedformData.email !== "" && emailregex().test(e.target.value)) {
        setIsemail({ isErr: true, errVisible: false });
      } else {
        setIsemail({ isErr: false, errVisible: true });
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
    if (formData.confirmPassword === formData.password) {
      setIsPassword({ isErr: true, errVisible: false });
      users.push({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isAdmin: false,
      });
      router.push("/login");
    } else {
      setIsPassword({ isErr: false, errVisible: true });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

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
        <div className="hidden lg:flex flex-col justify-center w-[63%] text-white p-10 relative">
          <div className="absolute top-8 p-5 z-10 text-gray-900">
            <p className="text-3xl font-semibold mb-5">
              Register for{" "}
              <span className="text-4xl font-bold mb-5 text-gray-900">
                Real Estate
              </span>{" "}
              Jobs
            </p>
            <p className="text-4xl font-bold mb-2">
              Join us!{" "}
              <span className="text-lg font-semibold">
                to apply for your interested Real Estate Jobs
              </span>
            </p>
          </div>
        </div>

        {/* Right Side - Register Form */}
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
              title="Your Name"
              type="text"
              placeholder="Enter Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <Input
              title="Your Email"
              type="text"
              placeholder="Enter Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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

            <div className="relative">
              <Input
                title="Confirm Password"
                type={showCPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                isError={isPassword.errVisible}
                errormsg="Passwords do not match!"
              />
              <span
                onClick={() => setShowCPassword(!showCPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showCPassword ? (
                  <EyeIcon className="w-4 h-4" />
                ) : (
                  <EyeSlashIcon className="w-4 h-4" />
                )}
              </span>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                disabled={
                  !formData.name ||
                  !formData.email ||
                  !formData.password ||
                  !formData.confirmPassword
                }
                type="button"
                onClick={handleSubmit}
                title="Register"
              />
            </div>

            <p className="text-sm text-gray-500 text-center pt-3">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="font-medium cursor-pointer text-purple-500 hover:underline"
              >
                Login Now
              </span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;