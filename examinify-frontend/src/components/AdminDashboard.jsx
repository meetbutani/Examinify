import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate("/admin/add-user")}>Add User</button>
    </div>
  );
};

export default AdminDashboard;
