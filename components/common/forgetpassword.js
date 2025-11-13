"use client";
import React, { useState, Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EyeIcon, EyeSlashIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import RootContext from "../config/rootcontext";

export default function ForgetPassword({ setScreen }) {
    const [inputType, setInputType] = useState("email");
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
        setIsUserNotFound(false); // Reset user not found state when switching input type
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

            // Prepare payload with resetPassword flag
            const payload = {
                resetPassword: true,
                newPassword: newPassword
            };

            // Add either email or mobile based on input type
            if (inputType === "email") {
                payload.email = inputValue;
            } else {
                payload.mobile = inputValue;
            }

            console.log("Sending reset password request:", payload);

            const res = await fetch("/api/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "success",
                        title: "Success",
                        message: "Password reset successfully! You can now login with your new password.",
                    },
                }));
                setNewPassword("");
                setConfirmPassword("");
                setInputValue("");
                setScreen("login");
            } else if (res.status === 404) {
                setIsUserNotFound(true);
                setRootContext(prev => ({
                    ...prev,
                    toast: {
                        show: true,
                        dismiss: true,
                        type: "error",
                        title: "User Not Found",
                        message: `No user found with this ${inputType === "email" ? "email address" : "mobile number"}.`,
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
                {/* Close Button (inside white div, top-right corner) */}
                <button
                    onClick={() => setScreen("login")}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white hover:bg-purple-700 transition-colors"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>

                <p className="mb-6 text-sm text-gray-600">
                    Enter your{" "}
                    <span className="font-semibold">
                        {inputType === "email" ? "email address" : "mobile number"}
                    </span>{" "}
                    and create a new password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    {/* Email/Mobile Input */}
                    <div>
                        <label htmlFor="userInput" className="block text-sm font-medium text-gray-700 mb-1">
                            {inputType === "email" ? "Email Address" : "Mobile Number"}
                        </label>
                        <input
                            type={inputType === "email" ? "email" : "tel"}
                            id="userInput"
                            placeholder={inputType === "email" ? "Enter your email" : "Enter your mobile number"}
                            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setIsUserNotFound(false); // Reset error when user starts typing
                            }}
                            required
                        />
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
                            "Reset Password"
                        )}
                    </button>
                </form>

                <button
                    onClick={toggleInputType}
                    className="mt-4 w-full border border-purple-500 rounded-lg p-3 text-sm font-semibold text-purple-500 transition-colors duration-200 hover:bg-purple-500 hover:text-white"
                >
                    Use {inputType === "email" ? "mobile number" : "email address"} instead
                </button>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setScreen("login")}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                        ← Back to Login
                    </button>
                </div>
            </div>

            {/* User Not Found Modal */}
            <Modal
                isOpen={isUserNotFound}
                onClose={() => setIsUserNotFound(false)}
                title="User Not Found"
                icon={<InformationCircleIcon className="h-10 w-10 text-purple-500" />}
            >
                <p className="text-gray-600">
                    We couldn't find an account with the {inputType === "email" ? "email address" : "mobile number"} you provided.
                    Please check the information and try again, or use a different {inputType === "email" ? "email address" : "mobile number"}.
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