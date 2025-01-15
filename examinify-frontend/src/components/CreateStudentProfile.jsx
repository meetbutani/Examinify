import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import "../assets/css/CreateStudentProfile.css";

const downloadTemplate = () => {
  const templateData = [
    ["firstname", "lastname", "email", "enrollmentNo", "universityCollegeName"],
  ];

  // Convert data to a worksheet and create a new workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(templateData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create a Blob and trigger download
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "StudentDataTemplate.xlsx";
  link.click();
};

const CreateStudentProfile = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    enrollmentNo: "",
    universityCollegeName: "",
  });
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const parseFile = (file) => {
    return new Promise((resolve, reject) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (fileExtension === "xlsx") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          resolve(jsonData);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
      } else if (fileExtension === "csv") {
        Papa.parse(file, {
          header: true,
          complete: (result) => resolve(result.data),
          error: (err) => reject(err),
        });
      } else {
        reject(
          new Error("Unsupported file format. Please upload .xlsx or .csv")
        );
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8081/api/admin/createStudentProfile",
        { ...formData, password: formData.enrollmentNo },
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

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file");
      return;
    }

    try {
      const parsedData = await parseFile(file);
      const token = localStorage.getItem("token");
      console.log(parsedData);
      const response = await axios.post(
        "http://localhost:8081/api/admin/importStudentData",
        parsedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setMessage(response.data);
    } catch (error) {
      setMessage(error.message || "An error occurred during import");
    }
  };

  // const generateRandomPassword = (length) => {
  //   const chars =
  //     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
  //   let password = "";
  //   for (let i = 0; i < length; i++) {
  //     password += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return password;
  // };

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
        <button type="submit" className="profile-button">
          Create Profile
        </button>
      </form>

      <h3 className="profile-heading">Import Student Data</h3>
      <form className="import-form" onSubmit={handleFileUpload}>
        <input
          type="file"
          className="profile-input"
          accept=".xlsx,.csv"
          onChange={handleFileChange}
          required
        />
        <button type="submit" className="profile-button">
          Import Data
        </button>
      </form>

      <div className="template-container">
        <h2 className="template-heading">Import Student Data</h2>
        <button className="template-button" onClick={downloadTemplate}>
          Download Template
        </button>
      </div>

      {message && <p className="profile-message">{message}</p>}
    </div>
  );
};

export default CreateStudentProfile;
