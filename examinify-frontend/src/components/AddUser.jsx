import React, { useState } from "react";
import axios from "axios";

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EXAMINEE");
  const [message, setMessage] = useState("");

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/admin/addUser",
        { username, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("User added successfully!");
      setUsername("");
      setPassword("");
      setRole("EXAMINEE");
    } catch (error) {
      setMessage("Error adding user: " + error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="EXAMINEE">Examinee</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddUser;
