import React, { useState, useEffect } from "react";
import { CodeiumEditor } from "@codeium/react-code-editor";
import axios from "axios";
import "../assets/css/ExamProgrammingInterface.css";

const ExamProgrammingInterface = ({
  exam,
  examId,
  examineeId,
  examDuration,
  onClose,
}) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(examDuration);
  const [language, setLanguage] = useState("java");
  const [tabChangeCount, setTabChangeCount] = useState(2);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuestions();
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/examinee/exam/${examId}/programming-questions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions.", error);
    }
  };

  const handleCodeSubmit = async (questionId, submittedCode) => {
    try {
      await axios.post(
        `http://localhost:8081/api/examinee/exam/${examId}/programming-answer`,
        {
          examineeId,
          questionId,
          submittedCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnswers((prev) => ({ ...prev, [questionId]: submittedCode }));
      alert("Answer saved successfully.");
    } catch (error) {
      console.error("Error saving answer:", error);
      alert("Error saving the answer.");
    }
  };

  const handleSubmitExam = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/api/examinee/exam/${examId}/submit-programming`,
        examineeId,
        {
          headers: {
            "Content-Type": "text/plain",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onClose();
      alert(
        `Exam submitted successfully! \nScore: ${
          response.data.score
        } \nPassed: ${response.data.passed ? "Yes" : "No"}`
      );
    } catch (error) {
      console.error("Error submitting the exam.", error);
      alert("An error occurred while submitting the exam.");
    }
  };

  // useEffect(() => {
  //   const autoSave = setInterval(() => {
  //     const question = questions[currentQuestionIndex];
  //     if (question && answers[question.id]) {
  //       handleCodeSubmit(question.id, answers[question.id]);
  //     }
  //   }, 30000); // Save every 30 seconds
  //   return () => clearInterval(autoSave);
  // }, [currentQuestionIndex, answers]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitExam();
      onClose();
    }
  }, [timeLeft]);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const handleCopy = (e) => {
      const activeElement = document.activeElement;
      if (
        !(
          activeElement.tagName === "TEXTAREA" &&
          activeElement.getAttribute("role") === "textbox" &&
          activeElement.getAttribute("aria-roledescription") === "editor"
        )
      ) {
        alert("🚫 Copying content is not allowed during the exam.");
        e.preventDefault();
      }
    };

    const handlePaste = (e) => {
      const activeElement = document.activeElement;

      if (
        !(
          activeElement.tagName === "TEXTAREA" &&
          activeElement.getAttribute("role") === "textbox" &&
          activeElement.getAttribute("aria-roledescription") === "editor"
        )
      ) {
        alert("🚫 Pasting content is not allowed during the exam.");
        e.preventDefault();
      }
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
      //     handleSubmitExam();
      //   }
      // }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tabChangeCount]);

  return (
    <div className="programming-exam-container">
      {/* Side Panel */}
      <div className="question-list-panel">
        {questions.map((question, index) => (
          <button
            key={question.id}
            className={`question-button ${
              answers[question.id] ? "answered" : "unanswered"
            }`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            Q{index + 1}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="question-panel">
        <h2 className="exam-title">Programming Exam</h2>
        <p className="time-left">
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
        </p>
        {currentQuestion && (
          <div className="question-content">
            <h3 className="question-title">
              {currentQuestion.questionIdProgrammingQuestion.title}
            </h3>
            <p className="question-description">
              {currentQuestion.questionIdProgrammingQuestion.description}
            </p>
            <h4>Constraints:</h4>
            <div className="question-constraints">
              {currentQuestion.questionIdProgrammingQuestion.constraints}
            </div>
            <h4>Sample Test Cases:</h4>
            <div className="sample-test-cases">
              {currentQuestion.questionIdProgrammingQuestion.sampleTestCases &&
                JSON.parse(
                  currentQuestion.questionIdProgrammingQuestion.sampleTestCases
                ).map((testCase, index) => (
                  <div key={index} className="test-case">
                    <strong>Test Case {index + 1}:</strong>
                    <div>
                      <strong>Input:</strong> {testCase.input}
                    </div>
                    <div>
                      <strong>Output:</strong> {testCase.output}
                    </div>
                    <div>
                      <strong>Explanation:</strong> {testCase.explanation}
                    </div>
                  </div>
                ))}
            </div>

            <h4>Select Language:</h4>
            <select
              className="language-selector"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>

            <h4>Write your code:</h4>
            <CodeiumEditor
              id="special-code-editor"
              height="300px"
              language={language}
              theme="vs-dark"
              options={{ readOnly: false, theme: "vs-dark" }}
              value={answers[currentQuestion.id] || ""}
              onChange={(value) =>
                setAnswers((prev) => ({
                  ...prev,
                  [currentQuestion.id]: value,
                }))
              }
            />
            <button
              className="save-code-button"
              onClick={() =>
                handleCodeSubmit(
                  currentQuestion.id,
                  answers[currentQuestion.id] || ""
                )
              }
            >
              Save Code
            </button>
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
        )}
        <button
          className="submit-button"
          onClick={() => {
            if (window.confirm("Are you sure you want to submit the exam?"))
              handleSubmitExam();
          }}
        >
          Submit Exam
        </button>
      </div>
    </div>
  );
};

export default ExamProgrammingInterface;
