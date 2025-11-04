import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = ({ isAuthenticated, setIsAuthenticated }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [profileData, setProfileData] = useState({
		firstName: "",
		lastName: "",
		phoneNumber: "",
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		const userData = localStorage.getItem("user");
		if (userData) {
			const parsedUser = JSON.parse(userData);
			setUser(parsedUser);
			setProfileData({
				firstName: parsedUser.firstName || "",
				lastName: parsedUser.lastName || "",
				phoneNumber: parsedUser.phoneNumber || "",
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		}
	}, [isAuthenticated, navigate]);

	const handleInputChange = (e) => {
		setProfileData({
			...profileData,
			[e.target.name]: e.target.value,
		});
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setIsAuthenticated(false);
		navigate("/");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		setError("");

		// Validate password confirmation if trying to change password
		if (profileData.newPassword) {
			if (profileData.newPassword !== profileData.confirmPassword) {
				setError("New passwords do not match");
				setLoading(false);
				return;
			}
			if (!profileData.currentPassword) {
				setError("Current password is required to change password");
				setLoading(false);
				return;
			}
		}

		try {
			const token = localStorage.getItem("token");
			const updateData = {
				firstName: profileData.firstName,
				lastName: profileData.lastName,
				phoneNumber: profileData.phoneNumber,
			};

			// Only include password fields if user wants to change password
			if (profileData.newPassword) {
				updateData.currentPassword = profileData.currentPassword;
				updateData.newPassword = profileData.newPassword;
			}

			const response = await axios.put(
				"http://localhost:8080/api/auth/profile",
				updateData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			// Update local storage with new user data
			const updatedUser = {
				...user,
				firstName: response.data.firstName,
				lastName: response.data.lastName,
			};
			localStorage.setItem("user", JSON.stringify(updatedUser));
			setUser(updatedUser);

			setMessage("Profile updated successfully!");
			setIsEditing(false);
			setProfileData({
				...profileData,
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error) {
			console.error("Failed to update profile:", error);
			setError(
				error.response?.data?.message || "Failed to update profile"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setProfileData({
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			phoneNumber: user?.phoneNumber || "",
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
		setMessage("");
		setError("");
	};

	if (!isAuthenticated || !user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-xl">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<div className="flex items-center">
							<h1 className="text-3xl font-bold text-gray-900">
								Culex Marketplace
							</h1>
						</div>
						<div className="flex items-center space-x-4">
							<button
								onClick={() => navigate("/")}
								className="text-indigo-600 hover:text-indigo-900 font-medium"
							>
								Dashboard
							</button>
							<span className="text-gray-700">
								Welcome, {user.firstName}
							</span>
							<button
								onClick={handleLogout}
								className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-gray-900">
								My Profile
							</h2>
							{!isEditing && (
								<button
									onClick={() => setIsEditing(true)}
									className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								>
									Edit Profile
								</button>
							)}
						</div>

						{message && (
							<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
								<p className="text-green-800">{message}</p>
							</div>
						)}

						{error && (
							<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-red-800">{error}</p>
							</div>
						)}

						{isEditing ? (
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label
											htmlFor="firstName"
											className="block text-sm font-medium text-gray-700"
										>
											First Name
										</label>
										<input
											type="text"
											id="firstName"
											name="firstName"
											value={profileData.firstName}
											onChange={handleInputChange}
											required
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										/>
									</div>

									<div>
										<label
											htmlFor="lastName"
											className="block text-sm font-medium text-gray-700"
										>
											Last Name
										</label>
										<input
											type="text"
											id="lastName"
											name="lastName"
											value={profileData.lastName}
											onChange={handleInputChange}
											required
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="phoneNumber"
										className="block text-sm font-medium text-gray-700"
									>
										Phone Number
									</label>
									<input
										type="tel"
										id="phoneNumber"
										name="phoneNumber"
										value={profileData.phoneNumber}
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</div>

								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700"
									>
										Email (Cannot be changed)
									</label>
									<input
										type="email"
										id="email"
										value={user.email}
										disabled
										className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
									/>
								</div>

								<hr className="my-6" />

								<h3 className="text-lg font-medium text-gray-900 mb-4">
									Change Password (Optional)
								</h3>

								<div>
									<label
										htmlFor="currentPassword"
										className="block text-sm font-medium text-gray-700"
									>
										Current Password
									</label>
									<input
										type="password"
										id="currentPassword"
										name="currentPassword"
										value={profileData.currentPassword}
										onChange={handleInputChange}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label
											htmlFor="newPassword"
											className="block text-sm font-medium text-gray-700"
										>
											New Password
										</label>
										<input
											type="password"
											id="newPassword"
											name="newPassword"
											value={profileData.newPassword}
											onChange={handleInputChange}
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										/>
									</div>

									<div>
										<label
											htmlFor="confirmPassword"
											className="block text-sm font-medium text-gray-700"
										>
											Confirm New Password
										</label>
										<input
											type="password"
											id="confirmPassword"
											name="confirmPassword"
											value={profileData.confirmPassword}
											onChange={handleInputChange}
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										/>
									</div>
								</div>

								<div className="flex justify-end space-x-3">
									<button
										type="button"
										onClick={handleCancel}
										className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={loading}
										className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
									>
										{loading
											? "Updating..."
											: "Update Profile"}
									</button>
								</div>
							</form>
						) : (
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											First Name
										</label>
										<p className="mt-1 text-sm text-gray-900">
											{user.firstName}
										</p>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700">
											Last Name
										</label>
										<p className="mt-1 text-sm text-gray-900">
											{user.lastName}
										</p>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">
										Email
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{user.email}
									</p>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">
										Phone Number
									</label>
									<p className="mt-1 text-sm text-gray-900">
										{user.phoneNumber || "Not provided"}
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
};

export default Profile;
