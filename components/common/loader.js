"use client";
import React from 'react';

const Loader = () => {
  return (
    <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Gradient Ring Spinner */}
        <div
          className="
            w-20 h-20
            rounded-full
            animate-spin
            bg-gradient-to-r from-orange-400 via-purple-500 to-purple-700
          "
          style={{
            WebkitMaskImage: 'radial-gradient(farthest-side, transparent 75%, black 76%)',
            maskImage: 'radial-gradient(farthest-side, transparent 75%, black 76%)'
          }}
        ></div>

        {/* Inside Text */}
        <div className="absolute text-lg font-semibold text-gray-700 text-center">
        </div>
      </div>

      {/* Below the spinner */}
      <div className="mt-5 text-xl font-semibold text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-700 text-center">
        Please wait...
      </div>
    </div>
  );
};

export default Loader;
