import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("/api/users/login", { username, password });
			if (response.status === 200) {
				// Store the token in local storage
				localStorage.setItem("authToken", response.data.data.token);
				// Navigate to the notes page
				navigate("/notes");
			} else {
				setErrorMessage("Login failed. Please check your username and password.");
			}
		} catch (error) {
			if (error.response && error.response.status === 401) {
				setErrorMessage("Invalid username or password.");
			} else {
				setErrorMessage("An error occurred. Please try again.");
			}
		}
	};

	const handleRegister = () => {
		navigate("/register"); // Navigate to the register page
	};

	return (
		<div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f0f2f5" }}>
			<div className="card p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "8px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
				<h2 className="text-center mb-4">Login</h2>
				{errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
				<form onSubmit={handleLogin}>
					<div className="mb-3">
						<label htmlFor="username" className="form-label">
							Username
						</label>
						<input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					</div>
					<button type="submit" className="btn btn-primary w-100">
						Login
					</button>
					<button type="button" className="btn btn-secondary w-100 mt-3" onClick={handleRegister}>
						Register
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
