import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getPostDetails } from "../../services/getPostDetails";
import PostCard from "../../components/Post/PostContent";
import PostSkeleton from "../../components/Post/PostPlaceHolder";
import { UserContext } from "../../App";
import { fetchComments } from "../../services/comments";
import { toast } from "react-toastify";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userData } = useContext(UserContext);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setLoading(true);
    getPostDetails(id)
      .then((res) => {
        setPost(res.data.data.post);
      })
      .catch(() => {
        toast.error("Failed to load post details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchComments(id)
        .then((res) => {
          setComments(res.data.data.comments);
        })
        .catch(() => {});
    }
  }, [id]);

  return (
    <div className="max-w-full mx-auto">
      {loading ? (
        <PostSkeleton />
      ) : post ? (
        <PostCard post={post} userData={userData} allComments={comments} />
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Post not found or has been deleted.
        </div>
      )}
    </div>
  );
}
