import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/AssignStudents.css";

const AssignStudents = ({ examId }) => {
  const [allStudents, setAllStudents] = useState([]);
  const [examStudents, setExamStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAllStudents();
    fetchExamStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/admin/exams/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch all students.", error);
    }
  };

  const fetchExamStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/admin/exams/students/${examId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExamStudents(response.data.map((item) => item.student));
    } catch (error) {
      console.error("Failed to fetch exam students.", error);
    }
  };

  const assignStudents = async () => {
    try {
      await axios.post(
        `http://localhost:8081/api/admin/exams/assign-students/${examId}`,
        selectedStudents,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchExamStudents();
      setSelectedStudents([]);
    } catch (error) {
      console.error("Failed to assign students.", error);
    }
  };

  const deleteAssignedStudents = async (studentIds) => {
    try {
      await axios.post(
        `http://localhost:8081/api/admin/exams/remove-students/${examId}`,
        studentIds,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchExamStudents();
      setSelectedForDelete([]);
    } catch (error) {
      console.error("Failed to delete assigned students.", error);
    }
  };

  const toggleSelection = (studentId, list, setList) => {
    setList((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const filterStudents = (students) => {
    return students.filter(
      (student) =>
        student.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.enrollmentNo
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.universityCollegeName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  };

  const availableStudents = filterStudents(
    allStudents.filter(
      (student) =>
        !examStudents.some(
          (examStudent) => examStudent.studentId === student.studentId
        )
    )
  );

  return (
    <div className="assign-students-container">
      <h3 className="assign-students-heading">Assign Students</h3>
      <input
        className="search-input"
        type="text"
        placeholder="Search students..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <h4 className="section-title">Assigned Students</h4>
      <table className="students-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Enrollment No.</th>
            <th>Email</th>
            <th>College</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterStudents(examStudents).map((student) => (
            <tr key={student.studentId}>
              <td>
                <input
                  type="checkbox"
                  onChange={() =>
                    toggleSelection(
                      student.studentId,
                      selectedForDelete,
                      setSelectedForDelete
                    )
                  }
                  checked={selectedForDelete.includes(student.studentId)}
                />
              </td>
              <td>{student.studentId}</td>
              <td>{student.firstname}</td>
              <td>{student.lastname}</td>
              <td>{student.enrollmentNo}</td>
              <td>{student.email}</td>
              <td>{student.universityCollegeName}</td>
              <td>
                <button
                  className="remove-button"
                  onClick={() => deleteAssignedStudents([student.studentId])}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="action-button"
        onClick={() => deleteAssignedStudents(selectedForDelete)}
      >
        Remove Selected
      </button>

      <h4 className="section-title">Available Students</h4>
      <table className="students-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Enrollment No.</th>
            <th>Email</th>
            <th>College</th>
          </tr>
        </thead>
        <tbody>
          {availableStudents.map((student) => (
            <tr key={student.studentId}>
              <td>
                <input
                  type="checkbox"
                  onChange={() =>
                    toggleSelection(
                      student.studentId,
                      selectedStudents,
                      setSelectedStudents
                    )
                  }
                  checked={selectedStudents.includes(student.studentId)}
                />
              </td>
              <td>{student.studentId}</td>
              <td>{student.firstname}</td>
              <td>{student.lastname}</td>
              <td>{student.enrollmentNo}</td>
              <td>{student.email}</td>
              <td>{student.universityCollegeName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="action-button" onClick={assignStudents}>
        Assign
      </button>
    </div>
  );
};

export default AssignStudents;
