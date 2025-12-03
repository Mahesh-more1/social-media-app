import {
  FaHome,
  FaHashtag,
  FaBell,
  FaEnvelope,
  FaBookmark,
  FaChartBar,
  FaUsers,
  FaCalendarAlt,
  FaUser,
  FaChevronDown,
  FaSignOutAlt,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import "./App";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="flex relative">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Sidebar - Responsive */}
        <div
          className={`fixed top-0 left-0 bottom-0 flex-col justify-between border-e border-gray-100 bg-white dark:bg-gray-900 z-50
          w-64 lg:w-60 xl:w-64 2xl:w-72
          md:w-20
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:flex`}
        >
          <div className="px-4 py-6 md:px-2 lg:px-4 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-hide ">
            {/* Logo and Close Button */}
            <div className="flex items-center justify-between mb-6 md:justify-center">
              <a className="block text-teal-600 dark:text-teal-300" href="#">
                <span className="sr-only">Home</span>
                <svg
                  className="h-16 w-16"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="cubeGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      {/* Updated colors to match sidebar theme */}
                      <stop offset="0%" stopColor="#3B82F6" /> {/* Blue-500 */}
                      <stop offset="50%" stopColor="#6366F1" />{" "}
                      {/* Indigo-500 */}
                      <stop offset="100%" stopColor="#8B5CF6" />{" "}
                      {/* Violet-500 */}
                    </linearGradient>
                    <linearGradient
                      id="shadowGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
                      <stop
                        offset="100%"
                        stopColor="#000000"
                        stopOpacity="0.05"
                      />
                    </linearGradient>
                  </defs>

                  {/* Shadow */}
                  <ellipse
                    cx="70"
                    cy="105"
                    rx="20"
                    ry="5"
                    fill="url(#shadowGradient)"
                  />

                  {/* 3D Cube Faces */}
                  <path
                    d="M30 40 L70 20 L70 60 L30 80 Z"
                    fill="url(#cubeGradient)"
                  />
                  <path
                    d="M30 40 L70 20 L110 40 L70 60 Z"
                    fill="url(#cubeGradient)"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M70 20 L110 40 L110 80 L70 60 Z"
                    fill="url(#cubeGradient)"
                    fillOpacity="0.6"
                  />

                  {/* Connection Nodes */}
                  <circle cx="45" cy="55" r="4" fill="#ffffff" opacity="0.9" />
                  <circle cx="65" cy="35" r="3" fill="#ffffff" opacity="0.8" />
                  <circle cx="85" cy="55" r="3" fill="#ffffff" opacity="0.8" />

                  {/* Connection Lines */}
                  <path
                    d="M45 55 L65 35 M65 35 L85 55 M45 55 L85 55"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                </svg>
              </a>
              {/* Close button for mobile */}
              <button
                className="md:hidden p-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Navigation Menu */}
            <ul className="space-y-2">
              {[
                { icon: FaHome, label: "Home", active: true },
                { icon: FaHashtag, label: "Explore" },
                { icon: FaBell, label: "Notifications", dropdown: true },
                { icon: FaEnvelope, label: "Messages", badge: 3 },
                { icon: FaBookmark, label: "Bookmarks" },
                { icon: FaChartBar, label: "Analytics" },
                { icon: FaUsers, label: "Communities", dropdown: true },
                { icon: FaCalendarAlt, label: "Events" },
                { icon: FaUser, label: "Profile", dropdown: true },
              ].map((item, index) => (
                <li key={index}>
                  {item.dropdown ? (
                    <details className="group [&_summary::-webkit-details-marker]:hidden">
                      <summary
                        className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all
            md:px-8 md:justify-center lg:px-4 lg:justify-start
            ${
              item.active
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
                      >
                        <div className="flex items-center gap-3 md:gap-0 lg:gap-3 flex-1">
                          <item.icon className="text-lg md:text-xl lg:text-lg flex-shrink-0" />
                          <span className="md:hidden lg:block">
                            {item.label}
                          </span>
                        </div>
                        <FaChevronDown className="size-3 transition duration-300 group-open:-rotate-180 md:hidden lg:block flex-shrink-0" />
                      </summary>
                      <ul className="mt-2 space-y-1 px-4 md:hidden lg:block">
                        <li>
                          <a
                            href="#"
                            className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span>All {item.label}</span>
                          </a>
                        </li>
                      </ul>
                    </details>
                  ) : (
                    <a
                      href="#"
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all
            md:px-3 md:justify-center lg:px-4 lg:justify-start
            ${
              item.active
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="text-lg md:text-xl lg:text-lg flex-shrink-0" />
                      <span className="md:hidden lg:block flex-1">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 md:hidden lg:flex flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* User Profile */}
          <div className="border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <a
              href="#"
              className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all
                md:px-3 md:justify-center lg:px-4 lg:justify-start"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <img
                alt="Profile"
                src="https://preview.redd.it/can-someone-give-me-hd-or-higher-quality-photo-of-virat-v0-wn08gbwghx5f1.jpeg?width=1252&auto=webp&s=a8e816d643481f32074a5fb96756db9a2e5e4a0b"
                className="size-10 rounded-full object-cover bg-red-500 md:size-8 lg:size-10"
              />
              <div className="md:hidden lg:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Virat Kohli
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  @virat.kohali
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="flex flex-col min-h-screen w-full
          md:ml-20 lg:ml-60 xl:ml-64 2xl:ml-72
          transition-all duration-300 ease-in-out"
        >
          {/* Header */}
          <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Left Section - Menu Button and Search */}
                <div className="flex items-center gap-4 flex-1">
                  {/* Mobile Menu Button */}
                  <button
                    className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <FaBars className="text-lg" />
                  </button>

                  {/* Search Bar */}
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
                        placeholder="Search..."
                      />
                    </div>
                  </div>
                </div>

                {/* Right Section - Navigation and Actions */}
                <div className="flex items-center gap-3">
                  {/* Mobile Actions */}
                  <div className="flex items-center gap-2 sm:hidden">
                    <button className="relative p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                      <FaBell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        3
                      </span>
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                      Post
                    </button>
                  </div>

                  {/* Desktop Navigation */}
                  <nav className="hidden sm:flex items-center gap-4 lg:gap-6">
                    {["Feed", "Friends", "Photos"].map((item) => (
                      <a
                        key={item}
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
                        href="#"
                      >
                        {item}
                      </a>
                    ))}
                  </nav>

                  {/* Desktop Actions */}
                  <div className="hidden sm:flex items-center gap-3">
                    <button className="relative p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                      <FaBell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        9+
                      </span>
                    </button>

                    <button className="relative p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                      <FaEnvelope className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        3
                      </span>
                    </button>

                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                      Create
                    </button>

                    <div className="relative">
                      <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <img
                          alt="Profile"
                          src="https://preview.redd.it/can-someone-give-me-hd-or-higher-quality-photo-of-virat-v0-wn08gbwghx5f1.jpeg?width=1252&auto=webp&s=a8e816d643481f32074a5fb96756db9a2e5e4a0b"
                          className="size-8 rounded-full object-cover bg-red-500"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
            <div className="max-w-4xl mx-auto">
              {/* Welcome Card */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to SocialApp!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  This is a fully responsive social media layout. The sidebar is
                  hidden on mobile and can be toggled with the menu button.
                </p>
              </div>

              {/* Sample Posts */}
              <div className="space-y-4">
                {[1, 2, 3].map((post) => (
                  <div
                    key={post}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 sm:p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-10 bg-blue-500 rounded-full"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          User {post}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      This is sample post content #{post}. The layout adapts
                      perfectly to all screen sizes.
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <span>❤️</span> 24
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <span>💬</span> 8
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <span>🔄</span> 3
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="text-center sm:flex sm:justify-between sm:items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  &copy; 2024 SocialApp. All rights reserved.
                </p>
                <div className="mt-3 sm:mt-0">
                  <ul className="flex flex-wrap justify-center gap-4 text-sm">
                    {["Terms", "Privacy", "Cookies", "Help"].map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
So now if I want to make these in the separate separate components then what should I do No need to give the just give me what to copy to tested and which to import and what to do  Before that I am giving you what I have done If that right then tell me it is right Nothing else import { useState } from "react";
import "./App";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./pages/Footer";
import Home from "./pages/Home";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="flex relative">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Content */}
        <div
          className="flex flex-col min-h-screen w-full
          md:ml-20 lg:ml-60 xl:ml-64 2xl:ml-72
          transition-all duration-300 ease-in-out"
        >
          <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />

          <Home />

          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
import React from "react";
import { FaBars, FaBell, FaEnvelope, FaSearch } from "react-icons/fa";

function Header({setIsMobileMenuOpen}) {
  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Menu Button and Search */}
            <div className="flex items-center gap-4 flex-1">
              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <FaBars className="text-lg" />
              </button>

              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
                    placeholder="Search..."
                  />
                </div>
              </div>
            </div>

            {/* Right Section - Navigation and Actions */}
            <div className="flex items-center gap-3">
              {/* Mobile Actions */}
              <div className="flex items-center gap-2 sm:hidden">
                <button className="relative p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  <FaBell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  Post
                </button>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden sm:flex items-center gap-4 lg:gap-6">
                {["Feed", "Friends", "Photos"].map((item) => (
                  <a
                    key={item}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
                    href="#"
                  >
                    {item}
                  </a>
                ))}
              </nav>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-3">
                <button className="relative p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  <FaBell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    9+
                  </span>
                </button>

                <button className="relative p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  <FaEnvelope className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                  Create
                </button>

                <div className="relative">
                  <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <img
                      alt="Profile"
                      src="https://preview.redd.it/can-someone-give-me-hd-or-higher-quality-photo-of-virat-v0-wn08gbwghx5f1.jpeg?width=1252&auto=webp&s=a8e816d643481f32074a5fb96756db9a2e5e4a0b"
                      className="size-8 rounded-full object-cover bg-red-500"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
import {
  FaHome,
  FaHashtag,
  FaBell,
  FaEnvelope,
  FaBookmark,
  FaChartBar,
  FaUsers,
  FaCalendarAlt,
  FaUser,
  FaChevronDown,
  FaSignOutAlt,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Logo from "./Logo";
function Sidebar({isMobileMenuOpen,setIsMobileMenuOpen}) {
  return (
    <>
      {/* Sidebar - Responsive */}
      <div
        className={`fixed top-0 left-0 bottom-0 flex-col justify-between border-e border-gray-100 bg-white dark:bg-gray-900 z-50
          w-64 lg:w-60 xl:w-64 2xl:w-72
          md:w-20
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:flex`}
      >
        <div className="px-4 py-6 md:px-2 lg:px-4 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-hide ">
          {/* Logo and Close Button */}
          <div className="flex items-center justify-between mb-6 md:justify-center">
            <a className="block text-teal-600 dark:text-teal-300" href="#">
              <span className="sr-only">Home</span>
              <Logo />
            </a>
            {/* Close button for mobile */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Navigation Menu */}
          <ul className="space-y-2">
            {[
              { icon: FaHome, label: "Home", active: true },
              { icon: FaHashtag, label: "Explore" },
              { icon: FaBell, label: "Notifications", dropdown: true },
              { icon: FaEnvelope, label: "Messages", badge: 3 },
              { icon: FaBookmark, label: "Bookmarks" },
              { icon: FaChartBar, label: "Analytics" },
              { icon: FaUsers, label: "Communities", dropdown: true },
              { icon: FaCalendarAlt, label: "Events" },
              { icon: FaUser, label: "Profile", dropdown: true },
            ].map((item, index) => (
              <li key={index}>
                {item.dropdown ? (
                  <details className="group [&_summary::-webkit-details-marker]:hidden">
                    <summary
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all
            md:px-8 md:justify-center lg:px-4 lg:justify-start
            ${
              item.active
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
                    >
                      <div className="flex items-center gap-3 md:gap-0 lg:gap-3 flex-1">
                        <item.icon className="text-lg md:text-xl lg:text-lg flex-shrink-0" />
                        <span className="md:hidden lg:block">{item.label}</span>
                      </div>
                      <FaChevronDown className="size-3 transition duration-300 group-open:-rotate-180 md:hidden lg:block flex-shrink-0" />
                    </summary>
                    <ul className="mt-2 space-y-1 px-4 md:hidden lg:block">
                      <li>
                        <a
                          href="#"
                          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          <span>All {item.label}</span>
                        </a>
                      </li>
                    </ul>
                  </details>
                ) : (
                  <a
                    href="#"
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all
            md:px-3 md:justify-center lg:px-4 lg:justify-start
            ${
              item.active
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="text-lg md:text-xl lg:text-lg flex-shrink-0" />
                    <span className="md:hidden lg:block flex-1">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 md:hidden lg:flex flex-shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <a
            href="#"
            className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all
                md:px-3 md:justify-center lg:px-4 lg:justify-start"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img
              alt="Profile"
              src="https://preview.redd.it/can-someone-give-me-hd-or-higher-quality-photo-of-virat-v0-wn08gbwghx5f1.jpeg?width=1252&auto=webp&s=a8e816d643481f32074a5fb96756db9a2e5e4a0b"
              className="size-10 rounded-full object-cover bg-red-500 md:size-8 lg:size-10"
            />
            <div className="md:hidden lg:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Virat Kohli
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @virat.kohali
              </p>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}

export default Sidebar;import React from "react";

function Home() {
  return (
    <>
      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to SocialApp!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              This is a fully responsive social media layout. The sidebar is
              hidden on mobile and can be toggled with the menu button.
            </p>
          </div>

          {/* Sample Posts */}
          <div className="space-y-4">
            {[1, 2, 3].map((post) => (
              <div
                key={post}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 bg-blue-500 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      User {post}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      2 hours ago
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  This is sample post content #{post}. The layout adapts
                  perfectly to all screen sizes.
                </p>
                <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <span>❤️</span> 24
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <span>💬</span> 8
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <span>🔄</span> 3
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
import React from "react";

function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center sm:flex sm:justify-between sm:items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; 2024 SocialApp. All rights reserved.
            </p>
            <div className="mt-3 sm:mt-0">
              <ul className="flex flex-wrap justify-center gap-4 text-sm">
                {["Terms", "Privacy", "Cookies", "Help"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
import React from "react";

function Logo() {
  return (
    <>
      <svg
        className="h-16 w-16"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {/* Updated colors to match sidebar theme */}
            <stop offset="0%" stopColor="#3B82F6" /> {/* Blue-500 */}
            <stop offset="50%" stopColor="#6366F1" /> {/* Indigo-500 */}
            <stop offset="100%" stopColor="#8B5CF6" /> {/* Violet-500 */}
          </linearGradient>
          <linearGradient
            id="shadowGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="70" cy="105" rx="20" ry="5" fill="url(#shadowGradient)" />

        {/* 3D Cube Faces */}
        <path d="M30 40 L70 20 L70 60 L30 80 Z" fill="url(#cubeGradient)" />
        <path
          d="M30 40 L70 20 L110 40 L70 60 Z"
          fill="url(#cubeGradient)"
          fillOpacity="0.8"
        />
        <path
          d="M70 20 L110 40 L110 80 L70 60 Z"
          fill="url(#cubeGradient)"
          fillOpacity="0.6"
        />

        {/* Connection Nodes */}
        <circle cx="45" cy="55" r="4" fill="#ffffff" opacity="0.9" />
        <circle cx="65" cy="35" r="3" fill="#ffffff" opacity="0.8" />
        <circle cx="85" cy="55" r="3" fill="#ffffff" opacity="0.8" />

        {/* Connection Lines */}
        <path
          d="M45 55 L65 35 M65 35 L85 55 M45 55 L85 55"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.5"
        />
      </svg>
    </>
  );
}

export default Logo;

