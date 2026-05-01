import React, { useContext } from "react";
import PostCreateCard from "../../components/Post/PostCreateCard";
import UserPosts from "../../components/profile/UserPosts";
import { UserContext } from "../../App";
import ProfileImg from "../../assets/Images/HomeImgs/defaultProfile.png";
import useUserPosts from "../../hooks/useUserPosts";
import { FaArrowLeft } from "react-icons/fa";

export default function MyPosts() {
  const { userData } = useContext(UserContext);
  const { posts, isLoadingPosts } = useUserPosts();

  return (
    <div className="space-y-6">
      <PostCreateCard userImg={userData?.photo || ProfileImg} />
      <UserPosts posts={posts} loading={isLoadingPosts} />
    </div>
  );
}
