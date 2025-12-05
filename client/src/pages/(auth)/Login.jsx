import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
  RiMailLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiGoogleFill,
  RiLinkedinFill,
  RiGithubFill,
  RiArrowLeftLine,
  RiSparkling2Fill,
} from "@remixicon/react";

const Login = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length > 0) {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      const isLongEnough = value.length >= 8;

      if (!isLongEnough) {
        setPasswordError("Password must be at least 8 characters");
      } else if (!hasUpperCase) {
        setPasswordError("Password must contain an uppercase letter");
      } else if (!hasNumber) {
        setPasswordError("Password must contain a number");
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordError) return;

    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      toast.success("Welcome back! 👋");
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Login failed.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]"></div>
      </div>

      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors z-20"
      >
        <RiArrowLeftLine size={18} /> Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[440px] p-6 sm:p-10 mx-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl shadow-neutral-200/50 dark:shadow-black/50 border border-neutral-200 dark:border-neutral-800"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <RiSparkling2Fill className="text-blue-600 w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-600 transition-colors">
                <RiMailLine size={20} />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="block w-full pl-10 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Password
              </label>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-600 transition-colors">
                <RiLockPasswordLine size={20} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className={`block w-full pl-10 pr-10 py-2.5 bg-neutral-50 dark:bg-neutral-800 border ${
                  passwordError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-neutral-200 dark:border-neutral-700 focus:border-blue-600 focus:ring-blue-500/20"
                } rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all text-sm`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer transition-colors"
              >
                {showPassword ? (
                  <RiEyeOffLine size={20} />
                ) : (
                  <RiEyeLine size={20} />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!!passwordError || isLoading}
            className={`w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2
              ${
                !!passwordError || isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: RiGoogleFill,
              label: "Google",
              provider: "google",
            },
            {
              icon: RiLinkedinFill,
              label: "LinkedIn",
              provider: "linkedin",
            },
            {
              icon: RiGithubFill,
              label: "GitHub",
              provider: "github",
            },
          ].map(({ icon: Icon, label, provider }) => (
            <button
              key={provider}
              onClick={() => {
                window.location.href = `${
                  import.meta.env.VITE_API_URL
                }/api/auth/${provider}`;
              }}
              className={`flex items-center justify-center py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 transition-all duration-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/10`}
              aria-label={`Login with ${label}`}
            >
              <Icon size={22} />
            </button>
          ))}
        </div>

        <p className="text-sm text-neutral-500 text-center mt-8">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline decoration-2 underline-offset-2"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
