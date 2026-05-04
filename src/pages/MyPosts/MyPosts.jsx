import React, { useContext } from "react";
import PostCreateCard from "../../components/Post/PostCreateCard";
import UserPosts from "../../components/profile/UserPosts";
import { UserContext } from "../../App";
import ProfileImg from "../../assets/Images/HomeImgs/defaultProfile.png";
import useUserPosts from "../../hooks/useUserPosts";
import usePageTitle from "../../hooks/usePageTitle";
import { FaArrowLeft } from "react-icons/fa";

export default function MyPosts() {
  usePageTitle("My Posts");
  const { userData } = useContext(UserContext);
  const { posts, isLoadingPosts, refreshPosts } = useUserPosts();

  return (
    <div className="space-y-6">
      <PostCreateCard userImg={userData?.photo || ProfileImg} onPostCreated={refreshPosts} />
      <UserPosts posts={posts} loading={isLoadingPosts} />
    </div>
  );
}
