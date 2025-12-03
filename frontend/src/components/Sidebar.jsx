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
  FaTimes,
} from "react-icons/fa";
import Logo from "./Logo";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSocialMedia } from "../store/SocialMediaContext";

function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const location = useLocation();
  const { state } = useSocialMedia();
  const [listItem, setListItem] = useState([
    { icon: FaHome, label: "Home", active: true },
    { icon: FaHashtag, label: "Explore", active: false },
    // {
    //   icon: FaBell,
    //   label: "Notifications",
    //   active: false,
    // },
    // {
    //   icon: FaEnvelope,
    //   label: "Messages",
    //   badge: 3,
    //   active: false,
    // },
    { icon: FaBookmark, label: "Bookmarks", active: false },
    // { icon: FaChartBar, label: "Analytics", active: false },
    // {
    //   icon: FaUsers,
    //   label: "Communities",
    //   active: false,
    // },
    // { icon: FaCalendarAlt, label: "Events", active: false },
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
            <Link to={"/"} className="block text-teal-600 dark:text-teal-300">
              <span className="sr-only">Home</span>
              <Logo />
            </Link>
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
            {listItem.map((item, index) => {
              const path = labelToPath(item.label);
              const isActive =
                location.pathname === path ||
                (item.label === "Profile" &&
                  location.pathname.startsWith("/profile"));
              return (
                <li
                  key={index}
                  onClick={() => {
                    const newArr = listItem.map((li, idx) => {
                      if (idx === index) {
                        return { ...li, active: true };
                      } else {
                        return { ...li, active: false };
                      }
                    });
                    setListItem(newArr);
                  }}
                >
                  <Link
                    to={labelToPath(item.label)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all
      md:px-3 md:justify-center lg:px-4 lg:justify-start
      ${
        isActive
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
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <Link
            to={`profile/${state.currentUser?.id}`}
            className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all
                md:px-3 md:justify-center lg:px-4 lg:justify-start"
            onClick={() => {
              setIsMobileMenuOpen(false);
            }}
          >
            <img
              alt="Profile"
              src={state.currentUser?.profilePicture}
              className="size-10 rounded-full object-cover bg-red-500 md:size-8 lg:size-10"
            />
            <div className="md:hidden lg:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {state.currentUser?.userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {state.currentUser?.handle}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
