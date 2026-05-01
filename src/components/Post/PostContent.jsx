import React, { useState, useEffect, useRef } from "react";
import {
  FaPaperPlane,
  FaThumbsUp,
  FaShare,
  FaHeart,
  FaRegCommentDots,
  FaCamera,
  FaTimes,
} from "react-icons/fa";
import {
  HiDotsVertical,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import { BsBookmark, BsEye } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { AiOutlineLike } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { toggleBookmark } from "../../services/addRemoveBookmark";
import { addComment } from "../../services/addCommnt";
import { likePost } from "../../services/likePost";
import { deletePost } from "../../services/deletePost";
import { updatePost } from "../../services/updatePost";
import { fetchAllLikes } from "../../services/allLikes";
import LikesModal from "./AllLikes";
import { formatDistanceToNow } from "date-fns";

<LikesModal />;

export default function PostCard({
  post,
  profileImg,
  userData,
  allComments,
  isSavedPage = false,
  onUnsave,
  onDeleteSuccess,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [isLiked, setIsLiked] = useState(
    post.likes?.some((user) =>
      user._id ? user._id === userData?._id : user === userData?._id,
    ),
  );
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const [localComments, setLocalComments] = useState(allComments || []);
  const [localCommentsCount, setLocalCommentsCount] = useState(
    post.commentsCount || 0,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.body);
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const editFileInputRef = useRef(null);

  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [likedByUsers, setLikedByUsers] = useState([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);

  let userId = userData?._id || localStorage.getItem("userId");

  useEffect(() => {
    if (post.likes && userData?._id) {
      const checkLiked = post.likes.some((user) =>
        user._id ? user._id === userData.id : user === userData.id,
      );
      setIsLiked(checkLiked);
    }
  }, [post.likes, userData?._id]);

  useEffect(() => {
    setLocalComments(allComments || []);
  }, [allComments]);

  useEffect(() => {
    setLocalCommentsCount(post.commentsCount || 0);
  }, [post.commentsCount]);

  function handleBookmark() {
    toggleBookmark(post._id)
      .then(() => {
        if (isSavedPage && onUnsave) onUnsave(post._id);
      })
      .catch((error) => console.error("Error toggling bookmark:", error));
  }

  function handleLike() {
    const wasLiked = isLiked;
    setIsLiked(!isLiked);
    setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    likePost(post._id)
      .then(() => {})
      .catch(() => {
        setIsLiked(wasLiked);
        setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      });
  }

  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim() && !selectedImage) return;
    const contentToSend = commentText;
    const imageToSend = selectedImage;

    setCommentText("");
    removeImage();

    const formData = new FormData();
    if (contentToSend.trim()) formData.append("content", contentToSend);
    if (imageToSend) formData.append("image", imageToSend);

    addComment(post._id, formData)
      .then((res) => {
        const newCommentFromApi = res.data.comment || res.data.data?.comment;
        const safeComment = {
          ...newCommentFromApi,
          _id: newCommentFromApi?._id || Date.now(),
          commentCreator: newCommentFromApi?.commentCreator || {
            _id: userData?._id,
            name: userData?.name,
            photo: userData?.photo,
          },
        };
        setLocalComments((prev) => [safeComment, ...prev]);
        setLocalCommentsCount((prev) => prev + 1);
      })
      .catch((err) => {
        console.error("Error adding comment:", err);
        setCommentText(contentToSend);
      });
  };

  function handleDelete(postId) {
    console.log("Attempting to delete post with ID:", postId);
    deletePost(postId)
      .then((res) => {
        console.log("Deleted successfully!", res);
        if (onDeleteSuccess) onDeleteSuccess(postId);
      })
      .catch((err) => {
        console.log(
          "Delete failed:",
          err.response?.data?.message || err.message,
        );
      });
  }

  const handleUpdateSubmit = async () => {
    const formData = new FormData();
    formData.append("body", editText);
    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      const res = await updatePost(post._id, formData);
      console.log("Updated Successfully", res.data);

      post.body = editText;
      if (res.data.post?.image) {
        post.image = res.data.post.image;
      }

      setIsEditing(false);
      setEditImage(null);
      setEditPreview(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleShowLikes = async () => {
    setIsLikesModalOpen(true);
    setIsLoadingLikes(true);
    try {
      const res = await fetchAllLikes(post._id);
      setLikedByUsers(res.data?.data?.likes || []);
    } catch (err) {
      console.error("Failed to fetch likes", err);
    } finally {
      setIsLoadingLikes(false);
    }
  };
  console.log(post);

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 w-full relative">
            <img
              className="rounded-full w-10 h-10 border border-gray-100 object-cover"
              src={post.user?.photo || profileImg}
              alt="User"
            />
            <div className="flex-1">
              <h3 className="text-md font-bold text-[#364153]">
                {post.user?.name}
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                {post.createdAt
                  ? formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })
                  : "Just now"}
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <HiDotsVertical size={20} className=" rotate-90" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-20 animate-fade-in">
                    <button
                      onClick={() => {
                        handleBookmark();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <BsBookmark
                        className={
                          isSavedPage ? "text-red-400" : "text-gray-400"
                        }
                      />
                      {isSavedPage ? "Unsave Post" : "Save Post"}
                    </button>

                    {post.user?._id === userId && (
                      <>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            setIsEditing(true);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center gap-3"
                        >
                          <HiOutlinePencilAlt
                            className="text-gray-400"
                            size={18}
                          />
                          Edit Post
                        </button>

                        <button
                          onClick={() => {
                            setShowMenu(false);
                            handleDelete(post._id);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                        >
                          <HiOutlineTrash className="text-red-400" size={18} />
                          Delete Post
                        </button>
                      </>
                    )}

                    {!isSavedPage && (
                      <>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <NavLink
                          to={`/PostDetails/${post._id}`}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center gap-3"
                        >
                          <BsEye className="text-gray-400" /> View Details
                        </NavLink>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Body / Edit Mode */}
        {isEditing ? (
          <div className="mb-6 space-y-4">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none min-h-30 text-[#4b5563] bg-gray-50"
              placeholder="What's on your mind?"
            />
            <div className="flex items-center gap-4">
              <button
                onClick={() => editFileInputRef.current.click()}
                className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"
              >
                <FaCamera /> Change Image
              </button>
              <input
                type="file"
                ref={editFileInputRef}
                onChange={handleEditFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            {(editPreview || post.image) && (
              <div className="relative w-40 h-40 rounded-xl overflow-hidden border">
                <img
                  src={editPreview || post.image}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
                {editPreview && (
                  <button
                    onClick={() => {
                      setEditImage(null);
                      setEditPreview(null);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTimes size={12} />
                  </button>
                )}
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(post.body);
                  setEditPreview(null);
                }}
                className="px-5 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[#4b5563] text-lg mb-6 wrap-break-word whitespace-pre-wrap overflow-hidden">
              {post.body}
            </p>

            {post.image && (
              <div className="w-full h-80 mb-6 rounded-2xl overflow-hidden border border-gray-100">
                <img
                  src={post.image}
                  alt="post content"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <span className="bg-blue-500 text-white p-1.5 rounded-full text-[10px] border-2 border-white shadow-sm">
                <FaThumbsUp />
              </span>
              <span className="bg-red-500 text-white p-1.5 rounded-full text-[10px] border-2 border-white shadow-sm">
                <FaHeart />
              </span>
            </div>
            <span
              onClick={handleShowLikes}
              className="text-gray-500 text-sm font-medium cursor-pointer hover:underline hover:text-blue-600 transition-all"
            >
              {likesCount} likes
            </span>
          </div>
          <div className="flex flex-row">
            <span className="flex items-center gap-0.5 text-gray-500 text-sm font-medium me-2.5">
              <span>{post.sharesCount || 0}</span>
              <BiRepost className="text-lg" />
              <span>shares</span>
            </span>
            <span className="text-gray-500 text-sm font-medium">
              {localCommentsCount} comments
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 py-1 mb-4">
          <button
            onClick={handleLike}
            className={`flex justify-center items-center gap-2 py-2.5 rounded-xl transition-all font-semibold ${
              isLiked
                ? "text-blue-600 bg-blue-50"
                : "text-[#6a7282] hover:bg-gray-50"
            }`}
          >
            <AiOutlineLike
              className={`text-lg ${isLiked ? "text-blue-600" : ""}`}
            />
            <span>Like</span>
          </button>
          <button className="flex justify-center items-center gap-2 py-2.5 text-[#6a7282] hover:bg-gray-50 rounded-xl transition-all font-semibold">
            <FaRegCommentDots className="text-lg" /> <span>Comment</span>
          </button>
          <button className="flex justify-center items-center gap-2 py-2.5 text-[#6a7282] hover:bg-gray-50 rounded-xl transition-all font-semibold">
            <FaShare className="text-lg" /> <span>Share</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="space-y-4 pt-4 border-t border-gray-50">
          {localComments && localComments.length > 0 ? (
            <div className="space-y-4 mb-4">
              {localComments.map((comment, index) => (
                <div
                  key={comment?._id || index}
                  className="flex gap-3 animate-fade-in"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                    <img
                      src={comment?.commentCreator?.photo || profileImg}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#F3F5F7] p-3 rounded-2xl rounded-tl-none inline-block min-w-37.5">
                      <h4 className="text-sm font-bold text-slate-800">
                        {comment?.commentCreator?.name || "User"}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {comment?.content}
                      </p>
                      {comment?.image && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-100 max-w-xs">
                          <img
                            src={comment.image}
                            alt="comment content"
                            className="w-full h-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            post.topComment && (
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                  <img
                    src={post.topComment?.commentCreator?.photo}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="bg-[#F3F5F7] p-3 rounded-2xl rounded-tl-none inline-block min-w-37.5">
                    <h4 className="text-sm font-bold text-slate-800">
                      {post.topComment?.commentCreator?.name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {post.topComment?.content}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}

          {previewUrl && (
            <div className="relative w-24 h-24 ml-10 mb-2 rounded-lg overflow-hidden border border-blue-200 shadow-sm">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
              >
                <FaTimes size={10} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 pt-3 mt-1 border-t border-gray-100">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
              <img
                src={userData?.photo || profileImg}
                alt="me"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                placeholder="Write a comment..."
                className="w-full bg-[#f0f2f5] border-none rounded-full py-1.5 px-4 pr-12 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <FaCamera
                  onClick={handleImageClick}
                  className={`cursor-pointer text-xs ${selectedImage ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim() && !selectedImage}
                  className={`p-1.5 rounded-full transition-all ${
                    commentText.trim() || selectedImage
                      ? "text-blue-500 hover:bg-blue-50 scale-110"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <FaPaperPlane
                    size={14}
                    className={
                      commentText.trim() || selectedImage ? "rotate-45" : ""
                    }
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LikesModal
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        likes={likedByUsers}
        isLoading={isLoadingLikes}
      />
    </>
  );
}
