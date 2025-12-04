import React, { useState } from "react";
import {
  FaHome,
  FaHashtag,
  FaBookmark,
  FaUser,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

import Logo from "./Logo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSocialMedia } from "../store/SocialMediaContext";
import { LOGOUT } from "../store/actionTypes";

function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useSocialMedia();

  const [listItem, setListItem] = useState([
    { icon: FaHome, label: "Home", active: true },
    { icon: FaHashtag, label: "Explore", active: false },
    { icon: FaBookmark, label: "Bookmarks", active: false },

    {
      icon: FaUser,
      label: "Profile",
      active: false,
    },
  ]);

  function labelToPath(label) {
    if (label === "Home") return "/";
    if (label === "Profile") return `/profile/${state.currentUser?.id}`;
    return "/" + label.toLowerCase().replace(/ /g, "-");
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({
        type: LOGOUT,
        payload: null,
      });
      navigate("/sign-up");
    }
  };

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 bottom-0 flex-col justify-between border-r border-gray-100 bg-white dark:bg-gray-900 z-50
          w-64 lg:w-64 2xl:w-72
          md:w-20 
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:flex`}
      >
        {/* Top Section: Logo & Nav */}
        <div className="px-4 py-6 md:px-2 lg:px-4 overflow-y-auto scrollbar-hide flex-1">
          {/* Logo Header */}
          <div className="flex items-center justify-between mb-6 md:justify-center">
            <Link to={"/"} className="block text-teal-600 dark:text-teal-300">
              <span className="sr-only">Home</span>
              <Logo />
            </Link>
            {/* Close button (Mobile Only) */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Navigation Links */}
          <ul className="space-y-2">
            {listItem.map((item, index) => {
              const path = labelToPath(item.label);
              const isActive =
                location.pathname === path ||
                (item.label === "Profile" &&
                  location.pathname.startsWith("/profile"));

              return (
                <li key={index}>
                  <Link
                    to={path}
                    onClick={() => {
                      // Update active state visually
                      const newArr = listItem.map((li, idx) => ({
                        ...li,
                        active: idx === index,
                      }));
                      setListItem(newArr);
                      // Close menu on mobile click
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all
                      md:px-0 md:justify-center lg:px-4 lg:justify-start
                      ${
                        isActive
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                  >
                    <item.icon className="text-xl flex-shrink-0" />
                    <span className="md:hidden lg:block">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Section: Profile & Logout */}
        {state.currentUser && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 md:p-2 lg:p-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between gap-3 md:flex-col lg:flex-row">
              {/* Profile Link */}
              <Link
                to={`profile/${state.currentUser?.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 flex-1 min-w-0 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors md:justify-center lg:justify-start"
              >
                <img
                  loading="lazy"
                  src={state.currentUser?.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
                <div className="min-w-0 md:hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {state.currentUser?.userName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {state.currentUser?.handle}
                  </p>
                </div>
              </Link>

              {/* Logout Button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex-shrink-0"
                >
                  <FaSignOutAlt className="text-xl" />
                </button>
                <span className="text-xs font-medium mt-1 text-gray-500 dark:text-gray-400">
                  Logout
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
