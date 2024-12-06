import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import DashboardExaminee from "./components/DashboardExaminee";
import DashboardAdmin from "./components/DashboardAdmin";
import { PermissionGuard } from "./components/PermissionGuard";
import CreateStudentProfile from "./components/CreateStudentProfile";
import ManageStudentProfiles from "./components/ManageStudentProfiles";
import AddQuestion from "./components/AddQuestion";
import ManageQuestions from "./components/ManageQuestions";
import ManageExams from "./components/ManageExams";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route
          path="/CreateStudentProfile"
          element={
            <PermissionGuard requiredPermission={"ADMIN"}>
              <CreateStudentProfile />
            </PermissionGuard>
          }
        />
        <Route
          path="/ManageStudents"
          element={
            <PermissionGuard requiredPermission={"ADMIN"}>
              <ManageStudentProfiles />
            </PermissionGuard>
          }
        />
        <Route
          path="/AddQuestion"
          element={
            <PermissionGuard requiredPermission={"ADMIN"}>
              <AddQuestion />
            </PermissionGuard>
          }
        />
        <Route
          path="/ManageQuestions"
          element={
            <PermissionGuard requiredPermission={"ADMIN"}>
              <ManageQuestions />
            </PermissionGuard>
          }
        />
        <Route
          path="/ManageExams"
          element={
            <PermissionGuard requiredPermission={"ADMIN"}>
              <ManageExams />
            </PermissionGuard>
          }
        />
      </Routes>
    </Router>
  );
};

// Protected route for dashboard
const ProtectedDashboard = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;

  if (user.role === "ADMIN") {
    return <DashboardAdmin />;
  } else if (user.role === "EXAMINEE") {
    return <DashboardExaminee />;
  } else {
    return <Navigate to="/login" />;
  }
};

// Define a separate HomeRedirect component
const HomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.role === "ADMIN") {
    return <Navigate to="/dashboard" />;
  } else if (user && user.role === "EXAMINEE") {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default App;
