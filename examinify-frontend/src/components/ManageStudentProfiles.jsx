import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageStudentProfiles = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [message, setMessage] = useState("");
  const [editStudent, setEditStudent] = useState(null); // State for editing a student profile

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
      fetchAllStudents(); // Refresh student list
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
      fetchAllStudents(); // Refresh student list
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

  // Handle update student profile
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
      fetchAllStudents(); // Refresh student list
      setEditStudent(null); // Close the edit form
    } catch (error) {
      setMessage("Failed to update student profile.");
    }
  };

  // Handle changes in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStudent((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2>Manage Student Profiles</h2>
      <div>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <br />
        <input
          type="text"
          placeholder="Filter by College"
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
        />
        <button onClick={handleFilter}>Filter</button>
      </div>
      <br />
      <button
        onClick={handleDeleteMultipleStudents}
        disabled={selectedStudents.length === 0}
      >
        Delete Selected Students
      </button>
      <br />
      {message && <p>{message}</p>}
      <ul>
        {students.map((student) => (
          <li key={student.studentId}>
            <input
              type="checkbox"
              checked={selectedStudents.includes(student.studentId)}
              onChange={() => handleSelectStudent(student.studentId)}
            />
            {student.studentId} | {student.firstname} {student.lastname} | {" "}
            {student.email} | {student.universityCollegeName}
            <button onClick={() => handleDeleteStudent(student.studentId)}>
              Delete
            </button>
            <button onClick={() => setEditStudent(student)}>Edit</button>
          </li>
        ))}
      </ul>

      {/* Edit Student Profile Form */}
      {editStudent && (
        <div>
          <h3>Edit Student Profile</h3>
          <input
            type="text"
            name="firstname"
            value={editStudent.firstname}
            onChange={handleEditChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastname"
            value={editStudent.lastname}
            onChange={handleEditChange}
            placeholder="Last Name"
          />
          <input
            type="email"
            name="email"
            value={editStudent.email}
            onChange={handleEditChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="universityCollegeName"
            value={editStudent.universityCollegeName}
            onChange={handleEditChange}
            placeholder="University/College Name"
          />
          <button onClick={handleUpdateStudent}>Update Profile</button>
          <button onClick={() => setEditStudent(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ManageStudentProfiles;
