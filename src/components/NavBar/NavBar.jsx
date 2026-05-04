import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBell,
  FaBars,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { HiOutlineNewspaper, HiOutlineSparkles } from "react-icons/hi2";
import { FiGlobe, FiBookmark, FiSun, FiMoon } from "react-icons/fi";
import { MdDoneAll } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import img from "../../assets/Images/FavIcon/route.png";
import { UserContext, ThemeContext } from "../../App";
import { fetchRecentNotifications } from "../../services/getAllNotification";

export default function Navbar() {
  const { userData, setUserData } = useContext(UserContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFeedOpen, setIsFeedOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifLoaded, setNotifLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef();
  const feedDropDownRef = useRef();
  const notifRef = useRef();

  const feedPaths = ["/", "/MyPosts", "/Comunity", "/Saved"];
  const isFeedActive = feedPaths.includes(location.pathname);


  const loadNotifications = () => {
    fetchRecentNotifications()
      .then((res) => {
        const data = res.data.data.notifications || [];
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
        setNotifLoaded(true);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsNotifOpen(false);
    setIsUserMenuOpen(false);
    setIsFeedOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (feedDropDownRef.current && !feedDropDownRef.current.contains(event.target)) {
        setIsFeedOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsFeedOpen(false);
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setUserData(null);
    navigate("/auth");
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleMarkOneRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const getNotifText = (notif) => {
    const name = notif.actor?.name || "Someone";
    switch (notif.type) {
      case "comment_post":
        return <><strong>{name}</strong> commented on your post</>;
      case "like_post":
        return <><strong>{name}</strong> liked your post</>;
      case "follow":
        return <><strong>{name}</strong> started following you</>;
      default:
        return <><strong>{name}</strong> interacted with your content</>;
    }
  };


  const navLinkClass = (isActive) =>
    `relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${
      isActive
        ? "bg-white dark:bg-gray-700 text-[#1f6fe5] shadow-sm"
        : "text-slate-600 dark:text-gray-400 hover:bg-white/90 dark:hover:bg-gray-700/50"
    }`;

  const dropdownItemClass = (isActive) =>
    `group flex items-center px-4 py-3 text-sm transition-colors ${
      isActive
        ? "bg-slate-100 dark:bg-gray-700 text-[#1f6fe5]"
        : "text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700/50"
    }`;


  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-1.5 sm:gap-3 sm:px-3">
        <div className="flex items-center gap-3">
          <img alt="Route Posts" className="h-9 w-9 rounded-xl object-cover" src={img} />
          <p className="hidden text-xl font-extrabold text-slate-900 dark:text-white sm:block">Route Posts</p>
        </div>

        <nav className="flex items-center gap-1 rounded-2xl border border-slate-200 dark:border-gray-700 bg-slate-50/90 dark:bg-gray-800/90 px-1 py-1 sm:px-1.5">
          <NavLink to="/" className={({ isActive }) => `hidden md:flex ${navLinkClass(isActive)}`}>
            <FaHome size={20} /><span>Feed</span>
          </NavLink>

          <div className="relative md:hidden" ref={feedDropDownRef}>
            <button
              onClick={() => setIsFeedOpen(!isFeedOpen)}
              className={navLinkClass(isFeedActive)}
            >
              <FaHome size={20} />
              <span className="sm:inline">Feed</span>
              <FaChevronDown size={12} className={`transition-transform duration-200 ${isFeedOpen ? "rotate-180" : ""}`} />
            </button>

            {isFeedOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black ring-opacity-10 z-[100] border border-slate-100 dark:border-gray-700 py-2 overflow-hidden animate-slide-down">
                <NavLink to="/" onClick={() => setIsFeedOpen(false)} className={({ isActive }) => dropdownItemClass(isActive)}>
                  <HiOutlineNewspaper className="mr-3 text-slate-400 group-hover:text-blue-500" />Feed
                </NavLink>
                <NavLink to="/MyPosts" onClick={() => setIsFeedOpen(false)} className={({ isActive }) => dropdownItemClass(isActive)}>
                  <HiOutlineSparkles className="mr-3 text-slate-400 group-hover:text-blue-500" />My Posts
                </NavLink>
                <NavLink to="/Comunity" onClick={() => setIsFeedOpen(false)} className={({ isActive }) => dropdownItemClass(isActive)}>
                  <FiGlobe className="mr-3 text-slate-400 group-hover:text-blue-500" />Community
                </NavLink>
                <NavLink to="/Saved" onClick={() => setIsFeedOpen(false)} className={({ isActive }) => dropdownItemClass(isActive)}>
                  <FiBookmark className="mr-3 text-slate-400 group-hover:text-blue-500" />Saved
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/profile" className={({ isActive }) => navLinkClass(isActive)}>
            <FaUser size={18} /><span className="hidden sm:inline">Profile</span>
          </NavLink>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 transition-all cursor-pointer"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiSun size={18} className="text-yellow-400" /> : <FiMoon size={18} className="text-slate-600" />}
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setIsNotifOpen(!isNotifOpen); if (!notifLoaded) loadNotifications(); }}
              className="relative p-2 rounded-full border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 transition-all cursor-pointer"
              aria-label="Notifications"
            >
              <FaBell size={18} className={unreadCount > 0 ? "text-blue-500" : "text-slate-500 dark:text-gray-400"} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-slate-100 dark:border-gray-700 z-50 overflow-hidden animate-slide-down">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-gray-200">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-[11px] font-semibold text-blue-500 hover:text-blue-600 cursor-pointer">
                      <MdDoneAll size={14} /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => handleMarkOneRead(notif._id)}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-slate-50 dark:border-gray-700/50 last:border-0 ${
                          !notif.isRead
                            ? "bg-blue-50/50 dark:bg-blue-900/15 hover:bg-blue-50 dark:hover:bg-blue-900/25"
                            : "hover:bg-slate-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <img
                          src={notif.actor?.photo}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-100 dark:border-gray-600"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] leading-snug text-slate-700 dark:text-gray-300 line-clamp-2">
                            {getNotifText(notif)}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-0.5">
                            {notif.createdAt
                              ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })
                              : ""}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2"></span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-slate-400 dark:text-gray-500 text-sm">
                      No notifications yet
                    </div>
                  )}
                </div>

                <Link
                  to="/notifications"
                  onClick={() => setIsNotifOpen(false)}
                  className="block text-center text-sm font-semibold text-blue-500 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-gray-700/50 py-3 border-t border-slate-100 dark:border-gray-700 transition-colors"
                >
                  See all notifications
                </Link>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-800 px-2 py-1.5 transition hover:bg-slate-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <img alt={userData?.name} className="h-8 w-8 rounded-full object-cover" src={userData?.photo || "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"} />
              <span className="hidden max-w-35 truncate text-sm font-semibold text-slate-800 dark:text-gray-200 md:block">{userData?.name}</span>
              <FaBars className="text-slate-500 dark:text-gray-400" size={14} />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white dark:bg-gray-800 shadow-xl z-50 overflow-hidden border border-slate-100 dark:border-gray-700 animate-slide-down">
                <div className="py-2">
                  <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="group flex items-center px-4 py-3 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                    <FaUser className="mr-3 text-slate-400 group-hover:text-blue-500" />Profile
                  </Link>
                  <Link to="/settings" onClick={() => setIsUserMenuOpen(false)} className="group flex items-center px-4 py-3 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                    <FaCog className="mr-3 text-slate-400 group-hover:text-blue-500" />Settings
                  </Link>
                  <hr className="my-1 border-slate-100 dark:border-gray-700" />
                  <button onClick={handleLogout} className="group flex w-full items-center px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
                    <FaSignOutAlt className="mr-3 text-red-400 group-hover:text-red-500" />Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
