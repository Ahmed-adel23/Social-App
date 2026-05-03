import React from "react";
import { FaTimes } from "react-icons/fa";

export default function LikesModal({ isOpen, onClose, likes, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up transition-colors">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-gray-200">Likes</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors cursor-pointer"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading likes...</div>
          ) : likes.length > 0 ? (
            likes.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
              >
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-11 h-11 rounded-full object-cover border border-gray-100"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-gray-200">{user.name}</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500">@{user.username}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">No likes yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
