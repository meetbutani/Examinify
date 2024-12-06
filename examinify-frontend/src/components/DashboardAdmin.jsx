import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
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
      <button onClick={() => navigate("/ManageExams")}>Manage Exam</button>
    </div>
  );
};

export default DashboardAdmin;
