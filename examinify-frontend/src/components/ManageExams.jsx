import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/ManageExams.css";
import ExamDetails from "./ExamDetails";
import AssignStudents from "./AssignStudents";
import ViewResults from "./ViewResults";
import ExamDetailsProgramming from "./ExamDetailsProgramming";

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [viewResult, setViewResult] = useState(null);
  const [newExam, setNewExam] = useState({
    name: "",
    duration: 60,
    passingCriteria: 3,
    type: "MCQ",
    startDateTime: "",
    endDateTime: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/admin/exams/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExams(response.data);
    } catch (error) {
      console.error("Failed to fetch exams.", error);
    }
  };

  const createExam = async () => {
    try {
      const payload = { ...newExam };
      if (!payload.startDateTime) delete payload.startDateTime;
      if (!payload.endDateTime) delete payload.endDateTime;

      await axios.post(
        "http://localhost:8081/api/admin/exams/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchExams();
      setNewExam({
        name: "",
        duration: 60,
        passingCriteria: 3,
        type: "MCQ",
        startDateTime: "",
        endDateTime: "",
      });
    } catch (error) {
      console.error("Failed to create exam.", error);
    }
  };

  const deleteExam = async (examId) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      await axios.delete(`http://localhost:8081/api/admin/exams/${examId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchExams();
    } catch (error) {
      console.error("Failed to delete exam.", error);
    }
  };

  return (
    <div className="manage-exams-container">
      <h2 className="manage-exams-heading">Exam Management</h2>
      <div className="create-exam-form">
        <h3>Create New Exam</h3>
        <input
          className="exam-input"
          type="text"
          placeholder="Name"
          value={newExam.name}
          onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
        />
        <input
          className="exam-input"
          type="number"
          placeholder="Duration (mins)"
          value={newExam.duration}
          onChange={(e) =>
            setNewExam({ ...newExam, duration: parseInt(e.target.value) })
          }
        />
        <input
          className="exam-input"
          type="number"
          placeholder="Passing Criteria"
          value={newExam.passingCriteria}
          onChange={(e) =>
            setNewExam({
              ...newExam,
              passingCriteria: parseInt(e.target.value),
            })
          }
        />
        <select
          className="exam-select"
          value={newExam.type}
          onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}
        >
          <option value="MCQ">MCQ</option>
          <option value="PROGRAMMING">Programming</option>
        </select>
        <input
          className="exam-input"
          type="datetime-local"
          placeholder="Start Date-Time (Optional)"
          value={newExam.startDateTime}
          onChange={(e) =>
            setNewExam({ ...newExam, startDateTime: e.target.value })
          }
        />
        <input
          className="exam-input"
          type="datetime-local"
          placeholder="End Date-Time (Optional)"
          value={newExam.endDateTime}
          onChange={(e) =>
            setNewExam({ ...newExam, endDateTime: e.target.value })
          }
        />
        <button className="create-exam-button" onClick={createExam}>
          Create
        </button>
      </div>
      <div className="exam-list">
        <h3>Exam List</h3>
        <table className="exam-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Duration</th>
              <th>Passing Criteria</th>
              <th>Type</th>
              <th>Start Date-Time</th>
              <th>End Date-Time</th>
              <th>Declared</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.name}</td>
                <td>{exam.duration}</td>
                <td>{exam.passingCriteria}</td>
                <td>{exam.type}</td>
                <td>{exam.startDateTime || "Not Set"}</td>
                <td>{exam.endDateTime || "Not Set"}</td>
                <td>{exam.startDateTime ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="exam-action-button"
                    onClick={() => setSelectedExam(exam)}
                  >
                    Manage
                  </button>
                  <button
                    className="exam-action-button delete-button"
                    onClick={() => deleteExam(exam.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="exam-action-button result-button"
                    onClick={() => setViewResult(exam.id)}
                  >
                    Result
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedExam && selectedExam.type === "MCQ" && (
        <ExamDetails
          exam={selectedExam}
          onClose={() => {
            fetchExams();
            setSelectedExam(null);
          }}
        />
      )}
      {selectedExam && selectedExam.type === "PROGRAMMING" && (
        <ExamDetailsProgramming
          exam={selectedExam}
          onClose={() => {
            fetchExams();
            setSelectedExam(null);
          }}
        />
      )}
      {selectedExam && <AssignStudents examId={selectedExam.id} />}
      {viewResult && <ViewResults examId={viewResult} />}
    </div>
  );
};

export default ManageExams;
