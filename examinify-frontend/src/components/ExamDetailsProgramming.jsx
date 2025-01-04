import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/ExamDetailsProgramming.css"; // Import CSS file
import DesignProgrammingTest from "./DesignProgrammingTest";

const ExamDetailsProgramming = ({ exam, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [questionOrder, setQuestionOrder] = useState(1);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [filters, setFilters] = useState({ difficulty: "" });
  const [editableExam, setEditableExam] = useState({ ...exam });

  const token = localStorage.getItem("token");

  useEffect(() => {
    setQuestions([]);
    setQuestionOrder(1);
    setSelectedQuestions([]);
    setFilters({ difficulty: "" });
    setEditableExam({ ...exam });
    fetchSelectedQuestions();
  }, [exam]);

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
        "http://localhost:8081/api/admin/programmingQuestions",
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
        `http://localhost:8081/api/admin/exams/${exam.id}/programming-questions`,
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
        `http://localhost:8081/api/admin/exams/addProgrammingQuestion`,
        { examId: exam.id, questionId, questionOrder, marks: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSelectedQuestions();
    } catch (error) {
      console.error("Failed to add question to exam.", error);
    }
  };

  const deleteQuestionFromExam = async (examQuestionId) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/admin/exams/removeProgrammingQuestion/${examQuestionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSelectedQuestions();
    } catch (error) {
      console.error("Failed to delete question from exam.", error);
    }
  };

  const updateExamDetails = async () => {
    try {
      await axios.put(
        `http://localhost:8081/api/admin/exams/${editableExam.id}`,
        editableExam,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onClose();
    } catch (error) {
      console.error("Failed to update exam.", error);
    }
  };

  const saveChanges = async () => {
    const updates = selectedQuestions.map((q) => ({
      examQuestionId: q.id,
      newOrder: q.questionOrder,
      marks: parseInt(q.marks, 10),
    }));

    try {
      await axios.patch(
        "http://localhost:8081/api/admin/exams/updateProgrammingQuestionOrder",
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSelectedQuestions();
    } catch (error) {
      console.error("Failed to save changes.", error);
    }
  };

  return (
    <div className="exam-details-container">
      <h3 className="exam-title">Manage Exam: {exam.name}</h3>
      <div className="exam-edit-container">
        <h3>Edit Exam Details</h3>
        <div className="form-group">
          <label>Name:</label>
          <input
            className="exam-input"
            type="text"
            value={editableExam.name}
            onChange={(e) =>
              setEditableExam((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="form-group">
          <label>Duration (mins):</label>
          <input
            className="exam-input"
            type="number"
            value={editableExam.duration}
            onChange={(e) =>
              setEditableExam((prev) => ({
                ...prev,
                duration: parseInt(e.target.value, 10),
              }))
            }
          />
        </div>
        <div className="form-group">
          <label>Passing Criteria (marks):</label>
          <input
            className="exam-input"
            type="number"
            value={editableExam.passingCriteria}
            onChange={(e) =>
              setEditableExam((prev) => ({
                ...prev,
                passingCriteria: parseInt(e.target.value, 10),
              }))
            }
          />
        </div>
        <div className="form-group">
          <label>Start Date-Time:</label>
          <input
            className="exam-input"
            type="datetime-local"
            value={
              editableExam.startDateTime
                ? new Date(editableExam.startDateTime)
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setEditableExam((prev) => ({
                ...prev,
                startDateTime: e.target.value,
              }))
            }
          />
        </div>
        <div className="form-group">
          <label>End Date-Time:</label>
          <input
            className="exam-input"
            type="datetime-local"
            value={
              editableExam.endDateTime
                ? new Date(editableExam.endDateTime).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setEditableExam((prev) => ({
                ...prev,
                endDateTime: e.target.value,
              }))
            }
          />
        </div>
        <button className="save-changes-button" onClick={updateExamDetails}>
          Save Changes
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>

      <h4>Exam Questions</h4>
      <table className="questions-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {selectedQuestions.map((q) => (
            <tr key={q.id}>
              <td>
                <input
                  className="question-order-input"
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
              <td>{q.questionIdProgrammingQuestion.title}</td>
              <td>
                <input
                  className="marks-input"
                  type="number"
                  value={q.marks}
                  onChange={(e) =>
                    setSelectedQuestions((prev) =>
                      prev.map((item) =>
                        item.id === q.id
                          ? { ...item, marks: parseInt(e.target.value, 10) }
                          : item
                      )
                    )
                  }
                />
              </td>
              <td>
                <button
                  className="delete-question-button"
                  onClick={() => deleteQuestionFromExam(q.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="save-questions-button" onClick={saveChanges}>
        Save Question Changes
      </button>

      <h4>Available Questions</h4>
      <table className="questions-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td>{q.title}</td>
              <td>{q.difficulty}</td>
              <td>
                <button
                  className="add-question-button"
                  onClick={() => addQuestionToExam(q.id)}
                >
                  Add to Exam
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DesignProgrammingTest examId={exam.id} />
    </div>
  );
};

export default ExamDetailsProgramming;
