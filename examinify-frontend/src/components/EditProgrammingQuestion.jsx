import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/AddProgrammingQuestion.css";

const EditProgrammingQuestion = ({ question, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    ...question,
    sampleTestCases: JSON.parse(question["sampleTestCases"]),
    hiddenTestCases: JSON.parse(question["hiddenTestCases"]),
  });

  useEffect(() => {
    setFormData({
      ...question,
      sampleTestCases: JSON.parse(question["sampleTestCases"]),
      hiddenTestCases: JSON.parse(question["hiddenTestCases"]),
    });
  }, [question]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8081/api/admin/updateProgrammingQuestion/${question.id}`,
        {
          ...formData,
          sampleTestCases: JSON.stringify(formData["sampleTestCases"]),
          hiddenTestCases: JSON.stringify(formData["hiddenTestCases"]),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSave();
    } catch (error) {
      alert("Failed to update programming question.");
    }
  };

  const handleTestCaseChange = (type, index, field, value) => {
    const updatedTestCases = [...formData[type]];
    updatedTestCases[index][field] = value;
    setFormData({ ...formData, [type]: updatedTestCases });
  };

  const addTestCase = (type) => {
    const newTestCase =
      type === "sampleTestCases"
        ? { input: "", output: "", explanation: "" }
        : { input: "", output: "" };
    setFormData({ ...formData, [type]: [...formData[type], newTestCase] });
  };

  const removeTestCase = (type, index) => {
    const updatedTestCases = [...formData[type]];
    updatedTestCases.splice(index, 1); // Remove the test case at the specified index
    setFormData({ ...formData, [type]: updatedTestCases });
  };

  return (
    <form className="programming-question-form" onSubmit={handleSubmit}>
      <input
        className="form-input"
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        className="form-textarea"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        required
      />
      <select
        className="form-select"
        value={formData.difficulty}
        onChange={(e) =>
          setFormData({ ...formData, difficulty: e.target.value })
        }
      >
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      <textarea
        placeholder="Constraints"
        className="form-textarea"
        value={formData.constraints}
        onChange={(e) =>
          setFormData({ ...formData, constraints: e.target.value })
        }
      />
      <h4>Sample Test Cases</h4>
      {formData.sampleTestCases.map((testCase, index) => (
        <div className="test-case-container" key={`sample-${index}`}>
          <textarea
            className="test-case-input"
            type="text"
            placeholder="Input"
            value={testCase.input}
            onChange={(e) =>
              handleTestCaseChange(
                "sampleTestCases",
                index,
                "input",
                e.target.value
              )
            }
          />
          <textarea
            className="test-case-input"
            type="text"
            placeholder="Output"
            value={testCase.output}
            onChange={(e) =>
              handleTestCaseChange(
                "sampleTestCases",
                index,
                "output",
                e.target.value
              )
            }
          />
          <textarea
            className="test-case-input"
            placeholder="Explanation"
            value={testCase.explanation}
            onChange={(e) =>
              handleTestCaseChange(
                "sampleTestCases",
                index,
                "explanation",
                e.target.value
              )
            }
          />
          <button
            className="test-case-button remove-button"
            type="button"
            onClick={() => removeTestCase("sampleTestCases", index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="test-case-button add-button"
        type="button"
        onClick={() => addTestCase("sampleTestCases")}
      >
        Add Sample Test Case
      </button>
      <h4>Hidden Test Cases</h4>
      {formData.hiddenTestCases.map((testCase, index) => (
        <div className="test-case-container" key={`hidden-${index}`}>
          <textarea
            className="test-case-input"
            type="text"
            placeholder="Input"
            value={testCase.input}
            onChange={(e) =>
              handleTestCaseChange(
                "hiddenTestCases",
                index,
                "input",
                e.target.value
              )
            }
          />
          <textarea
            type="text"
            className="test-case-input"
            placeholder="Output"
            value={testCase.output}
            onChange={(e) =>
              handleTestCaseChange(
                "hiddenTestCases",
                index,
                "output",
                e.target.value
              )
            }
          />
          <button
            className="test-case-button remove-button"
            type="button"
            onClick={() => removeTestCase("hiddenTestCases", index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="test-case-button add-button"
        type="button"
        onClick={() => addTestCase("hiddenTestCases")}
      >
        Add Hidden Test Case
      </button>
      <button className="submit-button" type="submit">
        Save
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

export default EditProgrammingQuestion;
