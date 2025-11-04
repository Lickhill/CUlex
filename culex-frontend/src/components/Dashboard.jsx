import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = ({ isAuthenticated, setIsAuthenticated }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [ads, setAds] = useState([]);
	const [showAdForm, setShowAdForm] = useState(false);
	const [newAdData, setNewAdData] = useState({
		name: "",
		description: "",
		address: "",
		phoneNumber: "",
	});

	const fetchAllAds = async () => {
		try {
			const response = await axios.get("http://localhost:8080/api/ads");
			setAds(response.data);
		} catch (error) {
			console.error("Failed to fetch ads:", error);
			// In a real app, you might set an error state to show a message to the user
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			const userData = localStorage.getItem("user");
			if (userData) {
				const parsedUser = JSON.parse(userData);
				setUser(parsedUser);
				console.log("Logged in User ID:", parsedUser.email);
			}
		}
		fetchAllAds();
	}, [isAuthenticated]);

	const handleAdChange = (e) => {
		setNewAdData({
			...newAdData,
			[e.target.name]: e.target.value,
		});
	};

	const handleAdSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			await axios.post("http://localhost:8080/api/ads", newAdData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setNewAdData({
				name: "",
				description: "",
				address: "",
				phoneNumber: "",
			});
			setShowAdForm(false);
			fetchAllAds();
			alert("Your ad has been posted!");
		} catch (error) {
			console.error("Failed to post ad:", error);
			alert(
				error.response?.data?.message ||
					"Failed to post ad. Please try again."
			);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setIsAuthenticated(false);
	};

	const handlePostAdClick = () => {
		if (!isAuthenticated) {
			navigate("/login");
		} else {
			setShowAdForm(true);
		}
	};

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
							{/* New Post an Ad button */}
							<button
								onClick={handlePostAdClick}
								className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							>
								Post an Ad
							</button>
							{/* My Ads button - only show when authenticated */}
							{isAuthenticated && (
								<Link
									to="/my-ads"
									className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								>
									My Ads
								</Link>
							)}
							{/* Conditional rendering for profile or login/register */}
							{isAuthenticated ? (
								<>
									<Link
										to="/profile"
										className="text-indigo-600 hover:text-indigo-900 font-medium"
									>
										Profile
									</Link>
									<span className="text-gray-700">
										Welcome, {user?.firstName}
									</span>
									<button
										onClick={handleLogout}
										className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
									>
										Logout
									</button>
								</>
							) : (
								<>
									<Link
										to="/login"
										className="text-indigo-600 hover:text-indigo-900 font-medium"
									>
										Login
									</Link>
									<Link
										to="/register"
										className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
									>
										Register
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<div className="text-center">
							{/* Conditional rendering for the ad posting form */}
							{showAdForm ? (
								<div className="max-w-lg mx-auto">
									<h3 className="text-xl font-medium text-gray-900 mb-4">
										Post a New Ad
									</h3>
									<form
										onSubmit={handleAdSubmit}
										className="space-y-4 text-left"
									>
										<div>
											<label
												htmlFor="name"
												className="block text-sm font-medium text-gray-700"
											>
												Name
											</label>
											<input
												type="text"
												id="name"
												name="name"
												value={newAdData.name}
												onChange={handleAdChange}
												required
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>
										<div>
											<label
												htmlFor="description"
												className="block text-sm font-medium text-gray-700"
											>
												Description
											</label>
											<textarea
												id="description"
												name="description"
												value={newAdData.description}
												onChange={handleAdChange}
												required
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											></textarea>
										</div>
										<div>
											<label
												htmlFor="address"
												className="block text-sm font-medium text-gray-700"
											>
												Address of Seller
											</label>
											<input
												type="text"
												id="address"
												name="address"
												value={newAdData.address}
												onChange={handleAdChange}
												required
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
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
												value={newAdData.phoneNumber}
												onChange={handleAdChange}
												required
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>
										<div className="flex justify-between">
											<button
												type="button"
												onClick={() =>
													setShowAdForm(false)
												}
												className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
											>
												Cancel
											</button>
											<button
												type="submit"
												className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
											>
												Submit Ad
											</button>
										</div>
									</form>
								</div>
							) : (
								<>
									<h3 className="text-2xl font-bold text-gray-900 mb-6">
										Recent Listings
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{ads.map((ad) => (
											<div
												key={ad.id}
												className="bg-white rounded-lg shadow-md p-6"
											>
												<h4 className="text-xl font-semibold text-gray-900 mb-2">
													{ad.name}
												</h4>
												<p className="text-gray-600 mb-4">
													{ad.description}
												</p>
												<p className="text-sm text-gray-500">
													<span className="font-medium">
														Seller Address:
													</span>{" "}
													{ad.address}
												</p>
												<p className="text-sm text-gray-500">
													<span className="font-medium">
														Contact:
													</span>{" "}
													{ad.phoneNumber}
												</p>
											</div>
										))}
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
