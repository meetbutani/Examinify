import React, { useState } from "react";
import axios from "axios";

const DesignTest = ({ examId }) => {
  const [categoryCounts, setCategoryCounts] = useState({
    LOGICAL: 0,
    TECHNICAL: 0,
    PROGRAMMING: 0,
  });
  const [difficultyCounts, setDifficultyCounts] = useState({
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
  });

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
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
    <div>
      <h3>Design Test</h3>
      <div>
        <h4>By Category</h4>
        {Object.keys(categoryCounts).map((category) => (
          <div key={category}>
            <label>{category}</label>
            <input
              type="number"
              value={categoryCounts[category]}
              onChange={(e) =>
                setCategoryCounts({
                  ...categoryCounts,
                  [category]: parseInt(e.target.value),
                })
              }
            />
          </div>
        ))}
      </div>
      <div>
        <h4>By Difficulty</h4>
        {Object.keys(difficultyCounts).map((difficulty) => (
          <div key={difficulty}>
            <label>{difficulty}</label>
            <input
              type="number"
              value={difficultyCounts[difficulty]}
              onChange={(e) =>
                setDifficultyCounts({
                  ...difficultyCounts,
                  [difficulty]: parseInt(e.target.value),
                })
              }
            />
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default DesignTest;
