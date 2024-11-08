import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", { username, password });
            const { token, role } = response.data;
            localStorage.setItem("token", token);

            if (role === "ADMIN") {
                navigate("/admin/dashboard");
            } else if (role === "EXAMINEE") {
                navigate("/examinee/dashboard");
            }
        } catch (error) {
            console.error("Login failed", error);
            alert("Invalid credentials");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginPage;
