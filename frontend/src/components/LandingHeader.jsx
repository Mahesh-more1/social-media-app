import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

function LandingHeader() {
  const location = useLocation();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="scale-75">
              <Logo />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Pulse
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {location.pathname !== "/sign-up" && (
              <>
                <Link
                  to="/sign-up"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default LandingHeader;
