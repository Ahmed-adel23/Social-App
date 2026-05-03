import { useState, useEffect, useContext, useCallback } from "react";
import { getUserPosts } from "../services/UserPosts";
import { UserContext } from "../App";

export default function useUserPosts() {
  const { userData } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const fetchPosts = useCallback(() => {
    if (userData?._id) {
      setIsLoadingPosts(true);
      getUserPosts(userData._id)
        .then((res) => {
          setPosts(res.data.posts);
        })
        .catch((err) => {
          console.error("Error:", err);
        })
        .finally(() => {
          setIsLoadingPosts(false);
        });
    }
  }, [userData]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, isLoadingPosts, refreshPosts: fetchPosts };
}
