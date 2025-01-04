import React, { useState } from "react";
import axios from "axios";
import "../assets/css/CreateStudentProfile.css";

const CreateStudentProfile = () => {
  const generateRandomPassword = (length) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    enrollmentNo: "",
    universityCollegeName: "",
    password: generateRandomPassword(8),
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8081/api/admin/createStudentProfile",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data);
    } catch (error) {
      setMessage(error.response.data || "An error occurred");
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-heading">Create Student Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="profile-input"
          name="firstname"
          placeholder="First Name"
          value={formData.firstname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="profile-input"
          name="lastname"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          className="profile-input"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="profile-input"
          name="enrollmentNo"
          placeholder="Enrollment No"
          value={formData.enrollmentNo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="profile-input"
          name="universityCollegeName"
          placeholder="University/College Name"
          value={formData.universityCollegeName}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          className="profile-input"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="profile-button">
          Create Profile
        </button>
      </form>
      {message && <p className="profile-message">{message}</p>}
    </div>
  );
};

export default CreateStudentProfile;
