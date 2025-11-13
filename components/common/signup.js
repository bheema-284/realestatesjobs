"use client";
import React, { useState } from "react";
import Input from "./input";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { RadioGroup } from "@headlessui/react";

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "applicant",
    password: "",
    confirmPassword: ""
  });

  const [isEmail, setIsEmail] = useState({
    isErr: false,
    errVisible: false,
  });

  const [isPassword, setIsPassword] = useState({
    isErr: false,
    errVisible: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const emailRegex = () => /^[\w-.]+@[\w.]+/gm;

  const roles = [
    { value: "applicant", label: "Applicant", description: "Job Seeker" },
    { value: "company", label: "Company", description: "Real Estate Company" },
  ];

  const handleChange = (e, field) => {
    const updatedFormData = { ...formData };

    if (field === "email") {
      updatedFormData.email = e.target.value;
      if (updatedFormData.email !== "" && emailRegex().test(e.target.value)) {
        setIsEmail({ isErr: true, errVisible: false });
      } else {
        setIsEmail({ isErr: false, errVisible: true });
      }
    } else if (field === "password") {
      updatedFormData[field] = e.target.value;
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password match
    if (formData.confirmPassword !== formData.password) {
      setIsPassword({ isErr: false, errVisible: true });
      return;
    }

    setIsPassword({ isErr: true, errVisible: false });

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      // ✅ Saved successfully
      router.push("/login");

    } catch (err) {
      console.error("❌ Error:", err);
      alert("Server error, try again.");
    }
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

  // Headless UI Radio Group Component
  const RoleToggle = () => (
    <div className="w-full">
      <RadioGroup value={formData.role} onChange={(role) => setFormData(prev => ({ ...prev, role }))}>
        <RadioGroup.Label className="block text-sm font-medium text-gray-700 mb-3">
          Select Your Role *
        </RadioGroup.Label>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((role) => (
            <RadioGroup.Option
              key={role.value}
              value={role.value}
              className={({ active, checked }) =>
                `relative flex cursor-pointer rounded-lg border-2 px-3 py-3 focus:outline-none transition-all duration-200 ${checked
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-300 bg-white hover:border-purple-300 hover:bg-gray-50'
                } ${active ? 'ring-2 ring-purple-200 ring-opacity-60' : ''}`
              }
            >
              {({ checked }) => (
                <div className="flex w-full flex-col items-center justify-center text-center">
                  <RadioGroup.Label
                    as="h3"
                    className={`font-semibold text-sm ${checked ? 'text-purple-700' : 'text-gray-700'
                      }`}
                  >
                    {role.label}
                  </RadioGroup.Label>
                  <RadioGroup.Description
                    as="p"
                    className={`text-xs mt-1 ${checked ? 'text-purple-600' : 'text-gray-500'
                      }`}
                  >
                    {role.description}
                  </RadioGroup.Description>

                  {/* Check indicator */}
                  {checked && (
                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500">
                      <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Selected: <span className="font-semibold capitalize">{formData.role}</span>
      </p>
    </div>
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

          <form className="space-y-5 bg-white p-6 rounded-lg shadow-md">
            {/* Headless UI Role Toggle */}
            <RoleToggle />

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

            {/* Role-based information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-800 mb-1">
                Role Information:
              </p>
              <p className="text-xs text-blue-600">
                {formData.role === 'applicant' && 'Apply for real estate jobs and manage your applications'}
                {formData.role === 'company' && 'Manage recruiters and company projects'}
              </p>
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