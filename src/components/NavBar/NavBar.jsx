import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaCommentDots,
  FaBars,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { HiOutlineNewspaper, HiOutlineSparkles } from "react-icons/hi2";
import { FiGlobe, FiBookmark } from "react-icons/fi";
import img from "../../assets/Images/FavIcon/route.png";
import { UserContext } from "../../App";

export default function Navbar() {
  const { userData, setUserData } = useContext(UserContext);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFeedOpen, setIsFeedOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef();
  const feedDropDownRef = useRef();

  // Paths for the Feed dropdown to check active state
  const feedPaths = ["/", "/MyPosts", "/Comunity", "/Saved"];
  const isFeedActive = feedPaths.includes(location.pathname);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (
        feedDropDownRef.current &&
        !feedDropDownRef.current.contains(event.target)
      ) {
        setIsFeedOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setUserData(null);
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-1.5 sm:gap-3 sm:px-3">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img
            alt="Route Posts"
            className="h-9 w-9 rounded-xl object-cover"
            src={img}
          />
          <p className="hidden text-xl font-extrabold text-slate-900 sm:block">
            Route Posts
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50/90 px-1 py-1 sm:px-1.5">
          {/* 1. Desktop Feed NavLink (Visible on md+ only) */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hidden md:flex relative items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${
                isActive
                  ? "bg-white text-[#1f6fe5] shadow-sm"
                  : "text-slate-600 hover:bg-white/90 hover:text-slate-900"
              }`
            }
          >
            <FaHome size={20} />
            <span>Feed</span>
          </NavLink>

          {/* 2. Mobile Feed Dropdown (Visible below md only) */}
          <div className="relative md:hidden" ref={feedDropDownRef}>
            <button
              onClick={() => setIsFeedOpen(!isFeedOpen)}
              className={`relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${
                isFeedActive
                  ? "bg-white text-[#1f6fe5] shadow-sm"
                  : "text-slate-600 hover:bg-white/90"
              }`}
            >
              <FaHome size={20} />
              <span className="sm:inline">Feed</span>
              <FaChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  isFeedOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu - Positioned Absolute with High Z-Index */}
            {isFeedOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-10 z-[100] border border-slate-100 py-2 overflow-hidden">
                <NavLink
                  to="/"
                  onClick={() => setIsFeedOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-slate-100 text-[#1f6fe5]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  <HiOutlineNewspaper className="mr-3 text-slate-400 group-hover:text-blue-500" />
                  Feed
                </NavLink>

                <NavLink
                  to="/MyPosts"
                  onClick={() => setIsFeedOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-slate-100 text-[#1f6fe5]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  <HiOutlineSparkles className="mr-3 text-slate-400 group-hover:text-blue-500" />
                  My Posts
                </NavLink>

                <NavLink
                  to="/Comunity"
                  onClick={() => setIsFeedOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-slate-100 text-[#1f6fe5]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  <FiGlobe className="mr-3 text-slate-400 group-hover:text-blue-500" />
                  Community
                </NavLink>

                <NavLink
                  to="/Saved"
                  onClick={() => setIsFeedOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-slate-100 text-[#1f6fe5]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  <FiBookmark className="mr-3 text-slate-400 group-hover:text-blue-500" />
                  Saved
                </NavLink>
              </div>
            )}
          </div>

          {/* Profile Link */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${
                isActive
                  ? "bg-white text-[#1f6fe5] shadow-sm"
                  : "text-slate-600 hover:bg-white/90"
              }`
            }
          >
            <FaUser size={18} />
            <span className="hidden sm:inline">Profile</span>
          </NavLink>

          {/* Notifications Link */}
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${
                isActive
                  ? "bg-white text-[#1f6fe5] shadow-sm"
                  : "text-slate-600 hover:bg-white/90"
              }`
            }
          >
            <FaCommentDots size={20} />
            <span className="hidden sm:inline">Notifications</span>
          </NavLink>
        </nav>

        {/* User Profile Menu Section */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:bg-slate-100"
          >
            <img
              alt={userData?.name}
              className="h-8 w-8 rounded-full object-cover"
              src={
                userData?.photo ||
                "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
              }
            />
            <span className="hidden max-w-35 truncate text-sm font-semibold text-slate-800 md:block">
              {userData?.name}
            </span>
            <FaBars className="text-slate-500" size={14} />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white shadow-xl z-50 overflow-hidden border border-slate-100">
              <div className="py-2">
                <Link
                  to="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="group flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FaUser className="mr-3 text-slate-400 group-hover:text-blue-500" />
                  Profile
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="group flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FaCog className="mr-3 text-slate-400 group-hover:text-blue-500" />
                  Settings
                </Link>

                <hr className="my-1 border-slate-100" />

                <button
                  onClick={handleLogout}
                  className="group flex w-full items-center px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt className="mr-3 text-red-400 group-hover:text-red-500" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
