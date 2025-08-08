import { useState, useEffect } from "react";

const Dashboard = ({ setIsAuthenticated }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (userData) {
			setUser(JSON.parse(userData));
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setIsAuthenticated(false);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<div className="flex items-center">
							<h1 className="text-3xl font-bold text-gray-900">
								Culex Dashboard
							</h1>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-gray-700">
								Welcome, {user?.firstName} {user?.lastName}
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
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
						<div className="text-center">
							<h2 className="text-2xl font-bold text-gray-900 mb-4">
								Welcome to Culex Marketplace
							</h2>
							<p className="text-gray-600 mb-8">
								Your OLX for CU - Buy and sell with your
								community!
							</p>

							{/* User Info Card */}
							<div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
								<h3 className="text-lg font-medium text-gray-900 mb-4">
									Your Profile
								</h3>
								<div className="space-y-2">
									<p className="text-sm text-gray-600">
										<span className="font-medium">
											Name:
										</span>{" "}
										{user?.firstName} {user?.lastName}
									</p>
									<p className="text-sm text-gray-600">
										<span className="font-medium">
											Email:
										</span>{" "}
										{user?.email}
									</p>
								</div>
							</div>

							{/* Quick Actions */}
							<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="bg-white shadow rounded-lg p-6">
									<h4 className="text-lg font-medium text-gray-900 mb-2">
										Post an Ad
									</h4>
									<p className="text-gray-600 text-sm mb-4">
										Sell your items to the CU community
									</p>
									<button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
										Create Listing
									</button>
								</div>

								<div className="bg-white shadow rounded-lg p-6">
									<h4 className="text-lg font-medium text-gray-900 mb-2">
										Browse Items
									</h4>
									<p className="text-gray-600 text-sm mb-4">
										Find what you're looking for
									</p>
									<button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
										View Listings
									</button>
								</div>

								<div className="bg-white shadow rounded-lg p-6">
									<h4 className="text-lg font-medium text-gray-900 mb-2">
										My Account
									</h4>
									<p className="text-gray-600 text-sm mb-4">
										Manage your profile and settings
									</p>
									<button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
										Edit Profile
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
