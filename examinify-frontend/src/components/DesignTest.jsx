import React, { useState } from "react";
import axios from "axios";
import "../assets/css/DesignTest.css";

const DesignTest = ({ examId }) => {
  const [questionsConfig, setQuestionsConfig] = useState({
    LOGICAL: { EASY: 0, MEDIUM: 0, HARD: 0 },
    TECHNICAL: { EASY: 0, MEDIUM: 0, HARD: 0 },
    PROGRAMMING: { EASY: 0, MEDIUM: 0, HARD: 0 },
  });

  const handleInputChange = (category, difficulty, value) => {
    setQuestionsConfig((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [difficulty]: parseInt(value, 10),
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const categoryCounts = {};
      const difficultyCounts = {};

      // Flatten the nested structure for API payload
      Object.entries(questionsConfig).forEach(([category, difficulties]) => {
        categoryCounts[category] = Object.values(difficulties).reduce(
          (sum, count) => sum + count,
          0
        );
        Object.entries(difficulties).forEach(([difficulty, count]) => {
          difficultyCounts[difficulty] =
            (difficultyCounts[difficulty] || 0) + count;
        });
      });

      await axios.post(
        `http://localhost:8081/api/admin/exams/${examId}/designTest`,
        { categoryCounts, difficultyCounts },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Test designed successfully!");
    } catch (err) {
      alert("Error designing test: " + err.message);
    }
  };

  return (
    <div className="design-test-container">
      <h3 className="design-test-heading">Design Test</h3>
      {Object.keys(questionsConfig).map((category) => (
        <div className="category-container" key={category}>
          <h4 className="category-title">{category}</h4>
          {Object.keys(questionsConfig[category]).map((difficulty) => (
            <div className="difficulty-input-container" key={difficulty}>
              <label className="difficulty-label">
                {difficulty}:
                <input
                  className="difficulty-input"
                  type="number"
                  min="0"
                  value={questionsConfig[category][difficulty]}
                  onChange={(e) =>
                    handleInputChange(category, difficulty, e.target.value)
                  }
                />
              </label>
            </div>
          ))}
        </div>
      ))}
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default DesignTest;
