import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileModal from "./Profile";
import NoteModal from "./NoteDetail";
import NewNoteModal from "./AddNote";

const NotesPage = () => {
	const [notes, setNotes] = useState([]);
	const [selectedNote, setSelectedNote] = useState(null);
	const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const notesPerPage = 12;
	const contentPreviewLimit = 100;
	const debounceDelay = 1000; // 1 second debounce delay for search

	// Fetch notes with optional search query and pagination
	const fetchNotes = async (page = 1, query = "") => {
		try {
			const authToken = localStorage.getItem("authToken");
			const response = await axios.get("/api/notes", {
				headers: { "X-API-TOKEN": authToken },
				params: {
					page: page,
					size: notesPerPage,
					title: query || undefined,
					content: query || undefined,
				},
			});
			setNotes(response.data.data);
			setCurrentPage(response.data.paging.current_page);
			setTotalPages(response.data.paging.total_page);
			setErrorMessage("");
		} catch (error) {
			console.error("Error fetching notes:", error.response || error.message);
			setErrorMessage(error.response?.data?.errors || "Failed to fetch notes");
		}
	};

	// Fetch notes on mount and whenever the currentPage or searchQuery changes
	useEffect(() => {
		const handler = setTimeout(() => {
			fetchNotes(currentPage, searchQuery);
		}, debounceDelay);

		return () => clearTimeout(handler);
	}, [searchQuery, currentPage]);

	const handleDelete = async (noteId) => {
		try {
			const authToken = localStorage.getItem("authToken");
			await axios.delete(`/api/notes/${noteId}`, {
				headers: { "X-API-TOKEN": authToken },
			});
			fetchNotes(currentPage, searchQuery); // Refresh current page with the current search query
		} catch (error) {
			setErrorMessage("Failed to delete note");
		}
	};

	const handleNoteClick = (note) => {
		setSelectedNote(note);
		setIsNoteModalOpen(true);
	};

	const handleProfileClick = () => {
		setIsProfileModalOpen(true);
	};

	const handleAddNewNote = () => {
		setIsNewNoteModalOpen(true);
	};

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		window.location.href = "/";
	};

	// Go to a specific page
	const goToPage = (page) => {
		setCurrentPage(page);
	};

	// Handle adding a new note and navigate to the last page
	const handleNewNoteAdd = async (newNote) => {
		try {
			// Calculate the last page based on the updated total notes count
			const newTotalPages = Math.ceil((notes.length + 1) / notesPerPage);

			// Set the page to the last page and fetch notes for the last page
			await fetchNotes(newTotalPages, searchQuery);
			setCurrentPage(newTotalPages); // Update the current page to the last page

			// Close the "Add New Note" modal
			setIsNewNoteModalOpen(false);
		} catch (error) {
			setErrorMessage("Failed to add note and load last page");
		}
	};

	const truncateContent = (content) => {
		if (content.length > contentPreviewLimit) {
			return content.slice(0, contentPreviewLimit) + "...";
		}
		return content;
	};

	return (
		<div className="container mt-5">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h2>Notes</h2>
				<div>
					<button className="btn btn-primary me-2" onClick={handleAddNewNote}>
						Add New Note
					</button>
					<button className="btn btn-info me-2" onClick={handleProfileClick}>
						Profile
					</button>
					<button className="btn btn-danger" onClick={handleLogout}>
						Logout
					</button>
				</div>
			</div>
			<input type="text" className="form-control mb-4" placeholder="Search notes by title or content..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
			{errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
			<div className="row">
				{notes.length > 0 ? (
					notes.map((note) => (
						<div key={note.id} className="col-md-4 mb-4">
							<div className="card">
								<div className="card-body">
									<h5 className="card-title">{note.title}</h5>
									<p className="card-text">{truncateContent(note.content)}</p>
									<button className="btn btn-info me-2" onClick={() => handleNoteClick(note)}>
										Details
									</button>
									<button className="btn btn-danger" onClick={() => handleDelete(note.id)}>
										Delete
									</button>
								</div>
							</div>
						</div>
					))
				) : (
					<p>No notes available</p>
				)}
			</div>
			<div className="d-flex justify-content-center mt-4">
				<button className="btn btn-secondary me-2" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
					Previous
				</button>
				<span className="align-self-center">
					Page {currentPage} of {totalPages}
				</span>
				<button className="btn btn-secondary ms-2" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
					Next
				</button>
			</div>
			{isNoteModalOpen && (
				<NoteModal
					note={selectedNote}
					onClose={() => setIsNoteModalOpen(false)}
					onUpdate={(updatedNote) => {
						setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
						setIsNoteModalOpen(false);
					}}
				/>
			)}
			{isProfileModalOpen && <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={{ username: "customer", name: "Customer" }} />}
			{isNewNoteModalOpen && <NewNoteModal onClose={() => setIsNewNoteModalOpen(false)} onAdd={handleNewNoteAdd} />}
		</div>
	);
};

export default NotesPage;
