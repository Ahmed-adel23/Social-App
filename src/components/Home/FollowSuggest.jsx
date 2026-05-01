import React, { useState, useEffect } from "react";
import { FaUserPlus, FaCheck } from "react-icons/fa";
import { getFollowSuggestions } from "../../services/getFollowSuggestions";
import { toggleFollow } from "../../services/followUsers";

export default function FollowSuggest() {
  const [users, setUsers] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  useEffect(() => {
    getFollowSuggestions()
      .then((response) => {
        setUsers(response.data.data.suggestions);
        console.log(response, "follww");
      })
      .catch((error) => {
        console.error("Error fetching follow suggestions:", error);
      });
  }, []);

  const handleFollow = (userId) => {
    setLoadingIds((prev) => [...prev, userId]);

    toggleFollow(userId)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === userId ? { ...u, isFollowed: true } : u,
          ),
        );
      })
      .catch((error) => {
        console.error("Follow failed", error);
      })
      .finally(() => {
        setLoadingIds((prev) => prev.filter((id) => id !== userId));
      });
  };
  return (
    <>
      <div className="hidden lg:block lg:col-span-1 h-fit sticky top-10">
        <div className="space-y-4">
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
            {/* Header */}
            <h2 className="text-[#364153] font-bold text-lg mb-6 flex items-center gap-2">
              <FaUserPlus className="text-blue-500" />
              <span>Who to Follow</span>
            </h2>

            {/* Users List */}
            <div className="space-y-6">
              {users && users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.photo}
                        alt={user.name}
                        className="w-11 h-11 rounded-full object-cover border border-gray-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-[#1e2939] text-sm truncate">
                          {user.name}
                        </h4>
                        <p className="text-xs text-[#6a7282] font-normal truncate">
                          {user.username ? `@${user.username}` : "Route User"}
                        </p>
                        <div className="flex flex-col gap-2 mt-1">
                          <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                            <span className="font-bold text-blue-500">
                              {user.followersCount}
                            </span>
                            followers
                          </p>

                          {user.mutualFollowersCount > 0 && (
                            <p className="text-[9px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-bold shadow-xs whitespace-nowrap w-fit">
                              {user.mutualFollowersCount} Mutual
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => !user.isFollowed && handleFollow(user._id)}
                      disabled={
                        loadingIds.includes(user._id) || user.isFollowed
                      }
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                        user.isFollowed
                          ? "bg-blue-600 border-blue-600 text-white cursor-default"
                          : "border-blue-500 text-blue-500 hover:bg-blue-50"
                      } ${loadingIds.includes(user._id) ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {loadingIds.includes(user._id) ? (
                        <>
                          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                          Following...
                        </>
                      ) : user.isFollowed ? (
                        <>
                          <FaCheck size={10} />
                          Followed
                        </>
                      ) : (
                        "Follow"
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm italic">
                  Loading suggestions...
                </p>
              )}
            </div>
          </div>

          {/* Footer Links */}
          <div className="px-2">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              <a href="#" className="hover:underline italic">
                Terms
              </a>
              <span>•</span>
              <a href="#" className="hover:underline italic">
                Privacy
              </a>
              <span>•</span>
              <a href="#" className="hover:underline italic">
                Cookies
              </a>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 font-semibold">
              © 2026 SOCIALHUB • ROUTE
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
