import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Building2,
  Upload,
} from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    avatar: null,
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    showConfirmPassword: false,
    success: false,
    avtarPreview: null,
  });

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return "Confirm password is required";
    if (confirmPassword !== formData.password) return "Passwords do not match";
    return "";
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formState.errors[name]) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: "" },
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
    };

    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormState((prev) => ({ ...prev, loading: true }));

    try {
      // signup API call here

      setTimeout(() => {
        setFormState((prev) => ({
          ...prev,
          loading: false,
          success: true,
        }));
      }, 1500);
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            error.response?.data?.message || "Signup failed. Please try again",
        },
      }));
    }
  };

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Created 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            welcome to JobPortal! Your account has been successfully created.
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-500 mt-2">
            Redirecting to your Dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">
            Join thousands of professionals finding their dream jobs
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                placeholder="Enter your name"
              />
            </div>
            {formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                placeholder="Enter your email"
              />
            </div>
            {formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() =>
                  setFormState((p) => ({
                    ...p,
                    showPassword: !p.showPassword,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {formState.showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={formState.showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() =>
                  setFormState((p) => ({
                    ...p,
                    showConfirmPassword: !p.showConfirmPassword,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {formState.showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {formState.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={formState.loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold"
          >
            {formState.loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
