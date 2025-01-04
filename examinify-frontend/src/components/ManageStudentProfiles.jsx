import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/ManageStudentProfiles.css";

const ManageStudentProfiles = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [message, setMessage] = useState("");
  const [editStudent, setEditStudent] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/admin/getAllStudents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(response.data);
    } catch (error) {
      setMessage("Failed to fetch student profiles.");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/admin/searchStudents?query=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(response.data);
    } catch (error) {
      setMessage("Search failed.");
    }
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/admin/filterByCollege?universityCollegeName=${collegeFilter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(response.data);
    } catch (error) {
      setMessage("Filter failed.");
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/admin/deleteStudentProfile/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Student deleted successfully.");
      fetchAllStudents();
    } catch (error) {
      setMessage("Failed to delete student.");
    }
  };

  const handleDeleteMultipleStudents = async () => {
    try {
      await axios.delete(
        "http://localhost:8081/api/admin/deleteMultipleStudents",
        {
          data: selectedStudents,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Selected students deleted successfully.");
      fetchAllStudents();
    } catch (error) {
      setMessage("Failed to delete selected students.");
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleUpdateStudent = async () => {
    try {
      await axios.put(
        `http://localhost:8081/api/admin/updateStudentProfile/${editStudent.studentId}`,
        editStudent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Student profile updated successfully.");
      fetchAllStudents();
      setEditStudent(null);
    } catch (error) {
      setMessage("Failed to update student profile.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStudent((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="manage-container">
      <h2 className="manage-heading">Manage Student Profiles</h2>
      <div className="manage-filters">
        <input
          type="text"
          className="filter-input"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="filter-button" onClick={handleSearch}>
          Search
        </button>
        <input
          type="text"
          className="filter-input"
          placeholder="Filter by College"
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
        />
        <button className="filter-button" onClick={handleFilter}>
          Filter
        </button>
      </div>
      <button
        className="delete-button"
        onClick={handleDeleteMultipleStudents}
        disabled={selectedStudents.length === 0}
      >
        Delete Selected Students
      </button>
      {message && <p className="message-text">{message}</p>}
      <table className="students-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>University/College</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.studentId}>
              <td>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedStudents.includes(student.studentId)}
                  onChange={() => handleSelectStudent(student.studentId)}
                />
              </td>
              <td>{student.studentId}</td>
              <td>{student.firstname}</td>
              <td>{student.lastname}</td>
              <td>{student.email}</td>
              <td>{student.universityCollegeName}</td>
              <td>
                <button
                  className="action-button delete-action"
                  onClick={() => handleDeleteStudent(student.studentId)}
                >
                  Delete
                </button>
                <button
                  className="action-button edit-action"
                  onClick={() => setEditStudent(student)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editStudent && (
        <div className="edit-container">
          <h3>Edit Student Profile</h3>
          <input
            type="text"
            className="edit-input"
            name="firstname"
            value={editStudent.firstname}
            onChange={handleEditChange}
            placeholder="First Name"
          />
          <input
            type="text"
            className="edit-input"
            name="lastname"
            value={editStudent.lastname}
            onChange={handleEditChange}
            placeholder="Last Name"
          />
          <input
            type="email"
            className="edit-input"
            name="email"
            value={editStudent.email}
            onChange={handleEditChange}
            placeholder="Email"
          />
          <input
            type="text"
            className="edit-input"
            name="universityCollegeName"
            value={editStudent.universityCollegeName}
            onChange={handleEditChange}
            placeholder="University/College Name"
          />
          <button
            className="edit-button update-button"
            onClick={handleUpdateStudent}
          >
            Update Profile
          </button>
          <button
            className="edit-button cancel-button"
            onClick={() => setEditStudent(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageStudentProfiles;
