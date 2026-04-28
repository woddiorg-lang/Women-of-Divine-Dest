/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router";
import MobileLayout from "./components/layout/MobileLayout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Journey from "./pages/Journey";
import RootingModule from "./pages/RootingModule";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import AIMentor from "./pages/AIMentor";
import Marketplace from "./pages/Marketplace";
import Radio from "./pages/Radio";
import Community from "./pages/Community";
import Certificates from "./pages/Certificates";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import BlueprintLesson from "./pages/BlueprintLesson";
import { Navigate } from "react-router";
import TutorLayout from "./components/layout/TutorLayout";
import AdminLayout from "./components/layout/AdminLayout";
import TutorOverview from "./pages/tutor/TutorOverview";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTickets from "./pages/admin/AdminTickets";
import { useEffect } from "react";
import { auth, db } from "./lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuthStore, User } from "./store/authStore";

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/journey/rooting/:moduleId",
    element: <RootingModule />
  },
  {
    path: "/courses/:courseId",
    element: <CourseDetail />
  },
  {
    path: "/",
    element: <MobileLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      { path: "/journey", element: <Journey /> },
      { path: "/courses", element: <Courses /> },
      { path: "/ai-mentor", element: <AIMentor /> },
      { path: "/market", element: <Marketplace /> },
      { path: "/radio", element: <Radio /> },
      { path: "/community", element: <Community /> },
      { path: "/certs", element: <Certificates /> },
      { path: "/leaderboard", element: <Leaderboard /> },
      { path: "/settings", element: <Settings /> },
      { path: "/journey/blueprint/:pillarId", element: <BlueprintLesson /> },
      { path: "/progress", element: <Progress /> },
      { path: "/profile", element: <Profile /> },
      { path: "/support", element: <Support /> },
      { path: "/mentorship", element: <Navigate to="/ai-mentor" replace /> },
    ]
  },
  {
    path: "/tutor",
    element: <TutorLayout />,
    children: [
      { path: "", element: <TutorOverview /> },
      { path: "students", element: <AdminUsers /> },
      { path: "sessions", element: <div className="p-6">Sessions Page (Coming Soon)</div> },
      { path: "courses", element: <div className="p-6">Courses Page (Coming Soon)</div> },
      { path: "messages", element: <div className="p-6">Messages Page (Coming Soon)</div> },
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <AdminOverview /> },
      { path: "users", element: <AdminUsers /> },
      { path: "tickets", element: <AdminTickets /> },
      { path: "marketplace", element: <div className="p-6">Marketplace Approval (Coming Soon)</div> },
      { path: "forum", element: <div className="p-6">Forum Moderation (Coming Soon)</div> },
      { path: "courses", element: <div className="p-6">Course Management (Coming Soon)</div> },
      { path: "upload", element: <div className="p-6">Content Upload (Coming Soon)</div> },
      { path: "certificates", element: <div className="p-6">Certificates Verification (Coming Soon)</div> },
      { path: "analytics", element: <div className="p-6">Analytics Dashboard (Coming Soon)</div> },
      { path: "settings", element: <div className="p-6">Platform Settings (Coming Soon)</div> },
      { path: "invites", element: <div className="p-6">Invite Links (Coming Soon)</div> },
    ]
  }
]);

export default function App() {
  const { setUser, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-[#0F0F0F] text-gray-900 dark:text-white">Loading...</div>;
  }

  return <RouterProvider router={router} />;
}

