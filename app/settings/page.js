"use client";
import RootContext from "@/components/config/rootcontext";
import React, { useState, useEffect, useContext } from "react";

const AnimatedBorderLoader = () => {
  return (
    <div
      className={`
        relative w-full max-w-[150px] h-10
        flex items-center justify-center
        rounded-lg overflow-hidden
        bg-white
      `}
    >
      <span className="absolute top-0 left-0 h-0.5 w-0 bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500 animate-drawLineTop" />
      <span className="absolute top-0 right-0 w-0.5 h-0 bg-gradient-to-b from-orange-400 via-purple-500 to-pink-500 animate-drawLineRight" />
      <span className="absolute bottom-0 right-0 h-0.5 w-0 bg-gradient-to-l from-orange-400 via-purple-500 to-pink-500 animate-drawLineBottom" />
      <span className="absolute bottom-0 left-0 w-0.5 h-0 bg-gradient-to-t from-orange-400 via-purple-500 to-pink-500 animate-drawLineLeft" />
      <div className="relative z-10 font-semibold text-gray-700 dark:text-gray-300 text-center">
        Update profile
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const [showLoader, setShowLoader] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const { rootContext, setRootContext } = useContext(RootContext);

  const [username, setUsername] = useState(rootContext.user.name || "bheema");
  const [email, setEmail] = useState(rootContext.user.email || "bheema@gmail.com");

  // Track local editable form values separately
  const [formUsername, setFormUsername] = useState(username);
  const [formEmail, setFormEmail] = useState(email);
  const [notification, setNotification] = useState(rootContext.notification || false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    const updatedUser = {
      ...rootContext.user,
      name: formUsername,
      email: formEmail,
    };

    setRootContext((prev) => ({
      ...prev,
      user: updatedUser,
      toast: {
        show: true,
        dismiss: true,
        type: "success",
        title: "Profile Updated",
        message: "Your profile details were successfully updated.",
      },
    }));

    localStorage.setItem("user_details", JSON.stringify(updatedUser));

    // Update display state
    setUsername(formUsername);
    setEmail(formEmail);
    setEditMode(false);
  };

  const handleCancel = () => {
    // Reset input fields
    setFormUsername(username);
    setFormEmail(email);
    setEditMode(false);
  };

  const onNotificationChange = (e) => {
    const isChecked = e.target.checked;
    setNotification(isChecked);

    setRootContext((prev) => ({
      ...prev,
      notification: isChecked,
      toast: {
        show: true,
        dismiss: true,
        type: "success",
        title: "Notification Updated",
        message: `Email notifications have been ${isChecked ? "enabled" : "disabled"}.`,
      },
    }));
  };


  return (
    <div className="p-1 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      <div className="space-y-4">
        <div className="p-6 rounded-2xl shadow-md bg-white dark:bg-slate-800">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
            Account Settings
          </h2>

          <div className="space-y-4">
            {!editMode ? (
              <>
                <div className="text-gray-800 dark:text-white">
                  <p><strong>Name:</strong> {username}</p>
                  <p><strong>Email:</strong> {email}</p>
                </div>
                {showLoader ? (
                  <AnimatedBorderLoader />
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="w-full max-w-[150px] h-10 bg-blue-100 text-black rounded-lg hover:bg-blue-200"
                  >
                    Edit Profile
                  </button>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
                  placeholder="Username"
                />
                <input
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white"
                  placeholder="Email"
                />
                <div></div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 h-10 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 h-10 rounded-lg bg-gradient-to-r from-orange-400 via-purple-500 to-purple-700 hover:from-orange-500 hover:via-purple-600 hover:to-purple-800"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl shadow-md bg-white dark:bg-slate-800">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
            Preferences
          </h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-800 dark:text-white">Email Notifications</span>
            <input type="checkbox" checked={notification} onChange={onNotificationChange} className="toggle toggle-primary" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-800 dark:text-white">Enable Dark Mode</span>
            <input type="checkbox" className="toggle toggle-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
