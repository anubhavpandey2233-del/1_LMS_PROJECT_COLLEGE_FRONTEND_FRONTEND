import React, { useContext, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "../Admin/Container/Dashboard/Dashboard";
import Category from "../Admin/Container/Category/Category";
import Layout from "../Admin/Component/Layout/Layout";
import Course from "../Admin/Container/Course/Course";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ThemeContext } from "../context/ThemeContext";
import Section from "../Admin/Container/Section/Section";
import Quiz from "../Admin/Container/Quiz/Quiz";
import QuizContent from "../Admin/Container/Quiz/QuizContent";
import Content from "../Admin/Container/Content/Content";
import PrivteRouet from "./PrivteRouet";
import Coupan from "../Admin/Container/Coupan/Coupan";
import Blog from "../Admin/Container/Blog/Blog";
import Tag from "../Admin/Container/Tag/Tag";

// RoleProtectedRoute restricts route access based on user role (Admin vs Instructor)
function RoleProtectedRoute({ allowedRoles, children }) {
  const auth = localStorage.getItem("checkauth");
  let userdata = null;

  try {
    userdata = auth && auth !== "undefined"
      ? JSON.parse(auth)
      : null;
  } catch {
    userdata = null;
  }

  userdata = userdata?.data?.data ?? userdata?.data ?? userdata;

  if (!userdata) {
    return <Navigate to="/auth" replace />;
  }

  // If the user's role is not in the list of allowed roles for this route:
  if (!allowedRoles.includes(userdata.role)) {
    // If the logged-in user is an Instructor, redirect them to the Courses page
    if (userdata.role === "Instructor") {
      return <Navigate to="/admin/course" replace />;
    }
    // Otherwise redirect to home page
    return <Navigate to="/" replace />;
  }

  return children;
}

function AdminRouet(props) {
  const Theme = useContext(ThemeContext);

  const theme = createTheme({
    palette: {
      mode: Theme.theme,
      primary: {
        main: "#066ac9",
      },
      secondary: {
        main: "#f7c32e",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Routes>
          <Route element={<PrivteRouet />}>
            {/* Admin-only routes */}
            <Route path="/" element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </RoleProtectedRoute>
            } />
            <Route path="/category" element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Category />
              </RoleProtectedRoute>
            } />
            <Route path="/tag" element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Tag />
              </RoleProtectedRoute>
            } />

            {/* Routes shared by Admins and Instructors */}
            <Route path="/course" element={
              <RoleProtectedRoute allowedRoles={["admin", "Instructor"]}>
                <Course />
              </RoleProtectedRoute>
            } />
            <Route path="/section" element={
              <RoleProtectedRoute allowedRoles={["admin", "Instructor"]}>
                <Section />
              </RoleProtectedRoute>
            } />
            <Route path="/content" element={
              <RoleProtectedRoute allowedRoles={["admin", "Instructor"]}>
                <Content />
              </RoleProtectedRoute>
            } />
            <Route path="/quiz" element={
              <RoleProtectedRoute allowedRoles={["admin", "Instructor"]}>
                <Quiz />
              </RoleProtectedRoute>
            } />
            <Route path="/quiz-content/:_id" element={
              <RoleProtectedRoute allowedRoles={["admin", "Instructor"]}>
                <QuizContent />
              </RoleProtectedRoute>
            } />
            <Route path="/coupan" element={
              <RoleProtectedRoute allowedRoles={["admin", "Instructor"]}>
                <Coupan />
              </RoleProtectedRoute>
            } />
            <Route path="/blog" element={
              <RoleProtectedRoute allowedRoles={["admin", "Instructor"]}>
                <Blog />
              </RoleProtectedRoute>
            } />
          </Route>
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default AdminRouet;
