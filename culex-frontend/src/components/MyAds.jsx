import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MyAds = () => {
	const [ads, setAds] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [editingAd, setEditingAd] = useState(null);
	const [editFormData, setEditFormData] = useState({
		name: "",
		description: "",
		address: "",
		phoneNumber: "",
	});

	useEffect(() => {
		fetchMyAds();
	}, []);

	const fetchMyAds = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(
				"http://localhost:8080/api/ads/my-ads",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setAds(response.data);
		} catch (error) {
			console.error("Error fetching ads:", error);
			setError("Failed to fetch your ads");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteAd = async (adId) => {
		if (!window.confirm("Are you sure you want to delete this ad?")) {
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.delete(`http://localhost:8080/api/ads/${adId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			// Remove the deleted ad from the state
			setAds(ads.filter((ad) => ad.id !== adId));
		} catch (error) {
			console.error("Error deleting ad:", error);
			setError("Failed to delete ad");
		}
	};

	const handleEditAd = (ad) => {
		setEditingAd(ad.id);
		setEditFormData({
			name: ad.name || "",
			description: ad.description || "",
			address: ad.address || "",
			phoneNumber: ad.phoneNumber || "",
		});
	};

	const handleCancelEdit = () => {
		setEditingAd(null);
		setEditFormData({
			name: "",
			description: "",
			address: "",
			phoneNumber: "",
		});
	};

	const handleEditFormChange = (e) => {
		setEditFormData({
			...editFormData,
			[e.target.name]: e.target.value,
		});
	};

	const handleUpdateAd = async (adId) => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.put(
				`http://localhost:8080/api/ads/${adId}`,
				editFormData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			// Update the ad in the local state
			setAds(ads.map((ad) => (ad.id === adId ? response.data : ad)));
			setEditingAd(null);
			setEditFormData({
				name: "",
				description: "",
				address: "",
				phoneNumber: "",
			});
		} catch (error) {
			console.error("Error updating ad:", error);
			setError("Failed to update ad");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-lg">Loading your ads...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-8">
					<div className="flex justify-between items-center mb-4">
						<Link
							to="/"
							className="text-indigo-600 hover:text-indigo-900 font-medium"
						>
							← Back to Dashboard
						</Link>
						<Link
							to="/profile"
							className="text-indigo-600 hover:text-indigo-900 font-medium"
						>
							Profile
						</Link>
					</div>
					<h1 className="text-3xl font-extrabold text-gray-900">
						My Advertisements
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						Manage your posted ads
					</p>
				</div>

				{error && (
					<div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
						{error}
					</div>
				)}

				{ads.length === 0 ? (
					<div className="text-center py-12">
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No ads found
						</h3>
						<p className="text-gray-600">
							You haven't posted any ads yet.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{ads.map((ad) => (
							<div
								key={ad.id}
								className="bg-white rounded-lg shadow-md overflow-hidden"
							>
								<div className="p-6">
									{editingAd === ad.id ? (
										// Edit Form
										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Title
												</label>
												<input
													type="text"
													name="name"
													value={editFormData.name}
													onChange={
														handleEditFormChange
													}
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
													required
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Description
												</label>
												<textarea
													name="description"
													value={
														editFormData.description
													}
													onChange={
														handleEditFormChange
													}
													rows="3"
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
													required
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Address
												</label>
												<input
													type="text"
													name="address"
													value={editFormData.address}
													onChange={
														handleEditFormChange
													}
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
													required
												/>
											</div>

											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">
													Phone Number
												</label>
												<input
													type="tel"
													name="phoneNumber"
													value={
														editFormData.phoneNumber
													}
													onChange={
														handleEditFormChange
													}
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
													required
												/>
											</div>

											<div className="flex justify-between pt-4">
												<button
													onClick={handleCancelEdit}
													className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
												>
													Cancel
												</button>
												<button
													onClick={() =>
														handleUpdateAd(ad.id)
													}
													className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
												>
													Update
												</button>
											</div>
										</div>
									) : (
										// Display Mode
										<>
											<div className="flex justify-between items-start mb-4">
												<h3 className="text-xl font-semibold text-gray-900">
													{ad.name}
												</h3>
												<div className="flex space-x-2">
													<button
														onClick={() =>
															handleEditAd(ad)
														}
														className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
													>
														Edit
													</button>
													<button
														onClick={() =>
															handleDeleteAd(
																ad.id
															)
														}
														className="text-red-600 hover:text-red-900 font-medium text-sm"
													>
														Delete
													</button>
												</div>
											</div>

											<p className="text-gray-600 mb-4 line-clamp-3">
												{ad.description}
											</p>

											<div className="text-sm text-gray-500 space-y-1">
												<p>
													<strong>Address:</strong>{" "}
													{ad.address}
												</p>
												<p>
													<strong>Phone:</strong>{" "}
													{ad.phoneNumber}
												</p>
											</div>

											<div className="mt-4 pt-4 border-t border-gray-200">
												<p className="text-xs text-gray-500">
													Posted on:{" "}
													{new Date(
														ad.createdAt
													).toLocaleDateString()}
												</p>
											</div>
										</>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default MyAds;
