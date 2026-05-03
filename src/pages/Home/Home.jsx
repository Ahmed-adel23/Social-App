import React, { useRef, useCallback, useContext, useMemo } from "react";
import usePosts from "../../hooks/usePosts";
import { fetchFeedPosts } from "../../services/feedPosts";
import PostCreateCard from "../../components/Post/PostCreateCard";
import PostCard from "../../components/Post/PostContent";
import PostSkeleton from "../../components/Post/PostPlaceHolder";
import profileImg from "../../assets/Images/HomeImgs/defaultProfile.png";
import { UserContext } from "../../App";

export default function Home() {
  const { userData } = useContext(UserContext);
  const { posts, isLoadingPosts, hasMore, loadMorePosts, refreshPosts } =
    usePosts(fetchFeedPosts);

  const uniquePosts = useMemo(() => {
    if (!posts) return [];
    const seen = new Set();
    return posts.filter((post) => {
      const duplicate = seen.has(post._id);
      seen.add(post._id);
      return !duplicate;
    });
  }, [posts]);

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoadingPosts) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoadingPosts, hasMore, loadMorePosts],
  );

  return (
    <div className="space-y-6 pt-6">
      <PostCreateCard onPostCreated={refreshPosts} />

      {isLoadingPosts && uniquePosts.length === 0 ? (
        <div className="space-y-6">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : (
        uniquePosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            profileImg={profileImg}
            userData={userData}
          />
        ))
      )}

      <div
        ref={lastPostElementRef}
        className="h-10 flex justify-center items-center"
      >
        {isLoadingPosts && uniquePosts.length > 0 && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm italic">
            You've reached the end of the feed
          </p>
        )}
      </div>
    </div>
  );
}
