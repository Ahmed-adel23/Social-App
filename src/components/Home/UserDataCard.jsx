import { NavLink } from "react-router-dom";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { HiOutlineSparkles } from "react-icons/hi2";
import { FiGlobe } from "react-icons/fi";
import { FiBookmark } from "react-icons/fi";

export default function SidebarNav() {
  const menuItems = [
    { name: "Feed", path: "/", icon: <HiOutlineNewspaper size={22} /> },
    {
      name: "My Posts",
      path: "/MyPosts",
      icon: <HiOutlineSparkles size={22} />,
    },
    { name: "Community", path: "/Comunity", icon: <FiGlobe size={22} /> },
    { name: "Saved", path: "/Saved", icon: <FiBookmark size={22} /> },
  ];

  return (
    <div className="w-70 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-gray-700 transition-colors">
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-semibold cursor-pointer ${
                  isActive
                    ? "bg-[#eef6ff] dark:bg-blue-900/30 text-[#1d75ff] shadow-sm"
                    : "text-[#364153] dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700/50 hover:translate-x-1"
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-[15px]">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
