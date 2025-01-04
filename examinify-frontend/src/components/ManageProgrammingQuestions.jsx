import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/ManageProgrammingQuestion.css";
import EditProgrammingQuestion from "./EditProgrammingQuestion";

const ManageProgrammingQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [message, setMessage] = useState("");
  const [editQuestionId, setEditQuestionId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProgrammingQuestions();
  }, []);

  const fetchProgrammingQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/admin/programmingQuestions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuestions(response.data);
    } catch (error) {
      setMessage("Failed to fetch programming questions.");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/admin/deleteProgrammingQuestion/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Question deleted successfully.");
      fetchProgrammingQuestions();
    } catch (error) {
      setMessage("Failed to delete question.");
    }
  };

  const handleDeleteMultipleQuestions = async () => {
    try {
      await axios.delete(
        "http://localhost:8081/api/admin/deleteMultipleProgrammingQuestions",
        {
          data: selectedQuestions,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Selected questions deleted successfully.");
      fetchProgrammingQuestions();
    } catch (error) {
      setMessage("Failed to delete selected questions.");
    }
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/admin/programmingQuestions`,
        {
          params: {
            difficulty: difficultyFilter || undefined,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuestions(response.data);
    } catch (error) {
      setMessage("Filter failed.");
    }
  };

  const handleSelectQuestion = (questionId) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(questionId)
        ? prevSelected.filter((id) => id !== questionId)
        : [...prevSelected, questionId]
    );
  };

  return (
    <div className="manage-programming-container">
      <h2 className="manage-programming-heading">
        Manage Programming Questions
      </h2>
      <div className="filter-container">
        <select
          className="filter-select"
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="">Filter by Difficulty</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <button className="filter-button" onClick={handleFilter}>
          Apply Filters
        </button>
      </div>
      <button
        className="delete-selected-button"
        onClick={handleDeleteMultipleQuestions}
        disabled={selectedQuestions.length === 0}
      >
        Delete Selected Questions
      </button>
      {message && <p className="message-text">{message}</p>}

      <table className="programming-questions-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={selectedQuestions.includes(question.id)}
                  onChange={() => handleSelectQuestion(question.id)}
                />
              </td>
              <td>{question.title}</td>
              <td>{question.difficulty}</td>
              <td>
                <button
                  className="action-button delete-action"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  Delete
                </button>
                <button
                  className="action-button edit-action"
                  onClick={() => {
                    setEditQuestionId(null);
                    setEditQuestionId(question.id);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editQuestionId && (
        <EditProgrammingQuestion
          question={questions.find((q) => q.id === editQuestionId)}
          onCancel={() => setEditQuestionId(null)}
          onSave={() => {
            fetchProgrammingQuestions();
            setEditQuestionId(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageProgrammingQuestion;
