import React, { useState, useContext, useRef } from "react";
import { FaImage, FaPaperPlane, FaTimes } from "react-icons/fa";
import { UserContext } from "../../App";
import { AddPost } from "../../services/createPost";
import { LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";

export default function PostCreateCard({ onPostCreated }) {
  const { userData } = useContext(UserContext);
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsExpanded(true);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    fileInputRef.current.value = "";
  };

  const handlePostSubmit = () => {
    if (!postContent.trim() && !selectedImage) return;
    setIsLoading(true);

    const formData = new FormData();
    if (postContent.trim()) formData.append("body", postContent);
    if (selectedImage) formData.append("image", selectedImage);

    AddPost(formData)
      .then(() => {
        setPostContent("");
        removeImage();
        setIsExpanded(false);
        if (onPostCreated) onPostCreated();
      })
      .catch(() => toast.error("Failed to create post"))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 dark:border-gray-600 shrink-0">
          <img
            src={userData?.photo}
            alt={userData?.name || "user"}
            className="w-full h-full object-cover"
          />
        </div>

        <input
          type="text"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={(e) => e.key === "Enter" && handlePostSubmit()}
          placeholder={`What's on your mind, ${userData?.name?.split(" ")[0] || "User"}?`}
          className="flex-1 bg-[#f0f2f5] dark:bg-gray-700 dark:text-gray-200 rounded-full py-2.5 px-4 text-sm outline-none border border-transparent focus:border-blue-200 dark:focus:border-blue-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current.click()}
          disabled={isLoading}
          className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer text-gray-500 dark:text-gray-400 disabled:opacity-50"
          title="Add photo"
        >
          <FaImage className={selectedImage ? "text-blue-500" : ""} />
        </button>

        <button
          onClick={handlePostSubmit}
          disabled={isLoading || (!postContent.trim() && !selectedImage)}
          className="p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-90"
          title="Post"
        >
          {isLoading ? (
            <LuLoader className="animate-spin" size={16} />
          ) : (
            <FaPaperPlane size={14} />
          )}
        </button>
      </div>

      {isExpanded && previewUrl && (
        <div className="mt-3 animate-fade-in">
          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-600">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-gray-800/60 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors cursor-pointer"
            >
              <FaTimes size={12} />
            </button>
          </div>
        </div>
      )}

      {postContent && postContent.length > 0 && postContent.length < 3 && (
        <p className="text-xs text-red-400 mt-2 ml-13 animate-pulse">
          Post must be at least 3 characters
        </p>
      )}
    </div>
  );
}
