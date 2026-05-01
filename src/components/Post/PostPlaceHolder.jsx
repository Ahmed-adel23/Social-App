import React from "react";

export default function PostPlaceHolder() {
  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 animate-pulse mb-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            {/* User Photo Circle */}
            <div className="rounded-full w-10 h-10 bg-gray-200"></div>
            <div className="space-y-2">
              {/* User Name Line */}
              <div className="h-3 bg-gray-200 rounded-full w-24"></div>
              {/* Time Line */}
              <div className="h-2 bg-gray-100 rounded-full w-16"></div>
            </div>
          </div>
        </div>

        {/* Post Body Text */}
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 rounded-full w-full"></div>
          <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
        </div>

        {/* Post Image Placeholder */}
        <div className="w-full h-80 mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
          </svg>
        </div>

        {/* Likes and Comments Summary */}
        <div className="flex justify-between pb-4 border-b border-gray-100 mb-2">
          <div className="h-3 bg-gray-100 rounded-full w-20"></div>
          <div className="h-3 bg-gray-100 rounded-full w-20"></div>
        </div>

        {/* Interaction Buttons (Like, Comment, Share) */}
        <div className="grid grid-cols-3 gap-2 py-1 mb-4">
          <div className="h-8 bg-gray-50 rounded-xl w-full"></div>
          <div className="h-8 bg-gray-50 rounded-xl w-full"></div>
          <div className="h-8 bg-gray-50 rounded-xl w-full"></div>
        </div>

        {/* Comment Section Skeleton */}
        <div className="flex gap-3 pt-4 border-t border-gray-50">
          <div className="w-10 h-10 rounded-full bg-gray-100"></div>
          <div className="flex-1 space-y-2">
            <div className="h-12 bg-gray-50 rounded-2xl w-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}
