import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate("/CreateStudentProfile")}>
        Create Student Profile
      </button>
      <button onClick={() => navigate("/ManageStudents")}>
        Manage Students
      </button>
      <button onClick={() => navigate("/AddQuestion")}>Add Question</button>
      <button onClick={() => navigate("/ManageQuestions")}>
        Manage Questions
      </button>
    </div>
  );
};

export default AdminDashboard;
