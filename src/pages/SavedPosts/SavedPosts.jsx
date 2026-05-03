import React, { useEffect, useState } from "react";
import PostCard from "../../components/Post/PostContent";
import { getBookmarks } from "../../services/getBookmarks";
import { useContext } from "react";
import { UserContext } from "../../App";
import { BsBookmarkFill } from "react-icons/bs";

export default function SavedPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useContext(UserContext);

  const removeItemFromUI = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  useEffect(() => {
    getBookmarks()
      .then((response) => {
        const savedData = response.data.data.bookmarks;
        setPosts(savedData || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching saved posts:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
          <BsBookmarkFill className="text-blue-500 text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#364153] dark:text-gray-200">Saved Posts</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {posts.length} {posts.length === 1 ? "post" : "posts"} saved
          </p>
        </div>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-2">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              userData={userData}
              isSavedPage={true}
              onUnsave={removeItemFromUI}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in transition-colors">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <BsBookmarkFill className="text-gray-300 dark:text-gray-500 text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">No saved posts yet</h3>
          <p className="text-gray-400 dark:text-gray-500 font-medium max-w-xs mx-auto">
            Posts you save will appear here. Tap the bookmark icon on any post to save it for later.
          </p>
        </div>
      )}
    </div>
  );
}
