import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import {
  RiMailLine,
  RiLockPasswordLine,
  RiUser3Line,
  RiEyeLine,
  RiEyeOffLine,
  RiGoogleFill,
  RiLinkedinFill,
  RiGithubFill,
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiUserSearchLine,
} from "@remixicon/react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";

const Signup = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const roleFromQuery = queryParams.get("role");

  const [role, setRole] = useState(roleFromQuery || "jobseeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (value) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isLongEnough = value.length >= 8;

    if (!isLongEnough) return "Password must be at least 8 characters";
    if (!hasUpperCase) return "Password must contain an uppercase letter";
    if (!hasNumber) return "Password must contain a number";
    return "";
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (val.length > 0) {
      setPasswordError(validatePassword(val));
    } else {
      setPasswordError("");
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/signup", {
        name,
        email,
        password,
        role,
      });
      toast.success("Account created successfully! 🎉");
      navigate("/login");
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Signup failed.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSocialLogin = async (provider) => {
    try {
      await api.post("/auth/social/preference", { role });
      window.location.href = `${
        import.meta.env.VITE_API_URL
      }/api/auth/${provider}`;
    } catch (error) {
      console.error("Social preference error:", error);
      window.location.href = `${
        import.meta.env.VITE_API_URL
      }/api/auth/${provider}`;
    }
  };

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
        className="relative z-10 w-full max-w-[480px] p-6 sm:p-10 mx-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl shadow-neutral-200/50 dark:shadow-black/50 border border-neutral-200 dark:border-neutral-800"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-2">
            Create an Account
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Join thousands of professionals finding their dream jobs
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex gap-1 mb-6">
            <button
              type="button"
              onClick={() => setRole("jobseeker")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                role === "jobseeker"
                  ? "bg-white dark:bg-neutral-700 text-blue-600 dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              <RiBriefcaseLine size={16} />
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                role === "recruiter"
                  ? "bg-white dark:bg-neutral-700 text-blue-600 dark:text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              <RiUserSearchLine size={16} />
              Recruiter
            </button>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-600 transition-colors">
                <RiUser3Line size={20} />
              </div>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="block w-full pl-10 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm"
              />
            </div>
          </div>

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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Password
            </label>
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
                placeholder="Min. 8 chars"
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
          <Button
            type="submit"
            disabled={!!passwordError || isLoading}
            className={`w-full
              ${
                !!passwordError || isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500">
              Or sign up with
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
              onClick={() => handleSocialLogin(provider)}
              className={`flex items-center justify-center py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 transition-all duration-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/10`}
              aria-label={`Sign up with ${label}`}
            >
              <Icon size={22} />
            </button>
          ))}
        </div>

        <p className="text-sm text-neutral-500 text-center mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline decoration-2 underline-offset-2"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
