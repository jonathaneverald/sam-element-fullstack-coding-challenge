import React, { useState } from "react";
import axios from "axios";

const NoteModal = ({ note, onClose, onUpdate }) => {
	const [title, setTitle] = useState(note.title);
	const [content, setContent] = useState(note.content);
	const [isEditing, setIsEditing] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
	};

	const handleSave = async () => {
		try {
			const authToken = localStorage.getItem("authToken");
			const response = await axios.put(
				`https://sam-element-fullstack-api-production.up.railway.app/api/notes/${note.id}`,
				{ title, content },
				{
					headers: { "X-API-TOKEN": authToken },
				}
			);
			onUpdate(response.data.data);
			setIsEditing(false);
		} catch (error) {
			setErrorMessage("Failed to update note");
		}
	};

	return (
		<div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Note Details</h5>
						<button type="button" className="btn-close" onClick={onClose}></button>
					</div>
					<div className="modal-body">
						{errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
						<div className="mb-3">
							<label className="form-label">Title</label>
							<input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} disabled={!isEditing} />
						</div>
						<div className="mb-3">
							<label className="form-label">Content</label>
							<textarea className="form-control" value={content} onChange={(e) => setContent(e.target.value)} disabled={!isEditing}></textarea>
						</div>
					</div>
					<div className="modal-footer">
						{isEditing ? (
							<button type="button" className="btn btn-primary" onClick={handleSave}>
								Save
							</button>
						) : (
							<button type="button" className="btn btn-secondary" onClick={handleEditToggle}>
								Edit
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

export default NoteModal;
