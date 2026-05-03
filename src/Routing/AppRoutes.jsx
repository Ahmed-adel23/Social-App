import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  NavLink,
  Outlet,
} from "react-router-dom";
import MainLayout from "../LayOuts/MainLayout/MainLayout";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/NavBar/NavBar";

const Home = lazy(() => import("../pages/Home/Home"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const Login = lazy(() => import("../pages/Authntcation/Login/Login"));
const Register = lazy(() => import("../pages/Authntcation/Register/Register"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const MyPosts = lazy(() => import("../pages/MyPosts/MyPosts"));
const Comunity = lazy(() => import("../pages/ComunityPosts/Comunity"));
const PostDetails = lazy(() => import("../pages/PostDetails/PostDetails"));
const SavedPosts = lazy(() => import("../pages/SavedPosts/SavedPosts"));
const Notifications = lazy(() => import("../pages/Notifications/Notifications"));
const AuthLayOut = lazy(() => import("../LayOuts/AuthLayOut/AuthLayOut"));

function PageFallback() {
  return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}

function SuspenseWrap({ children }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
}

const ProtectedRoute = () => {
  const token = localStorage.getItem("userToken");
  return token ? <Outlet /> : <Navigate to="/auth" />;
};

const PublicRoute = () => {
  const token = localStorage.getItem("userToken");
  return token ? <Navigate to="/" /> : <Outlet />;
};

const PageWrapper = ({ children, showBackButton = false }) => (
  <div className="min-h-screen bg-[#f0f2f5] dark:bg-gray-900 transition-colors">
    <Navbar />
    <section className="mx-auto max-w-6xl px-4 py-6">
      {showBackButton && (
        <NavLink to="/">
          <div className="flex flex-row items-center gap-2 text-white mb-4 bg-[#00298D] border border-gray-700 hover:bg-gray-800 rounded-lg w-max px-3 py-1.5 transition-colors">
            <FaArrowLeft />
            <h2 className="leading-none">Back</h2>
          </div>
        </NavLink>
      )}
      {children}
    </section>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <SuspenseWrap><Home /></SuspenseWrap> },
          { path: "settings", element: <SuspenseWrap><Settings /></SuspenseWrap> },
          {
            path: "Saved",
            element: (
              <SuspenseWrap>
                <div className="min-h-screen bg-[#f0f2f5] dark:bg-gray-900 px-4 py-6 max-w-6xl mx-auto transition-colors">
                  <SavedPosts />
                </div>
              </SuspenseWrap>
            ),
          },
          {
            path: "Comunity",
            element: (
              <SuspenseWrap>
                <div className="min-h-screen bg-[#f0f2f5] dark:bg-gray-900 px-4 py-6 max-w-6xl mx-auto transition-colors">
                  <Comunity />
                </div>
              </SuspenseWrap>
            ),
          },
          {
            path: "MyPosts",
            element: (
              <SuspenseWrap>
                <div className="min-h-screen bg-[#f0f2f5] dark:bg-gray-900 px-4 py-6 max-w-6xl mx-auto transition-colors">
                  <MyPosts />
                </div>
              </SuspenseWrap>
            ),
          },
        ],
      },
      {
        path: "profile",
        element: (
          <PageWrapper>
            <SuspenseWrap><Profile /></SuspenseWrap>
          </PageWrapper>
        ),
      },
      {
        path: "notifications",
        element: (
          <PageWrapper>
            <SuspenseWrap><Notifications /></SuspenseWrap>
          </PageWrapper>
        ),
      },
      {
        path: "PostDetails/:id",
        element: (
          <PageWrapper showBackButton>
            <SuspenseWrap><PostDetails /></SuspenseWrap>
          </PageWrapper>
        ),
      },
    ],
  },

  {
    path: "auth",
    element: <PublicRoute />,
    children: [
      {
        element: (
          <SuspenseWrap><AuthLayOut /></SuspenseWrap>
        ),
        children: [
          { index: true, element: <SuspenseWrap><Login /></SuspenseWrap> },
          { path: "register", element: <SuspenseWrap><Register /></SuspenseWrap> },
        ],
      },
    ],
  },

  { path: "*", element: <SuspenseWrap><NotFound /></SuspenseWrap> },
]);