import React, { useState, useEffect } from "react";
import axios from "axios";
import DesignTest from "./DesignTest";

const ExamDetails = ({ exam, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [questionOrder, setQuestionOrder] = useState(1);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [filters, setFilters] = useState({ category: "", difficulty: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  useEffect(() => {
    fetchSelectedQuestions();
  }, []);

  useEffect(() => {
    setQuestionOrder(selectedQuestions.length + 1);
  }, [selectedQuestions]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/admin/questions",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: filters,
        }
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions.", error);
    }
  };

  const fetchSelectedQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/admin/exams/${exam.id}/questions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch exam questions.", error);
    }
  };

  const addQuestionToExam = async (questionId) => {
    try {
      await axios.post(
        `http://localhost:8081/api/admin/exams/addQuestion`,
        { examId: exam.id, questionId, questionOrder, marks: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Question added successfully.");
      fetchSelectedQuestions();
    } catch (error) {
      if (error.response.status === 409) {
        console.log("Question already added to this exam.");
      } else {
        console.error("Failed to add question to exam.", error);
      }
    }
  };

  const deleteQuestionFromExam = async (examQuestionId) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/admin/exams/removeQuestion/${examQuestionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Question deleted successfully.");
      fetchSelectedQuestions();
    } catch (error) {
      console.error("Failed to delete question from exam.", error);
    }
  };

  const saveChanges = async () => {
    const updates = selectedQuestions.map((q) => ({
      examQuestionId: q.id,
      newOrder: q.questionOrder,
      marks: q.marks,
    }));

    try {
      await axios.patch(
        "http://localhost:8081/api/admin/exams/updateQuestionOrder",
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Changes saved successfully.");
      fetchSelectedQuestions();
    } catch (error) {
      console.error("Failed to save changes.", error);
    }
  };

  return (
    <div>
      <h3>Manage Exam: {exam.name}</h3>
      <button onClick={onClose}>Close</button>
      <h4>Exam Questions</h4>
      <table>
        <tbody>
          {selectedQuestions.map((q) => (
            <tr key={q.id}>
              <td>
                <input
                  type="number"
                  value={q.questionOrder}
                  onChange={(e) =>
                    setSelectedQuestions((prev) =>
                      prev.map((item) =>
                        item.id === q.id
                          ? { ...item, questionOrder: e.target.value }
                          : item
                      )
                    )
                  }
                />
              </td>
              <td>{q.questionIdQuestion.text}</td>
              <td>
                <input
                  type="number"
                  value={q.marks}
                  onChange={(e) =>
                    setSelectedQuestions((prev) =>
                      prev.map((item) =>
                        item.id === q.id
                          ? { ...item, marks: e.target.value }
                          : item
                      )
                    )
                  }
                />
              </td>
              <td>
                <button onClick={() => deleteQuestionFromExam(q.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={saveChanges}>Save Changes</button>
      <h4>All Questions</h4>
      <div>
        <select
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="LOGICAL">Logical</option>
          <option value="TECHNICAL">Technical</option>
          <option value="PROGRAMMING">Programming</option>
        </select>
        <select
          onChange={(e) =>
            setFilters({ ...filters, difficulty: e.target.value })
          }
        >
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td>{q.text}</td>
              <td>{q.category}</td>
              <td>{q.difficulty}</td>
              <td>
                <button onClick={() => addQuestionToExam(q.id)}>
                  Add to Exam
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DesignTest examId={exam.id} />
    </div>
  );
};

export default ExamDetails;
