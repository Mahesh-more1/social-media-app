import React from "react";

function Logo({ setSelectedTab }) {
  return (
    <>
      <svg
        className="h-16 w-16"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => setSelectedTab("Home")}
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
