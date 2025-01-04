import React, { useState } from "react";
import axios from "axios";
import "../assets/css/DesignProgrammingTest.css";

const DesignProgrammingTest = ({ examId }) => {
  const [difficultyCounts, setDifficultyCounts] = useState({
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
  });

  const handleInputChange = (difficulty, value) => {
    setDifficultyCounts((prev) => ({
      ...prev,
      [difficulty]: parseInt(value, 10),
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:8081/api/admin/exams/${examId}/designProgrammingTest`,
        difficultyCounts,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Programming test designed successfully!");
    } catch (err) {
      alert("Error designing programming test: " + err.message);
    }
  };

  return (
    <div className="design-programming-container">
      <h3 className="design-programming-heading">Design Programming Test</h3>
      {Object.keys(difficultyCounts).map((difficulty) => (
        <div className="difficulty-input-container" key={difficulty}>
          <label className="difficulty-label">
            {difficulty}:
            <input
              className="difficulty-input"
              type="number"
              min="0"
              value={difficultyCounts[difficulty]}
              onChange={(e) => handleInputChange(difficulty, e.target.value)}
            />
          </label>
        </div>
      ))}
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default DesignProgrammingTest;
