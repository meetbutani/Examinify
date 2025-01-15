import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../assets/css/ViewResults.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const ViewResults = ({ examId }) => {
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({});
  const [notAttempted, setNotAttempted] = useState({ total: 0, students: [] });
  const [filters, setFilters] = useState({
    passed: null,
    startDate: "",
    endDate: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchResults();
    fetchSummary();
    fetchNotAttempted();
  }, [examId]);

  const fetchResults = async () => {
    try {
      const { passed, startDate, endDate } = filters;
      let url = `http://localhost:8081/api/admin/exams/results/${examId}`;
      const params = [];
      if (passed !== null) params.push(`passed=${passed}`);
      if (startDate && endDate)
        params.push(
          `startDate=${startDate.replace("T", " ") + ":00"}&endDate=${
            endDate.replace("T", " ") + ":00"
          }`
        );
      if (params.length) url += `/filter?${params.join("&")}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) setResults([]);
      console.error("Failed to fetch results.", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/admin/exams/results/${examId}/summary`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(response.data);
    } catch (error) {
      console.error("Failed to fetch summary.", error);
    }
  };

  const fetchNotAttempted = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/admin/exams/${examId}/not-attempted`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotAttempted({
        total: response.data.totalNotAttempted,
        students: response.data.students,
      });
    } catch (error) {
      console.error(
        "Failed to fetch students who have not attempted the exam.",
        error
      );
    }
  };

  const pieData = {
    labels: ["Passed", "Failed", "Not Attempted"],
    datasets: [
      {
        data: [
          summary.totalPassed || 0,
          summary.totalFailed || 0,
          notAttempted.total || 0,
        ],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
      },
    ],
  };

  return (
    <div className="view-results-container">
      <h2 className="view-results-heading">View Results</h2>

      <div className="summary-container">
        <h3>Exam Summary</h3>
        <p>Total Students Assigned: {summary.totalStudents || 0}</p>
        <p>Total Passed: {summary.totalPassed || 0}</p>
        <p>Total Failed: {summary.totalFailed || 0}</p>
        <p>Total Not Attempted: {notAttempted.total || 0}</p>
      </div>

      <div className="chart-container">
        <h3>Pass/Fail Distribution</h3>
        <Pie data={pieData} />
      </div>

      <div className="filters-container">
        <h3 className="filters-heading">Filters</h3>
        <div className="filter-group">
          <label className="filter-label">
            Status:
            <select
              className="filter-select"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  passed:
                    e.target.value === "all" ? null : e.target.value === "true",
                })
              }
            >
              <option value="all">All</option>
              <option value="true">Passed</option>
              <option value="false">Failed</option>
            </select>
          </label>
          <label className="filter-label">
            Start Date:
            <input
              className="filter-input"
              type="datetime-local"
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
          </label>
          <label className="filter-label">
            End Date:
            <input
              className="filter-input"
              type="datetime-local"
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </label>
          <button className="apply-filters-button" onClick={fetchResults}>
            Apply Filters
          </button>
        </div>
      </div>

      <table className="results-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Score</th>
            <th>Status</th>
            <th>Submitted On</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={"std" + result.id}>
              <td>{result.studentId}</td>
              <td>{result.score}</td>
              <td>{result.passed ? "Passed" : "Failed"}</td>
              <td>{new Date(result.submittedOn).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="not-attempted-container">
        <h3>Students Who Have Not Attempted the Exam</h3>
        <table className="not-attempted-table">
          <thead>
            <tr>
              <th>Student ID</th>
            </tr>
          </thead>
          <tbody>
            {notAttempted.students.map((studentId) => (
              <tr key={studentId}>
                <td>{studentId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewResults;
