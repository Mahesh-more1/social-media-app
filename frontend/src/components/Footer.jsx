import React from "react";

function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-screen-xl px-4 pb-7 pt-6 sm:px-6 lg:px-8">
          <div className="text-center sm:flex sm:justify-between sm:items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; 2024 SocialApp. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Made By Mahesh With ❤️
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
