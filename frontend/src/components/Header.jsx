import React, { useEffect } from "react";
import { FaBell, FaEnvelope, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSocialMedia } from "../store/SocialMediaContext";
import {
  LOGOUT,
  SET_SEARCH_QUERY,
  LOAD_NOTIFICATIONS,
  LOAD_CONVERSATIONS,
} from "../store/actionTypes";
import { getNotificationsFromServer } from "../services/notificationServices";
import { getConversationsFromServer } from "../services/messageServices";

import Logo from "./Logo";

function Header({ setIsMobileMenuOpen }) {
  const { state, dispatch } = useSocialMedia();
  const searchQuery = state.searchQuery || "";
  const navigate = useNavigate();

  // 1. Calculate Dynamic Counts
  const unreadNotifications = state.notifications.filter(
    (n) => !n.isRead
  ).length;
  const unreadMessages = state.conversations.reduce(
    (total, convo) => total + (convo.unreadCount || 0),
    0
  );

  // 2. Helper to format large numbers (e.g., 100 -> "99+")
  const formatBadgeCount = (count) => {
    return count > 99 ? "99+" : count;
  };

  // 3. Fetch Data on Mount & Poll for Updates
  useEffect(() => {
    if (!state.currentUser) return;

    const fetchData = async () => {
      try {
        // Fetch Notifications
        const notifications = await getNotificationsFromServer();
        dispatch({ type: LOAD_NOTIFICATIONS, payload: notifications });

        // Fetch Conversations (for message count)
        const conversations = await getConversationsFromServer();
        dispatch({ type: LOAD_CONVERSATIONS, payload: conversations });
      } catch (error) {
        console.error("Header data fetch failed:", error);
      }
    };

    fetchData(); // Initial fetch

    // Poll every 10 seconds to keep badges "realistic" and up-to-date
    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, [state.currentUser, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate("search");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({
      type: LOGOUT,
      payload: null,
    });

    navigate("/auth");
    alert("Logged out successfully!");
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-14">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo and Search */}
            <div className="flex items-center gap-4 flex-1">
              {/* Logo - Visible on all screens */}
              {/* Logo - Visible ONLY on small screens */}
              <Link
                to="/"
                className="flex-shrink-0 flex items-center gap-2 md:hidden"
              >
                <div className="">
                  <Logo className="h-10 w-10" />
                </div>
              </Link>

              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <form className="relative" onSubmit={(e) => handleSearch(e)}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      dispatch({
                        type: SET_SEARCH_QUERY,
                        payload: e.target.value,
                      })
                    }
                    className="block w-full px-4 py-2 pl-10 border border-gray-300 rounded-full bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm sm:text-base"
                    placeholder="Search..."
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Section - Navigation and Actions */}
            <div className="flex items-center gap-2 sm:gap-6 ml-2">
              {/* Mobile Actions (Profile & Notifications) */}
              <div className="flex items-center gap-3 sm:hidden">
                <Link
                  to={"/notifications"}
                  className="relative p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  <FaBell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-[2px] right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                      {formatBadgeCount(unreadNotifications)}
                    </span>
                  )}
                </Link>

                <Link to={`profile/${state.currentUser?.id}`}>
                  <img
                    loading="lazy"
                    alt="Profile"
                    src={state.currentUser?.profilePicture}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                </Link>
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-3">
                {state.currentUser && (
                  <>
                    {/* Desktop Navigation */}
                    <nav className="hidden sm:flex items-center gap-4 lg:gap-6">
                      {["Photos"].map((item) => (
                        <Link
                          to={item}
                          key={item}
                          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
                          href="#"
                        >
                          {item}
                        </Link>
                      ))}
                    </nav>

                    {/* Notification Icon */}
                    <Link
                      to={"/notifications"}
                      className="relative p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    >
                      <FaBell className="h-5 w-5" />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {formatBadgeCount(unreadNotifications)}
                        </span>
                      )}
                    </Link>

                    {/* Message Icon */}
                    <Link
                      to={"Messages"}
                      className="relative p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    >
                      <FaEnvelope className="h-5 w-5" />
                      {unreadMessages > 0 && (
                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {formatBadgeCount(unreadMessages)}
                        </span>
                      )}
                    </Link>

                    <Link
                      to={"create-post"}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      Create
                    </Link>
                    <div className="relative">
                      <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Link to={`profile/${state.currentUser?.id}`}>
                          <img
                            loading="lazy"
                            alt="Profile"
                            src={state.currentUser?.profilePicture}
                            className="size-8 rounded-full object-cover bg-red-500"
                          />
                        </Link>
                      </button>
                    </div>
                  </>
                )}

                {!state.currentUser && (
                  <Link
                    to={"sign-up"}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
