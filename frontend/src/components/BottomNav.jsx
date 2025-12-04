import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCompass,
  FaPlusSquare,
  FaEnvelope,
  FaImage,
} from "react-icons/fa";
import { useSocialMedia } from "../store/SocialMediaContext";

function BottomNav() {
  const { state } = useSocialMedia();
  const location = useLocation();

  if (!state.currentUser) return null;

  const navItems = [
    { path: "/", icon: FaHome, label: "Home" },
    { path: "/explore", icon: FaCompass, label: "Explore" },
    { path: "/create-post", icon: FaPlusSquare, label: "Create" },
    { path: "/messages", icon: FaEnvelope, label: "Messages" },
    { path: "/photos", icon: FaImage, label: "Photos" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 md:hidden z-50 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <item.icon
                className={`text-xl ${isActive ? "transform scale-110" : ""}`}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default BottomNav;
