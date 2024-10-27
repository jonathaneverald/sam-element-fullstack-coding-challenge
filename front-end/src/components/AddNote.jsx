import React, { useState } from "react";
import axios from "axios";

const NewNoteModal = ({ onClose, onAdd }) => {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSave = async () => {
		try {
			const authToken = localStorage.getItem("authToken");
			const response = await axios.post(
				"https://sam-element-fullstack-api-production.up.railway.app/api/notes",
				{ title, content },
				{
					headers: { "X-API-TOKEN": authToken },
				}
			);
			onAdd(response.data.data); // Add the new note to the notes list
			setTitle("");
			setContent("");
		} catch (error) {
			setErrorMessage("Failed to add note");
		}
	};

	return (
		<div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Add New Note</h5>
						<button type="button" className="btn-close" onClick={onClose}></button>
					</div>
					<div className="modal-body">
						{errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
						<div className="mb-3">
							<label className="form-label">Title</label>
							<input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
						</div>
						<div className="mb-3">
							<label className="form-label">Content</label>
							<textarea className="form-control" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
						</div>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-primary" onClick={handleSave}>
							Save
						</button>
						<button type="button" className="btn btn-secondary" onClick={onClose}>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewNoteModal;
