import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/ManageQuestions.css";
import EditQuestion from "./EditQuestion";

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [message, setMessage] = useState("");
  const [editQuestionId, setEditQuestionId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const fetchAllQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/admin/questions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuestions(response.data);
    } catch (error) {
      setMessage("Failed to fetch questions.");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/admin/deleteQuestion/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Question deleted successfully.");
      fetchAllQuestions(); // Refresh question list
    } catch (error) {
      setMessage("Failed to delete question.");
    }
  };

  const handleDeleteMultipleQuestions = async () => {
    try {
      await axios.delete(
        "http://localhost:8081/api/admin/deleteMultipleQuestions",
        {
          data: selectedQuestions,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Selected questions deleted successfully.");
      fetchAllQuestions(); // Refresh question list
    } catch (error) {
      setMessage("Failed to delete selected questions.");
    }
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/admin/questions`,
        {
          params: {
            category: categoryFilter || undefined,
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
    <div className="manage-questions-container">
      <h2 className="manage-questions-heading">Manage Questions</h2>
      <div className="filters-container">
        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Filter by Category</option>
          <option value="LOGICAL">Logical</option>
          <option value="TECHNICAL">Technical</option>
          <option value="PROGRAMMING">Programming</option>
        </select>
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

      <table className="questions-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Question</th>
            <th>Category</th>
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
              <td>{question.text}</td>
              <td>{question.category}</td>
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
        <EditQuestion
          question={questions.find((q) => q.id === editQuestionId)}
          onCancel={() => setEditQuestionId(null)}
          onSave={() => {
            fetchAllQuestions();
            setEditQuestionId(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageQuestions;
