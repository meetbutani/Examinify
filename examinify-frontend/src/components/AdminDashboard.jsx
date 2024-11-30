import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate("/CreateStudentProfile")}>
        CreateStudentProfile
      </button>
      <button onClick={() => navigate("/ManageStudents")}>
        ManageStudents
      </button>
    </div>
  );
};

export default AdminDashboard;
