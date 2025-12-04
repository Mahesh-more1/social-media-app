import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addUserToServer, loginUserToServer } from "../services/userServices";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaMapMarkerAlt,
  FaBriefcase,
  FaAt,
} from "react-icons/fa";
import { useSocialMedia } from "../store/SocialMediaContext";
import { LOGIN } from "../store/actionTypes";

import Logo from "../components/Logo";

function Auth() {
  const { dispatch } = useSocialMedia();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    handle: "",
    location: "",
    profession: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await loginUserToServer({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        dispatch({
          type: LOGIN,
          payload: response.user,
        });

        navigate("/");
      } else {
        const result = await addUserToServer(formData);
        console.log("✅ Signup successful:", result);
        alert("Account created successfully! Please login.");
        setIsLogin(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("❌ Auth error:", error);
      alert(error.message || "Something went wrong!");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 pt-16">
      {/* Left Side - 3D Art & Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden items-center justify-center">
        {/* Abstract Shapes */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>

        <div className="relative z-10 text-center p-12">
          <div className="mb-8 flex justify-center transform hover:scale-110 transition-transform duration-500">
            <div className="scale-150">
              <Logo />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
            Pulse
          </h1>
          <p className="text-xl text-blue-200 max-w-md mx-auto leading-relaxed">
            Connect with your world in real-time. Share moments, catch vibes,
            and stay in the loop.
          </p>
        </div>

        {/* Glass Effect Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {isLogin
                ? "Enter your details to access your account"
                : "Join Pulse today and start your journey"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mb-3">
            <div className="space-y-4">
              {/* Username - Signup Only */}
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              {/* Email */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Handle - Signup Only */}
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaAt className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="handle"
                    value={formData.handle}
                    onChange={handleChange}
                    placeholder="Handle (@username)"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              {/* Location & Profession - Signup Only */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Location"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBriefcase className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      placeholder="Profession"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Confirm Password - Signup Only */}
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-102"
            >
              {isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                  {isLogin ? "New to Pulse?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6  grid grid-cols-1 gap-3">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {isLogin ? "Create an account" : "Sign in to existing account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
