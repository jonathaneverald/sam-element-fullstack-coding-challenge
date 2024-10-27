import React, { useState } from "react";
import axios from "axios";

const ProfileModal = ({ isOpen, onClose, user }) => {
	const [name, setName] = useState(user.name);
	const [password, setPassword] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
	};

	const handleSave = async () => {
		try {
			const authToken = localStorage.getItem("authToken");
			await axios.patch(
				"/api/users/current",
				{ name, password },
				{
					headers: { "X-API-TOKEN": authToken },
				}
			);
			setIsEditing(false);
			setErrorMessage("");
		} catch (error) {
			setErrorMessage("Failed to update profile");
		}
	};

	if (!isOpen) return null;

	return (
		<div
			className="modal show d-block"
			tabIndex="-1"
			style={{
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">User Profile</h5>
						<button type="button" className="btn-close" onClick={onClose}></button>
					</div>
					<div className="modal-body">
						{errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
						<div className="mb-3">
							<label className="form-label">Username</label>
							<input type="text" className="form-control" value={user.username} disabled />
						</div>
						<div className="mb-3">
							<label className="form-label">Name</label>
							<input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
						</div>
						<div className="mb-3">
							<label className="form-label">Password</label>
							<input type="password" className="form-control" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={!isEditing} />
						</div>
					</div>
					<div className="modal-footer">
						{isEditing ? (
							<button type="button" className="btn btn-primary" onClick={handleSave}>
								Save
							</button>
						) : (
							<button type="button" className="btn btn-secondary" onClick={handleEditToggle}>
								Edit Profile
							</button>
						)}
						<button type="button" className="btn btn-secondary" onClick={onClose}>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileModal;
