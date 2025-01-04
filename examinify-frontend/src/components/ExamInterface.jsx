import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/ExamInterface.css";

const ExamInterface = ({ exam, examId, examineeId, examDuration, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(examDuration);
  const [tabChangeCount, setTabChangeCount] = useState(2);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuestions();
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      onClose();
    }
  }, [timeLeft]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/examinee/exam/${examId}/questions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions(response.data);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Failed to fetch questions.", error);
    }
  };

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers({ ...answers, [questionId]: selectedAnswer });
    saveAnswer(questionId, selectedAnswer);
  };

  const saveAnswer = async (questionId, selectedAnswer) => {
    try {
      await axios.post(
        `http://localhost:8081/api/examinee/exam/${examId}/answer`,
        { examineeId, questionId, selectedAnswer },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Answer saved successfully.");
    } catch (error) {
      console.error("Failed to save the answer:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/api/examinee/exam/${examId}/submit`,
        examineeId,
        {
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(
        `Exam submitted successfully!\nScore: ${response.data.score}\nPassed: ${
          response.data.passed ? "Yes" : "No"
        }`
      );
      onClose();
    } catch (error) {
      console.error("Failed to submit the exam:", error);
      alert("Error occurred while submitting the exam.");
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const handleCopy = (e) => {
      alert("🚫 Copying content is not allowed during the exam.");
      e.preventDefault();
    };

    const handlePaste = (e) => {
      alert("🚫 Pasting content is not allowed during the exam.");
      e.preventDefault();
    };

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "❗ Warning: You are attempting to close the browser. If you proceed, your exam status will be saved, and the session will be terminated.";
    };

    const handleNetworkChange = () => {
      if (!navigator.onLine) {
        alert("🔌 You are offline! Please reconnect to continue the exam.");
      } else {
        alert("✅ You are back online! You can now continue the exam.");
      }
    };

    const blockCertainKeys = (event) => {
      const restrictedKeys = ["Alt", "Tab"];
      if (restrictedKeys.includes(event.key)) {
        alert(
          "🚫 The use of certain keys, such as Alt, Tab is restricted during the exam."
        );
        event.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    window.addEventListener("offline", handleNetworkChange);
    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("keydown", blockCertainKeys);

    // Clean up event listeners
    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      window.removeEventListener("offline", handleNetworkChange);
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("keydown", blockCertainKeys);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // if (document.hidden) {
      //   if (tabChangeCount > 0) {
      //     alert(
      //       `⚠️ Attention! Switching tabs is not allowed during the exam. ${
      //         tabChangeCount === 2
      //           ? "You have 1 attempt remaining to return to this tab."
      //           : "This is your last chance. Further tab switches will submit the exam."
      //       }`
      //     );
      //     setTabChangeCount((prevCount) => prevCount - 1);
      //   } else {
      //     alert(
      //       "⛔ You have exceeded the allowed tab switches. Submitting your exam now."
      //     );
      //     handleSubmit();
      //   }
      // }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tabChangeCount]);

  return (
    <div className="exam-interface-container">
      <div className="side-panel">
        {questions.map((question, index) => (
          <button
            key={index}
            className={`question-button ${
              answers[question.questionId] ? "answered" : "unanswered"
            }`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            Q{index + 1}
          </button>
        ))}
      </div>
      <div className="main-panel">
        <h2 className="exam-title">Exam Interface</h2>
        <p className="time-left">
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
        </p>
        {currentQuestion ? (
          <div className="question-container">
            <p className="question-text">
              Question {currentQuestionIndex + 1}:{" "}
              {currentQuestion.questionIdQuestion.text}
            </p>
            <div className="options-container">
              {JSON.parse(currentQuestion.questionIdQuestion.options).map(
                (option, index) => (
                  <div key={index} className="option">
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name={`question-${currentQuestion.questionId}`}
                      checked={answers[currentQuestion.questionId] === option}
                      onChange={() =>
                        handleAnswerSelect(currentQuestion.questionId, option)
                      }
                    />
                    <label htmlFor={`option-${index}`}>{option}</label>
                  </div>
                )
              )}
            </div>
            <div className="navigation-buttons">
              <button
                className="prev-button"
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
                }
              >
                Previous
              </button>
              <button
                className="next-button"
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(prev + 1, questions.length - 1)
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <button
          className="submit-button"
          onClick={() => {
            if (window.confirm("Are you sure you want to submit the exam?"))
              handleSubmit();
          }}
        >
          Submit Exam
        </button>
      </div>
    </div>
  );
};

export default ExamInterface;
