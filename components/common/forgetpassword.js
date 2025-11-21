"use client";
import React, { useState, Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EyeIcon, EyeSlashIcon, InformationCircleIcon, XMarkIcon, UserIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import RootContext from "../config/rootcontext";

export default function ForgetPassword({ setScreen }) {
    const [inputType, setInputType] = useState("email");
    const [userType, setUserType] = useState("regular"); // "regular" or "recruiter"
    const [inputValue, setInputValue] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false,
    });
    const [loading, setLoading] = useState(false);
    const [isUserNotFound, setIsUserNotFound] = useState(false);
    const { setRootContext } = useContext(RootContext);

    const toggleInputType = () => {
        setInputType(inputType === "email" ? "mobile" : "email");
        setInputValue("");
        setIsUserNotFound(false);
    };

    const toggleUserType = () => {
        setUserType(userType === "regular" ? "recruiter" : "regular");
        setInputValue("");
        setIsUserNotFound(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inputValue) {
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    title: "Error",
                    message: `Please enter your ${inputType === "email" ? "email address" : "mobile number"}.`,
                },
            }));
            return;
        }

        if (newPassword !== confirmPassword) {
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    title: "Error",
                    message: "New password and confirm password do not match.",
                },
            }));
            return;
        }

        if (newPassword.length < 6) {
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "warning",
                    title: "Warning",
                    message: "New password must be at least 6 characters long.",
                },
            }));
            return;
        }

        try {
            setLoading(true);
            setIsUserNotFound(false);

            let payload = {};
            let endpoint = "/api/users";
            let method = "PUT";

            if (userType === "recruiter") {
                // Recruiter password reset
                payload = {
                    resetRecruiterPassword: true,
                    recruiterEmail: inputValue,
                    newPassword: newPassword,
                    resetBy: "superadmin" // This can be 'system' for self-service reset
                };
            } else {
                // Regular user password reset
                payload = {
                    resetPassword: true,
                    newPassword: newPassword
                };

                // Add either email or mobile based on input type
                if (inputType === "email") {
                    payload.email = inputValue;
                } else {
                    payload.mobile = inputValue;
                }
            }

            console.log("Sending reset password request:", payload);

            const res = await fetch(endpoint, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                let successMessage = "Password reset successfully! You can now login with your new password.";

                if (userType === "recruiter") {
                    successMessage = `Recruiter password reset successfully for ${data.recruiterName || inputValue}! You can now login with your new password.`;
                }

                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "success",
                        title: "Success",
                        message: successMessage,
                    },
                }));
                setNewPassword("");
                setConfirmPassword("");
                setInputValue("");
                setScreen("login");
            } else if (res.status === 404) {
                setIsUserNotFound(true);
                let errorMessage = `No ${userType} found with this ${inputType === "email" ? "email address" : "mobile number"}.`;

                if (userType === "recruiter") {
                    errorMessage = "Recruiter not found. Please check the email address or contact your company administrator.";
                }

                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: `${userType === 'recruiter' ? 'Recruiter' : 'User'} Not Found`,
                        message: errorMessage,
                    },
                }));
            } else if (res.status === 403) {
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: "Permission Denied",
                        message: data.error || "You don't have permission to reset this password. Please contact your administrator.",
                    },
                }));
            } else {
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: "Failed",
                        message: data.error || "Something went wrong. Please try again.",
                    },
                }));
            }
        } catch (err) {
            console.error("Reset password error:", err);
            setRootContext(prev => ({
                ...prev,
                toast: {
                    show: true,
                    dismiss: true,
                    type: "error",
                    title: "Network Error",
                    message: "Unable to connect. Please check your internet connection and try again.",
                },
            }));
        } finally {
            setLoading(false);
        }
    };

    const renderPasswordInput = (id, label, value, setValue, showKey) => (
        <div className="relative">
            <input
                type={showPassword[showKey] ? "text" : "password"}
                id={id}
                placeholder={label}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                minLength={6}
            />
            <button
                type="button"
                onClick={() =>
                    setShowPassword((prev) => ({
                        ...prev,
                        [showKey]: !prev[showKey],
                    }))
                }
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
                {showPassword[showKey] ? (
                    <EyeSlashIcon className="h-5 w-5" />
                ) : (
                    <EyeIcon className="h-5 w-5" />
                )}
            </button>
        </div>
    );

    return (
        <div>
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
                {/* Close Button */}
                <button
                    onClick={() => setScreen("login")}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white hover:bg-purple-700 transition-colors"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>

                <p className="mb-4 text-sm text-gray-600">
                    Select account type and enter your{" "}
                    <span className="font-semibold">
                        {inputType === "email" ? "email address" : "mobile number"}
                    </span>{" "}
                    to reset your password.
                </p>

                {/* User Type Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                    </label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setUserType("regular")}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${userType === "regular"
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-gray-300 bg-white text-gray-600 hover:border-purple-300"
                                }`}
                        >
                            <UserIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">Regular User</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType("recruiter")}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${userType === "recruiter"
                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                : "border-gray-300 bg-white text-gray-600 hover:border-purple-300"
                                }`}
                        >
                            <BuildingOfficeIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">Recruiter</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    {/* Email/Mobile Input */}
                    <div>
                        <label htmlFor="userInput" className="block text-sm font-medium text-gray-700 mb-1">
                            {userType === "recruiter" ? "Recruiter Email" :
                                inputType === "email" ? "Email Address" : "Mobile Number"}
                        </label>
                        <input
                            type={inputType === "email" ? "email" : "tel"}
                            id="userInput"
                            placeholder={
                                userType === "recruiter" ? "Enter recruiter email" :
                                    inputType === "email" ? "Enter your email" : "Enter your mobile number"
                            }
                            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setIsUserNotFound(false);
                            }}
                            required
                        />
                        {userType === "recruiter" && (
                            <p className="text-xs text-gray-500 mt-1">
                                Enter the email address associated with your recruiter account
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        {renderPasswordInput("newPassword", "Enter new password", newPassword, setNewPassword, "new")}
                        <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        {renderPasswordInput("confirmPassword", "Confirm new password", confirmPassword, setConfirmPassword, "confirm")}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !inputValue || !newPassword || !confirmPassword}
                        className="w-full rounded-lg bg-purple-500 p-3 font-semibold text-white shadow-md transition duration-200 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Resetting Password...
                            </span>
                        ) : (
                            `Reset ${userType === 'recruiter' ? 'Recruiter' : ''} Password`
                        )}
                    </button>
                </form>

                <div className="space-y-3 mt-4">
                    {userType === "regular" && (
                        <button
                            onClick={toggleInputType}
                            className="w-full border border-purple-500 rounded-lg p-3 text-sm font-semibold text-purple-500 transition-colors duration-200 hover:bg-purple-500 hover:text-white"
                        >
                            Use {inputType === "email" ? "mobile number" : "email address"} instead
                        </button>
                    )}

                    <button
                        onClick={toggleUserType}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:border-gray-400"
                    >
                        Switch to {userType === "regular" ? "recruiter" : "regular user"} reset
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setScreen("login")}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                        ← Back to Login
                    </button>
                </div>

                {/* Information Box */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-700">
                            <strong>Note:</strong>
                            {userType === "recruiter"
                                ? " Recruiter password resets require the exact email address registered with your company."
                                : " Regular users can reset using email or mobile number associated with their account."
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* User Not Found Modal */}
            <Modal
                isOpen={isUserNotFound}
                onClose={() => setIsUserNotFound(false)}
                title={`${userType === 'recruiter' ? 'Recruiter' : 'User'} Not Found`}
                icon={<InformationCircleIcon className="h-10 w-10 text-purple-500" />}
            >
                <p className="text-gray-600">
                    {userType === "recruiter"
                        ? "We couldn't find a recruiter account with the email address you provided. Please check the email or contact your company administrator for assistance."
                        : `We couldn't find an account with the ${inputType === "email" ? "email address" : "mobile number"} you provided. Please check the information and try again, or use a different ${inputType === "email" ? "email address" : "mobile number"}.`
                    }
                </p>
            </Modal>
        </div>
    );
}

/* ----------------------------
    Reusable Headless UI Modal
----------------------------- */
function Modal({ isOpen, onClose, title, icon, children }) {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl relative">
                            {/* Close button inside modal */}
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white hover:bg-purple-700 transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>

                            {icon && (
                                <div className="mb-4 flex items-center justify-center">
                                    {icon}
                                </div>
                            )}

                            <Dialog.Title className="text-lg font-bold text-gray-800 mb-2">
                                {title}
                            </Dialog.Title>

                            <div className="text-sm text-gray-600">{children}</div>

                            <button
                                onClick={onClose}
                                className="mt-6 w-full rounded-lg bg-purple-500 p-3 font-semibold text-white shadow-md hover:bg-purple-700 transition-colors"
                            >
                                Close
                            </button>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}