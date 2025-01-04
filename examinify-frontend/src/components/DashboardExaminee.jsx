import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/DashboardExaminee.css";
import ExamInterface from "./ExamInterface";
import ExamProgrammingInterface from "./ExamProgrammingInterface";

const DashboardExaminee = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const examinee = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/examinee/exam/${examinee.username}/exams`,
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

  const handleOpenExam = async (exam) => {
    const currentTime = new Date();
    const examStartTime = new Date(exam.startDateTime);

    if (currentTime < examStartTime) {
      alert("The exam has not started yet.");
      return;
    }

    try {
      const ipAddress = await getIpAddress();

      const response = await axios.get(
        `http://localhost:8081/api/examinee/exam/${exam.id}/status/${examinee.username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "IP-Address": ipAddress,
          },
        }
      );

      const { status, message, timeLeft } = response.data;

      if (status === "success") {
        setSelectedExam(exam);
        setTimeLeft(timeLeft);
      } else {
        alert(message);
      }
    } catch (error) {
      console.error("Failed to check exam status.", error);
      alert("Error checking exam status.");
    }
  };

  const getIpAddress = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip;
    } catch (error) {
      console.error("Failed to retrieve IP address.", error);
      throw new Error("Could not retrieve IP address.");
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Examinee Dashboard</h2>
      <p className="welcome-message">
        Welcome to your dashboard, {examinee.username}!
      </p>
      <h3 className="exams-heading">Your Exams</h3>
      <table className="exams-table">
        <thead>
          <tr>
            <th>Exam Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id}>
              <td>{exam.name}</td>
              <td>{exam.startDateTime || "Not Set"}</td>
              <td>{exam.endDateTime || "Not Set"}</td>
              <td>
                <button
                  className="open-exam-button"
                  onClick={() => handleOpenExam(exam)}
                >
                  Open Exam
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedExam && selectedExam.type === "MCQ" && (
        <ExamInterface
          exam={selectedExam}
          examId={selectedExam.id}
          examineeId={examinee.username}
          examDuration={timeLeft}
          onClose={() => setSelectedExam(null)}
        />
      )}
      {selectedExam && selectedExam.type === "PROGRAMMING" && (
        <ExamProgrammingInterface
          exam={selectedExam}
          examId={selectedExam.id}
          examineeId={examinee.username}
          examDuration={timeLeft}
          onClose={() => setSelectedExam(null)}
        />
      )}
    </div>
  );
};

export default DashboardExaminee;
