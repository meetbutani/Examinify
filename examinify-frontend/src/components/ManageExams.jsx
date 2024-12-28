import React, { useState, useEffect } from "react";
import axios from "axios";
import ExamDetails from "./ExamDetails";
import AssignStudents from "./AssignStudents";

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
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

  return (
    <div>
      <h2>Exam Management</h2>
      <div>
        <h3>Create New Exam</h3>
        <input
          type="text"
          placeholder="Name"
          value={newExam.name}
          onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Duration (mins)"
          value={newExam.duration}
          onChange={(e) =>
            setNewExam({ ...newExam, duration: parseInt(e.target.value) })
          }
        />
        <input
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
          value={newExam.type}
          onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}
        >
          <option value="MCQ">MCQ</option>
          <option value="PROGRAMMING">Programming</option>
        </select>
        <input
          type="datetime-local"
          placeholder="Start Date-Time (Optional)"
          value={newExam.startDateTime}
          onChange={(e) =>
            setNewExam({ ...newExam, startDateTime: e.target.value })
          }
        />
        <input
          type="datetime-local"
          placeholder="End Date-Time (Optional)"
          value={newExam.endDateTime}
          onChange={(e) =>
            setNewExam({ ...newExam, endDateTime: e.target.value })
          }
        />
        <button onClick={createExam}>Create</button>
      </div>
      <div>
        <h3>Exam List</h3>
        <table>
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
                  <button onClick={() => setSelectedExam(exam)}>Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedExam && (
        <ExamDetails
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
        />
      )}
      {selectedExam && (
        <AssignStudents
          examId={selectedExam.id}
        />
      )}
    </div>
  );
};

export default ManageExams;
