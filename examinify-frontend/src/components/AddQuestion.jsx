import React, { useState } from "react";
import axios from "axios";
import "../assets/css/AddQuestion.css";

const AddQuestion = () => {
  const [formData, setFormData] = useState({
    text: "",
    category: "LOGICAL",
    difficulty: "EASY",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8081/api/admin/addQuestion",
        { ...formData, options: JSON.stringify(formData.options) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data);
    } catch (error) {
      alert("Failed to add question.");
    }
  };

  return (
    <form className="add-question-form" onSubmit={handleSubmit}>
      <textarea
        className="question-textarea"
        placeholder="Enter question text"
        value={formData.text}
        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        required
      />
      <select
        className="question-select"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      >
        <option value="LOGICAL">Logical (Aptitude)</option>
        <option value="TECHNICAL">Technical</option>
        <option value="PROGRAMMING">Programming</option>
      </select>
      <select
        className="question-select"
        value={formData.difficulty}
        onChange={(e) =>
          setFormData({ ...formData, difficulty: e.target.value })
        }
      >
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      {formData.options.map((option, index) => (
        <input
          key={"opt" + index}
          className="option-input"
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          required={index < 2}
        />
      ))}
      <input
        className="answer-input"
        type="text"
        placeholder="Correct Answer"
        value={formData.correctAnswer}
        onChange={(e) =>
          setFormData({ ...formData, correctAnswer: e.target.value })
        }
        required
      />
      <button className="submit-button" type="submit">
        Add Question
      </button>
    </form>
  );
};

export default AddQuestion;
