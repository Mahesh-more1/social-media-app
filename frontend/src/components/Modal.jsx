import React from "react";
import { FaTimes } from "react-icons/fa";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full  max-h-[90vh] overflow-auto scrollbar-hide relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 z-10"
        >
          <FaTimes className="text-xl" />
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
