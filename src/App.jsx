import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routing/AppRoutes";
import { HeroUIProvider } from "@heroui/react";
import { ToastContainer } from "react-toastify";
import React, { createContext, useState, useEffect } from "react";
import { fetchUserData } from "./services/user";

export const UserContext = createContext(null);
export const ThemeContext = createContext(null);

function App() {
  const [userData, setUserData] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      fetchUserData()
        .then((res) => {
          setUserData(res.data.user);
        })
        .catch((err) => {
          console.error("Error fetching user context:", err);
        });
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <UserContext.Provider value={{ userData, setUserData }}>
        <HeroUIProvider>
          <RouterProvider router={router} />
          <ToastContainer position="top-right" autoClose={3000} theme={darkMode ? "dark" : "light"} />
        </HeroUIProvider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
