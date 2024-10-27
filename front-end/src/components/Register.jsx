import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("/api/users", { username, name, password });
			if (response.status === 200) {
				setSuccessMessage("Registration successful! Redirecting to login...");
				setTimeout(() => navigate("/"), 2000); // Redirect to login after 2 seconds
			} else {
				setErrorMessage("Registration failed. Please try again.");
			}
		} catch (error) {
			if (error.response && error.response.status === 400) {
				setErrorMessage(error.response.data.message || "Username already exists.");
			} else {
				setErrorMessage("An error occurred. Please try again.");
			}
		}
	};

	return (
		<div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f0f2f5" }}>
			<div className="card p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "8px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
				<h2 className="text-center mb-4">Register</h2>
				{errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
				{successMessage && <div className="alert alert-success">{successMessage}</div>}
				<form onSubmit={handleRegister}>
					<div className="mb-3">
						<label htmlFor="username" className="form-label">
							Username
						</label>
						<input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
					</div>
					<div className="mb-3">
						<label htmlFor="name" className="form-label">
							Name
						</label>
						<input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					</div>
					<button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}>
						Register
					</button>
				</form>
				<button type="button" className="btn btn-link w-100 mt-3" onClick={() => navigate("/")}>
					Already have an account? Login
				</button>
			</div>
		</div>
	);
};

export default RegisterPage;
