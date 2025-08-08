import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is authenticated by checking for token in localStorage
		const token = localStorage.getItem("token");
		if (token) {
			setIsAuthenticated(true);
		}
		setLoading(false);
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-xl">Loading...</div>
			</div>
		);
	}

	return (
		<Router>
			<div className="min-h-screen bg-gray-50">
				<Routes>
					{/* The root path now always goes to the dashboard,
                        passing the authentication status as a prop. */}
					<Route
						path="/"
						element={
							<Dashboard
								isAuthenticated={isAuthenticated}
								setIsAuthenticated={setIsAuthenticated}
							/>
						}
					/>
					<Route
						path="/login"
						element={
							!isAuthenticated ? (
								<Login
									setIsAuthenticated={setIsAuthenticated}
								/>
							) : (
								<Navigate to="/" />
							)
						}
					/>
					<Route
						path="/register"
						element={
							!isAuthenticated ? (
								<Register
									setIsAuthenticated={setIsAuthenticated}
								/>
							) : (
								<Navigate to="/" />
							)
						}
					/>
					{/* The /dashboard route now simply renders the dashboard. */}
					<Route
						path="/dashboard"
						element={
							<Dashboard
								isAuthenticated={isAuthenticated}
								setIsAuthenticated={setIsAuthenticated}
							/>
						}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
