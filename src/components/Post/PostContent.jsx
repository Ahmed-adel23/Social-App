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
import { BsBookmark, BsBookmarkFill, BsEye } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { toggleBookmark } from "../../services/addRemoveBookmark";
import { addComment } from "../../services/addCommnt";
import { likePost } from "../../services/likePost";
import { deletePost } from "../../services/deletePost";
import { updatePost } from "../../services/updatePost";
import { fetchAllLikes } from "../../services/allLikes";
import { fetchComments } from "../../services/comments";
import LikesModal from "./AllLikes";
import { formatDistanceToNow } from "date-fns";

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
  const [likeAnimating, setLikeAnimating] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(isSavedPage);
  const [bookmarkAnimating, setBookmarkAnimating] = useState(false);

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

  const [showComments, setShowComments] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(false);

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
    setBookmarkAnimating(true);
    setTimeout(() => setBookmarkAnimating(false), 400);
    const wasBookmarked = isBookmarked;
    setIsBookmarked(!isBookmarked);
    toggleBookmark(post._id)
      .then(() => {
        if (isSavedPage && onUnsave) onUnsave(post._id);
      })
      .catch((error) => {
        setIsBookmarked(wasBookmarked);
        console.error("Error toggling bookmark:", error);
      });
  }

  function handleLike() {
    const wasLiked = isLiked;
    setIsLiked(!isLiked);
    setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    if (!wasLiked) {
      setLikeAnimating(true);
      setTimeout(() => setLikeAnimating(false), 300);
    }
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
    deletePost(postId)
      .then((res) => {
        if (onDeleteSuccess) onDeleteSuccess(postId);
      })
      .catch((err) => {
        console.log("Delete failed:", err.response?.data?.message || err.message);
      });
  }

  const handleUpdateSubmit = async () => {
    const formData = new FormData();
    formData.append("body", editText);
    if (editImage) formData.append("image", editImage);
    try {
      const res = await updatePost(post._id, formData);
      post.body = editText;
      if (res.data.post?.image) post.image = res.data.post.image;
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

  const handleToggleComments = () => {
    const willShow = !showComments;
    setShowComments(willShow);
    if (willShow && !commentsLoaded) {
      setIsLoadingComments(true);
      fetchComments(post._id, 1)
        .then((res) => {
          const data = res.data?.comments || res.data?.data?.comments || [];
          const paging = res.data?.paginationInfo || res.data?.data?.paginationInfo;
          setLocalComments(data);
          setCommentsPage(1);
          setHasMoreComments(
            paging ? paging.currentPage < paging.numberOfPages : data.length >= 25,
          );
          setCommentsLoaded(true);
        })
        .catch((err) => console.error("Error fetching comments:", err))
        .finally(() => setIsLoadingComments(false));
    }
  };

  const loadMoreComments = () => {
    if (isLoadingMoreComments || !hasMoreComments) return;
    const nextPage = commentsPage + 1;
    setIsLoadingMoreComments(true);
    fetchComments(post._id, nextPage)
      .then((res) => {
        const data = res.data?.comments || res.data?.data?.comments || [];
        const paging = res.data?.paginationInfo || res.data?.data?.paginationInfo;
        setLocalComments((prev) => [...prev, ...data]);
        setCommentsPage(nextPage);
        setHasMoreComments(
          paging ? paging.currentPage < paging.numberOfPages : data.length >= 25,
        );
      })
      .catch((err) => console.error("Error loading more comments:", err))
      .finally(() => setIsLoadingMoreComments(false));
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6 relative animate-fade-in-up transition-colors">
        {(isBookmarked || isSavedPage) && (
          <div className={`absolute top-4 right-4 text-blue-500 ${bookmarkAnimating ? "animate-bookmark-pop" : ""}`}>
            <BsBookmarkFill size={16} />
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 w-full relative">
            <img
              className="rounded-full w-10 h-10 border border-gray-100 object-cover cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all"
              src={post.user?.photo || profileImg}
              alt="User"
            />
            <div className="flex-1">
              <h3 className="text-md font-bold text-[#364153] dark:text-gray-200">{post.user?.name}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                {post.createdAt
                  ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                  : "Just now"}
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400 cursor-pointer"
              >
                <HiDotsVertical size={20} className="rotate-90" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl py-2 z-20 animate-slide-down">
                    <button
                      onClick={() => { handleBookmark(); setShowMenu(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 cursor-pointer"
                    >
                      {isBookmarked || isSavedPage ? <BsBookmarkFill className="text-blue-500" /> : <BsBookmark className="text-gray-400" />}
                      {isBookmarked || isSavedPage ? "Unsave Post" : "Save Post"}
                    </button>

                    {post.user?._id === userId && (
                      <>
                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                        <button
                          onClick={() => { setShowMenu(false); setIsEditing(true); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 transition-colors flex items-center gap-3 cursor-pointer"
                        >
                          <HiOutlinePencilAlt className="text-gray-400" size={18} />
                          Edit Post
                        </button>
                        <button
                          onClick={() => { setShowMenu(false); handleDelete(post._id); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 cursor-pointer"
                        >
                          <HiOutlineTrash className="text-red-400" size={18} />
                          Delete Post
                        </button>
                      </>
                    )}

                    {!isSavedPage && (
                      <>
                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                        <NavLink
                          to={`/PostDetails/${post._id}`}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 transition-colors flex items-center gap-3"
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
              className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none min-h-30 text-[#4b5563] dark:text-gray-300 bg-gray-50 dark:bg-gray-700"
              placeholder="What's on your mind?"
            />
            <div className="flex items-center gap-4">
              <button onClick={() => editFileInputRef.current.click()} className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                <FaCamera /> Change Image
              </button>
              <input type="file" ref={editFileInputRef} onChange={handleEditFileChange} className="hidden" accept="image/*" />
            </div>
            {(editPreview || post.image) && (
              <div className="relative w-40 h-40 rounded-xl overflow-hidden border">
                <img src={editPreview || post.image} className="w-full h-full object-cover" alt="preview" />
                {editPreview && (
                  <button onClick={() => { setEditImage(null); setEditPreview(null); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 cursor-pointer">
                    <FaTimes size={12} />
                  </button>
                )}
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setIsEditing(false); setEditText(post.body); setEditPreview(null); }} className="px-5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all cursor-pointer">Cancel</button>
              <button onClick={handleUpdateSubmit} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md transition-all cursor-pointer">Save Changes</button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[#4b5563] dark:text-gray-300 text-lg mb-6 wrap-break-word whitespace-pre-wrap overflow-hidden">{post.body}</p>
            {post.image && (
              <div className="w-full h-80 mb-6 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer group">
                <img src={post.image} alt="post content" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              </div>
            )}
          </>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <span className="bg-blue-500 text-white p-1.5 rounded-full text-[10px] border-2 border-white dark:border-gray-800 shadow-sm"><FaThumbsUp /></span>
              <span className="bg-red-500 text-white p-1.5 rounded-full text-[10px] border-2 border-white dark:border-gray-800 shadow-sm"><FaHeart /></span>
            </div>
            <span onClick={handleShowLikes} className="text-gray-500 dark:text-gray-400 text-sm font-medium cursor-pointer hover:underline hover:text-blue-600 transition-all">
              {likesCount} likes
            </span>
          </div>
          <div className="flex flex-row">
            <span className="flex items-center gap-0.5 text-gray-500 dark:text-gray-400 text-sm font-medium me-2.5">
              <span>{post.sharesCount || 0}</span><BiRepost className="text-lg" /><span>shares</span>
            </span>
            <span onClick={handleToggleComments} className="text-gray-500 dark:text-gray-400 text-sm font-medium cursor-pointer hover:underline hover:text-blue-600 transition-all">{localCommentsCount} comments</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 py-1 mb-2">
          <button
            onClick={handleLike}
            className={`flex justify-center items-center gap-2 py-2.5 rounded-xl transition-all font-semibold cursor-pointer select-none active:scale-95 ${
              isLiked
                ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                : "text-[#6a7282] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
          >
            {isLiked ? (
              <AiFillLike className={`text-lg text-blue-600 ${likeAnimating ? "animate-like-pop" : ""}`} />
            ) : (
              <AiOutlineLike className="text-lg" />
            )}
            <span>Like</span>
          </button>
          <button
            onClick={handleToggleComments}
            className={`flex justify-center items-center gap-2 py-2.5 rounded-xl transition-all font-semibold cursor-pointer select-none active:scale-95 ${
              showComments
                ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                : "text-[#6a7282] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
          >
            <FaRegCommentDots className="text-lg" /> <span>Comment</span>
          </button>
          <button className="flex justify-center items-center gap-2 py-2.5 text-[#6a7282] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all font-semibold cursor-pointer select-none active:scale-95">
            <FaShare className="text-lg" /> <span>Share</span>
          </button>
        </div>

        {/* Comments Section - toggled */}
        {showComments && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 animate-fade-in-up">
            {isLoadingComments ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : localComments && localComments.length > 0 ? (
              <div className="max-h-96 overflow-y-auto pr-1 space-y-3 mb-3 scrollbar-thin">
                {localComments.map((comment, index) => (
                  <div key={comment?._id || index} className="flex gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden">
                      <img src={comment?.commentCreator?.photo || profileImg} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-[#F3F5F7] dark:bg-gray-700 p-2.5 rounded-2xl rounded-tl-none inline-block max-w-full">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-gray-200">{comment?.commentCreator?.name || "User"}</h4>
                        <p className="text-sm text-slate-600 dark:text-gray-400 break-words">{comment?.content}</p>
                        {comment?.image && (
                          <div className="mt-2 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-600 max-w-xs">
                            <img src={comment.image} alt="comment content" className="w-full h-auto" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {hasMoreComments && (
                  <button
                    onClick={loadMoreComments}
                    disabled={isLoadingMoreComments}
                    className="w-full py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors cursor-pointer"
                  >
                    {isLoadingMoreComments ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></span>
                        Loading...
                      </span>
                    ) : (
                      "Load more comments"
                    )}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-4">No comments yet. Be the first!</p>
            )}

            {previewUrl && (
              <div className="relative w-24 h-24 ml-10 mb-2 rounded-lg overflow-hidden border border-blue-200 shadow-sm">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button onClick={removeImage} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 cursor-pointer">
                  <FaTimes size={10} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 pt-3 mt-1 border-t border-gray-100 dark:border-gray-700">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                <img src={userData?.photo || profileImg} alt="me" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                  placeholder="Write a comment..."
                  className="w-full bg-[#f0f2f5] dark:bg-gray-700 dark:text-gray-200 border-none rounded-full py-2 px-4 pr-16 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <FaCamera onClick={handleImageClick} className={`cursor-pointer text-xs ${selectedImage ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`} />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim() && !selectedImage}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      commentText.trim() || selectedImage
                        ? "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 scale-110"
                        : "text-gray-300 !cursor-not-allowed"
                    }`}
                  >
                    <FaPaperPlane size={14} className={commentText.trim() || selectedImage ? "rotate-45" : ""} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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