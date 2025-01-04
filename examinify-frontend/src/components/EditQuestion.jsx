import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/AddQuestion.css";

const EditQuestion = ({ question, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    text: question.text,
    category: question.category,
    difficulty: question.difficulty,
    options: JSON.parse(question.options),
    correctAnswer: question.correctAnswer,
  });

  // Reset formData whenever the question prop changes
  useEffect(() => {
    setFormData({
      text: question.text,
      category: question.category,
      difficulty: question.difficulty,
      options: JSON.parse(question.options),
      correctAnswer: question.correctAnswer,
    });
  }, [question]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8081/api/admin/updateQuestion/${question.id}`,
        { ...formData, options: JSON.stringify(formData.options) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Question updated successfully.");
      onSave(); // Callback to refresh the question list
    } catch (error) {
      alert("Failed to update question.");
    }
  };

  return (
    <form className="add-question-form" onSubmit={handleSubmit}>
      <textarea
        className="question-textarea"
        placeholder="Edit question text"
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
      {[...Array(4)].map((_, index) => (
        <input
          key={"opt" + index}
          className="option-input"
          type="text"
          placeholder={`Option ${index + 1}`}
          value={formData.options[index] || ""}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          required
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
        Save Changes
      </button>
      <button
        className="submit-button cancel-button"
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
};

export default EditQuestion;
