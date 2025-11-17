"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/24/solid";
import { RadioGroup } from "@headlessui/react";
import Input from "../common/input";
import RootContext from "../config/rootcontext";

const AddRecruiterForm = ({ companyId, onClose, existingRecruiters = [], mutated }) => {
  const router = useRouter();
  const { setRootContext } = useContext(RootContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "recruiter",
    password: "",
    confirmPassword: "",
    department: "",
    phone: "",
    permissions: {
      canPostJobs: true,
      canViewApplications: true,
      canManageJobs: false,
      canManageRecruiters: false
    }
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRegex = () => /^[\w-.]+@[\w.]+/gm;

  const departments = [
    { value: "hr", label: "Human Resources", description: "HR & Talent Acquisition" },
    { value: "sales", label: "Sales", description: "Sales & Business Development" },
    { value: "marketing", label: "Marketing", description: "Digital Marketing" },
    { value: "operations", label: "Operations", description: "Operations Management" },
    { value: "technical", label: "Technical", description: "IT & Technical Hiring" },
    { value: "general", label: "General", description: "Multiple Departments" },
  ];

  const permissionOptions = [
    { id: "canPostJobs", label: "Post Jobs", description: "Create and publish new job openings" },
    { id: "canViewApplications", label: "View Applications", description: "Access and review job applications" },
    { id: "canManageJobs", label: "Manage Jobs", description: "Edit, close, or delete job postings" },
    { id: "canManageRecruiters", label: "Manage Recruiters", description: "Add or remove other recruiters" },
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
    } else if (field.startsWith("permissions.")) {
      const permissionField = field.split(".")[1];
      updatedFormData.permissions = {
        ...updatedFormData.permissions,
        [permissionField]: e.target.checked
      };
    } else {
      updatedFormData[field] = e.target.value;
    }

    setFormData(updatedFormData);
  };

  const handlePermissionChange = (permissionId, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionId]: checked
      }
    }));
  };

  const generateRecruiterId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `recruiter-${timestamp}-${random}`;
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'password', 'department'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');

    if (missingFields.length > 0) {
      return `Please fill in required fields: ${missingFields.join(', ')}`;
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    if (!emailRegex().test(formData.email)) {
      return 'Please enter a valid email address';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setRootContext(prev => ({
        ...prev,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          position: "Validation Error",
          message: validationError,
        },
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate recruiter ID
      const recruiterId = generateRecruiterId();

      // Calculate the recruiter index (position in the recruiters array)
      const recruiterIndex = existingRecruiters.length;

      // Build recruiter object
      const newRecruiter = {
        id: recruiterId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        phone: formData.phone,
        permissions: formData.permissions,
        addedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        isActive: true,
        createdBy: companyId,
        // Password will be handled separately by your user creation logic
      };

      // Prepare FormData
      const fd = new FormData();
      fd.append("id", companyId);

      // Preserve existing recruiters and add the new one
      const updatedRecruiters = [...existingRecruiters, newRecruiter];
      fd.append("recruiters", JSON.stringify(updatedRecruiters));

      console.log('📊 Recruiters data:', {
        existingCount: existingRecruiters.length,
        newRecruiter: newRecruiter.name,
        updatedCount: updatedRecruiters.length,
        allRecruiters: updatedRecruiters.map(r => r.name)
      });

      // Send request to update user (company) with new recruiter
      const response = await fetch("/api/users", {
        method: "PUT",
        body: fd
      });

      const result = await response.json();

      if (result.success) {
        setRootContext(prev => ({
          ...prev,
          toast: {
            show: true,
            dismiss: true,
            type: "success",
            position: "Success",
            message: "Recruiter added successfully!"
          }
        }));

        mutated();
        onClose();
        router.refresh();
      } else {
        console.error('Backend error:', result);
        setRootContext(prev => ({
          ...prev,
          toast: {
            show: true,
            dismiss: true,
            type: "error",
            position: "Failed",
            message: result.error || "Failed to add recruiter"
          }
        }));
      }

    } catch (err) {
      console.error("Error adding recruiter:", err);
      setRootContext(prev => ({
        ...prev,
        toast: {
          show: true,
          dismiss: true,
          type: "error",
          position: "Failed",
          message: "Error adding recruiter. Please try again."
        }
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const Button = ({ title, type, disabled, onClick }) => (
    <button
      type={type}
      className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out 
        bg-gradient-to-r from-green-500 to-blue-600
        hover:from-green-600 hover:to-blue-700
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${isSubmitting ? "animate-pulse" : ""}`}
      disabled={disabled || isSubmitting}
      onClick={onClick}
    >
      {isSubmitting ? "Adding Recruiter..." : title}
    </button>
  );

  // Department Selector Component
  const DepartmentSelector = () => (
    <div className="w-full">
      <RadioGroup value={formData.department} onChange={(dept) => setFormData(prev => ({ ...prev, department: dept }))}>
        <RadioGroup.Label className="block text-sm font-medium text-gray-700 mb-3">
          Department *
        </RadioGroup.Label>
        <div className="grid grid-cols-2 gap-3">
          {departments.map((dept) => (
            <RadioGroup.Option
              key={dept.value}
              value={dept.value}
              className={({ active, checked }) =>
                `relative flex cursor-pointer rounded-lg border-2 px-3 py-3 focus:outline-none transition-all duration-200 ${checked
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-gray-50'
                } ${active ? 'ring-2 ring-blue-200 ring-opacity-60' : ''}`
              }
            >
              {({ checked }) => (
                <div className="flex w-full flex-col items-center justify-center text-center">
                  <RadioGroup.Label
                    as="h3"
                    className={`font-semibold text-sm ${checked ? 'text-blue-700' : 'text-gray-700'
                      }`}
                  >
                    {dept.label}
                  </RadioGroup.Label>
                  <RadioGroup.Description
                    as="p"
                    className={`text-xs mt-1 ${checked ? 'text-blue-600' : 'text-gray-500'
                      }`}
                  >
                    {dept.description}
                  </RadioGroup.Description>

                  {/* Check indicator */}
                  {checked && (
                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
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
        Selected: <span className="font-semibold capitalize">{formData.department || "None"}</span>
      </p>
    </div>
  );

  // Permissions Component
  const PermissionsSelector = () => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Permissions *
      </label>
      <div className="grid grid-cols-1 gap-3">
        {permissionOptions.map((permission) => (
          <div
            key={permission.id}
            className={`flex items-start p-3 border rounded-lg transition-all duration-200 ${formData.permissions[permission.id]
              ? "border-blue-500 bg-blue-50 shadow-sm"
              : "border-gray-300 bg-white"
              }`}
          >
            <input
              type="checkbox"
              id={permission.id}
              checked={formData.permissions[permission.id]}
              onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
            />
            <label htmlFor={permission.id} className="ml-3 flex-1">
              <span className={`text-sm font-medium ${formData.permissions[permission.id] ? "text-blue-700" : "text-gray-700"
                }`}>
                {permission.label}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {permission.description}
              </p>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto mx-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Add New Recruiter</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl p-1"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  title="Full Name *"
                  type="text"
                  placeholder="Enter recruiter's full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <Input
                  title="Email Address *"
                  type="email"
                  placeholder="Enter professional email"
                  value={formData.email}
                  onChange={(e) => handleChange(e, "email")}
                  onBlur={(e) => handleChange(e, "email")}
                  isError={isEmail.errVisible}
                  errormsg="Enter valid email address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  title="Phone Number"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Department Selection */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department & Role</h3>
              <DepartmentSelector />
            </div>

            {/* Permissions Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Permissions</h3>
              <PermissionsSelector />
            </div>

            {/* Security Section */}
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Access</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    title="Password *"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create secure password"
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

                <div className="relative items-center">
                  <Input
                    title="Confirm Password *"
                    type={showCPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              </div>

              {/* Password Requirements */}
              <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Minimum 6 characters</li>
                  <li>• Include uppercase and lowercase letters</li>
                  <li>• Include at least one number</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base order-2 sm:order-1"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base order-1 sm:order-2"
              >
                {isSubmitting ? 'Adding Recruiter...' : 'Add Recruiter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecruiterForm;