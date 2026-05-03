import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { getUserPosts } from "../services/UserPosts";
import { UserContext } from "../App";
import { toast } from "react-toastify";

export default function useUserPosts() {
  const { userData } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const abortRef = useRef(null);

  const fetchPosts = useCallback(() => {
    if (!userData?._id) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoadingPosts(true);
    getUserPosts(userData._id)
      .then((res) => {
        if (!controller.signal.aborted) {
          setPosts(res.data.posts);
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        toast.error("Failed to load your posts", { toastId: "user-posts-error" });
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingPosts(false);
        }
      });
  }, [userData]);

  useEffect(() => {
    fetchPosts();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchPosts]);

  return { posts, isLoadingPosts, refreshPosts: fetchPosts };
}
