import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import RecruiterPannel from "../components/RecruiterPannel";
import UserNavbar from "../components/job-seeker/UserNavbar";
import {
  RiMoonClearLine,
  RiSunLine,
  RiLogoutBoxRLine,
  RiDeleteBin6Line,
  RiKeyLine,
  RiLock2Line,
} from "@remixicon/react";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import ConfirmModal from "../components/ConfirmModal";
import { useTheme } from "../context/ThemeContext";
import InputField from "../components/ui/InputField";

const Layout = React.memo(({ children, user }) => {
  if (user.role === "recruiter") {
    return (
      <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <RecruiterPannel />
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <UserNavbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">{children}</div>
    </div>
  );
});

const SectionHeader = ({ title }) => (
  <h4 className="text-xs font-medium text-neutral-900 dark:text-white uppercase tracking-wide mb-2">
    {title}
  </h4>
);

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Logout failed.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;

    try {
      await api.patch("/auth/change-password", oldPassword, newPassword);
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update password."
      );
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/auth/delete");
      await logout();
      toast.success("Account deleted.");
      navigate("/signup");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete account.");
    }
  };

  const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

  return (
    <Layout user={user}>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Settings
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <SectionHeader title="Appearance" />
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1 shadow-sm flex items-center">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                theme === "light"
                  ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              <RiSunLine size={18} /> Light
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                theme === "dark"
                  ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              <RiMoonClearLine size={18} /> Dark
            </button>
          </div>
        </section>

        <section>
          <SectionHeader title="Security" />
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <RiLock2Line size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Change Password
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Ensure your account is using a strong password.
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Current Password"
                  type="password"
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                  placeholder="••••••••"
                  icon={RiKeyLine}
                />

                <InputField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  placeholder="Min 8 chars"
                  icon={RiKeyLine}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={!oldPassword || !newPassword}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section>
          <SectionHeader title="Account" />
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-50 dark:bg-neutral-900/20 rounded-lg text-neutral-600 dark:text-neutral-400">
                  <RiLogoutBoxRLine size={20} />
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  Log out of session
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
              >
                Log out
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50/30 dark:bg-red-900/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                  <RiDeleteBin6Line size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    Delete Account
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Permanently remove your data
                  </p>
                </div>
              </div>
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </section>
      </div>

      <ConfirmModal
        show={showDeleteConfirm}
        title="Delete Account?"
        message="This action is irreversible. All your data including applications and saved jobs will be permanently removed."
        confirmText="Delete Account"
        cancelText="Cancel"
        danger={true}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
      />
    </Layout>
  );
};

export default Settings;
