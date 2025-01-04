import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/ViewResults.css";

const ViewResults = ({ examId }) => {
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    passed: null,
    startDate: "",
    endDate: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchResults();
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
      if (error.status === 404) setResults([]);
      console.error("Failed to fetch results.", error);
    }
  };

  return (
    <div className="view-results-container">
      <h2 className="view-results-heading">View Results</h2>

      {/* Filters */}
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

      {/* Results Table */}
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
            <tr key={result.id}>
              <td>{result.studentId}</td>
              <td>{result.score}</td>
              <td>{result.passed ? "Passed" : "Failed"}</td>
              <td>{new Date(result.submittedOn).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewResults;
