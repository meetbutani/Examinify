import React, { useState, useEffect } from "react";
import axios from "axios";

const ExamInterface = ({ examId, examineeId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1-hour timer in seconds

  useEffect(() => {
    fetchQuestions();
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.addEventListener("copy", (e) => e.preventDefault());
    document.addEventListener("paste", (e) => e.preventDefault());
    return () => {
      document.removeEventListener("copy", (e) => e.preventDefault());
      document.removeEventListener("paste", (e) => e.preventDefault());
    };
  }, []);

  const fetchQuestions = async () => {
    const response = await axios.get(`/api/exam/${examId}/questions`);
    setQuestions(response.data);
  };

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers({ ...answers, [questionId]: selectedAnswer });
    saveAnswer(questionId, selectedAnswer);
  };

  const saveAnswer = async (questionId, selectedAnswer) => {
    await axios.post(`/api/exam/${examId}/answer`, {
      examineeId,
      questionId,
      selectedAnswer,
    });
  };

  const handleSubmit = async () => {
    await axios.post(`/api/exam/${examId}/submit`, { examineeId });
    alert("Exam submitted successfully.");
  };

  if (timeLeft <= 0) {
    handleSubmit();
  }

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div>
      <h2>Exam Interface</h2>
      {timeLeft > 0 ? (
        <p>
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
        </p>
      ) : (
        <p>Submitting exam...</p>
      )}
      {currentQuestion ? (
        <div>
          <p>
            Question {currentQuestionIndex + 1}: {currentQuestion.text}
          </p>
          {JSON.parse(currentQuestion.options).map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                checked={answers[currentQuestion.id] === option}
                onChange={() => handleAnswerSelect(currentQuestion.id, option)}
              />
              <label>{option}</label>
            </div>
          ))}
          <button
            onClick={() =>
              setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
            }
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentQuestionIndex((prev) =>
                Math.min(prev + 1, questions.length - 1)
              )
            }
          >
            Next
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={handleSubmit}>Submit Exam</button>
    </div>
  );
};

export default ExamInterface;
