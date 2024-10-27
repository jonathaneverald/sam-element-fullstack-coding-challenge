import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import NotesPage from "./components/Home";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/notes" element={<NotesPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
