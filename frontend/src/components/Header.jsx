import React, { useState } from "react";
import { FaBars, FaBell, FaEnvelope, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSocialMedia } from "../store/SocialMediaContext";
import { LOGOUT, SET_SEARCH_QUERY } from "../store/actionTypes";

function Header({ setIsMobileMenuOpen }) {
  const { state, dispatch } = useSocialMedia();
  const searchQuery = state.searchQuery || "";
  const navigate = useNavigate();
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
                    className="block w-full px-6 py-2 border border-gray-300 rounded-full bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-[16px]"
                    placeholder="Search..."
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Section - Navigation and Actions */}
            <div className="flex items-center gap-6 ml-2">
              {/* Mobile Actions */}
              <div className="flex items-center gap-2 sm:hidden">
                <Link
                  to={"/notifications"}
                  className="relative p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  <FaBell className="h-5 w-5" />
                  <span className="absolute top-[2px] right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    9+
                  </span>
                </Link>
                <Link
                  to={"create-post"}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Post
                </Link>
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-3">
                {state.currentUser && (
                  <>
                    {/* Desktop Navigation */}
                    <nav className="hidden sm:flex items-center gap-4 lg:gap-6">
                      {/* "Friends", */}
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
                    <Link
                      to={"/notifications"}
                      className="relative p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    >
                      <FaBell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        9+
                      </span>
                    </Link>

                    <Link
                      to={"Messages"}
                      className="relative p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    >
                      <FaEnvelope className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        3
                      </span>
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
                            alt="Profile"
                            src={state.currentUser?.profilePicture}
                            className="size-8 rounded-full object-cover bg-red-500"
                          />
                        </Link>
                      </button>
                    </div>
                    <Link
                      to={"sign-up"}
                      onClick={handleLogout}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      Log Out
                    </Link>
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
