import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/DashboardAdmin.css";

const DashboardAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Admin Dashboard</h2>
      <div className="dashboard-buttons">
        <button
          className="dashboard-button"
          onClick={() => navigate("/CreateStudentProfile")}
        >
          Create Student Profile
        </button>
        <button
          className="dashboard-button"
          onClick={() => navigate("/ManageStudents")}
        >
          Manage Students
        </button>
        <button
          className="dashboard-button"
          onClick={() => navigate("/AddQuestion")}
        >
          Add Question
        </button>
        <button
          className="dashboard-button"
          onClick={() => navigate("/ManageQuestions")}
        >
          Manage Questions
        </button>
        <button
          className="dashboard-button"
          onClick={() => navigate("/AddProgrammingQuestion")}
        >
          Add Programming Question
        </button>
        <button
          className="dashboard-button"
          onClick={() => navigate("/ManageProgrammingQuestions")}
        >
          Manage Programming Questions
        </button>
        <button
          className="dashboard-button"
          onClick={() => navigate("/ManageExams")}
        >
          Manage Exam
        </button>
      </div>
    </div>
  );
};

export default DashboardAdmin;
