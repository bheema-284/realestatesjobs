"use client";
import React, { useContext, useState } from "react";
import Input from "./input";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { RadioGroup } from "@headlessui/react";
import RootContext from "../config/rootcontext";

const RegisterForm = () => {
  const router = useRouter();
  const { setRootContext } = useContext(RootContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "applicant",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    general: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const roles = [
    { value: "applicant", label: "Applicant", description: "Job Seeker" },
    { value: "company", label: "Company", description: "Real Estate Company" },
  ];

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      general: ""
    };

    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      general: ""
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors(prev => ({ ...prev, general: "" }));

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "register",
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          role: formData.role,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error messages from API
        if (data.error === "Email already registered") {
          setErrors(prev => ({ ...prev, email: "Email is already registered" }));
        } else if (data.error === "Passwords do not match") {
          setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
        } else {
          setErrors(prev => ({ ...prev, general: data.error || "Registration failed. Please try again." }));
        }
        return;
      }

      if (data.success) {
        setRootContext((prev) => ({
          ...prev,
          toast: {
            show: true,
            type: "success",
            title: "Success",
            message: `Registration successful! Welcome ${data.user.name}`,
          },
        }));
        router.push("/login"); // Redirect to dashboard instead of login
      } else {
        setErrors(prev => ({ ...prev, general: data.error || "Registration failed" }));
        setRootContext((prev) => ({
          ...prev,
          toast: {
            show: true,
            type: "error",
            title: "Failed",
            message: data.error || "Registration failed",
          },
        }));
      }

    } catch (err) {
      console.error("❌ Registration error:", err);
      setErrors(prev => ({ ...prev, general: "Network error. Please check your connection." }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    // Special validation for email
    if (field === "email" && value.trim()) {
      if (!emailRegex.test(value)) {
        setErrors(prev => ({ ...prev, email: "Please enter a valid email" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
    }

    // Special validation for password confirmation
    if (field === "confirmPassword" && value && formData.password !== value) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else if (field === "confirmPassword" && value && formData.password === value) {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }

    // Special validation for password
    if (field === "password" && value && value.length < 6) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
    } else if (field === "password" && value && value.length >= 6) {
      setErrors(prev => ({ ...prev, password: "" }));
      // Also clear confirm password error if passwords now match
      if (formData.confirmPassword && formData.confirmPassword === value) {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const Button = ({ title, type, disabled, onClick }) => (
    <button
      type={type}
      className={`w-1/2 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out 
        bg-gradient-to-r from-orange-400 via-purple-500 to-purple-700 
        hover:from-orange-500 hover:via-purple-600 hover:to-purple-800 
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
        ${loading ? "animate-pulse" : ""}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Processing...
        </div>
      ) : title}
    </button>
  );

  // Headless UI Radio Group Component
  const RoleToggle = () => (
    <div className="w-full">
      <RadioGroup value={formData.role} onChange={(role) => handleChange("role", role)}>
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
              priority
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg shadow-md">
            {/* Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="text-sm font-medium">{errors.general}</p>
              </div>
            )}

            {/* Headless UI Role Toggle */}
            <RoleToggle />

            <Input
              title={`${formData.role === "applicant" ? "Your Full Name" : "Company Name"}`}
              type="text"
              placeholder={`${formData.role === "applicant" ? "Enter Your Name" : "Enter Company Name"}`}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              isError={!!errors.name}
              errormsg={errors.name}
            />

            <Input
              title={`${formData.role === "applicant" ? "Your Email" : "Company Email"}`}
              type="email"
              placeholder={`${formData.role === "applicant" ? "Enter Your Email" : "Enter Company Email"}`}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              isError={!!errors.email}
              errormsg={errors.email}
            />

            <div className="relative">
              <Input
                title="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password (min. 6 characters)"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                isError={!!errors.password}
                errormsg={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                title="Confirm Password"
                type={showCPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                required
                isError={!!errors.confirmPassword}
                errormsg={errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowCPassword(!showCPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              >
                {showCPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Role-based information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-800 mb-1">
                Role Information:
              </p>
              <p className="text-xs text-blue-600">
                {formData.role === 'applicant' && 'Apply for real estate jobs and manage your applications'}
                {formData.role === 'company' && 'Post job listings, manage recruiters and company projects'}
              </p>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                disabled={
                  !formData.name ||
                  !formData.email ||
                  !formData.password ||
                  !formData.confirmPassword ||
                  Object.values(errors).some(error => error && error !== "general")
                }
                type="submit"
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

            {/* Terms and Conditions */}
            <div className="text-xs text-gray-500 text-center pt-4 border-t">
              <p>
                By registering, you agree to our{" "}
                <a href="/terms" className="text-purple-500 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-purple-500 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;