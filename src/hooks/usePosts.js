import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function usePosts(fetchFunction) {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const abortRef = useRef(null);

  const loadMorePosts = useCallback(() => {
    if (isLoadingPosts || !hasMore) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoadingPosts(true);
    fetchFunction(page, { signal: controller.signal })
      .then((res) => {
        const postsData =
          res.posts || res.data?.posts || res.data?.data?.posts || [];

        if (postsData.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prev) => [...prev, ...postsData]);
          setPage((prev) => prev + 1);
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        toast.error("Failed to load posts", { toastId: "posts-error" });
      })
      .finally(() => setIsLoadingPosts(false));
  }, [page, isLoadingPosts, hasMore, fetchFunction]);

  const refreshPosts = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPosts([]);
    setPage(1);
    setHasMore(true);
    setIsLoadingPosts(true);
    fetchFunction(1, { signal: controller.signal })
      .then((res) => {
        const postsData =
          res.posts || res.data?.posts || res.data?.data?.posts || [];
        if (postsData.length === 0) {
          setHasMore(false);
        } else {
          setPosts(postsData);
          setPage(2);
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        toast.error("Failed to refresh posts", { toastId: "posts-refresh-error" });
      })
      .finally(() => setIsLoadingPosts(false));
  }, [fetchFunction]);

  useEffect(() => {
    loadMorePosts();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return { posts, isLoadingPosts, setPosts, hasMore, loadMorePosts, refreshPosts };
}
