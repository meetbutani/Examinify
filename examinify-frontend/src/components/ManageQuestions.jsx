import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [message, setMessage] = useState("");

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

  const handleEditQuestion = async (questionId, updatedQuestion) => {
    try {
      await axios.put(
        `http://localhost:8081/api/admin/updateQuestion/${questionId}`,
        updatedQuestion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Question updated successfully.");
      fetchAllQuestions(); // Refresh question list
    } catch (error) {
      setMessage("Failed to update question.");
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
    <div>
      <h2>Manage Questions</h2>
      <div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Filter by Category</option>
          <option value="LOGICAL">Logical</option>
          <option value="TECHNICAL">Technical</option>
          <option value="PROGRAMMING">Programming</option>
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="">Filter by Difficulty</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <button onClick={handleFilter}>Apply Filters</button>
      </div>
      <br />
      <button
        onClick={handleDeleteMultipleQuestions}
        disabled={selectedQuestions.length === 0}
      >
        Delete Selected Questions
      </button>
      <br />
      {message && <p>{message}</p>}
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <input
              type="checkbox"
              checked={selectedQuestions.includes(question.id)}
              onChange={() => handleSelectQuestion(question.id)}
            />
            {question.text} | {question.category} | {question.difficulty}
            <button onClick={() => handleDeleteQuestion(question.id)}>
              Delete
            </button>
            <button
              onClick={() =>
                handleEditQuestion(question.id, {
                  text: "Updated question text", // Replace with form data
                  category: "LOGICAL",
                  difficulty: "MEDIUM",
                  correctAnswer: "Option1",
                  options: JSON.stringify(["Option1", "Option2"]),
                })
              }
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageQuestions;
