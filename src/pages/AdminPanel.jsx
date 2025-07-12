import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import AdminItemCard from "../components/ui/AdminItemCard";
import {
  CheckCircleIcon,
  XCircleIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingItems, setPendingItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [pendingResponse, usersResponse, statsResponse] = await Promise.all(
        [
          api.get("/admin/items/pending"),
          api.get("/admin/users"),
          api.get("/admin/stats"),
        ]
      );

      setPendingItems(pendingResponse.data.items);
      setUsers(usersResponse.data.users);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveItem = async (itemId) => {
    try {
      await api.put(`/admin/items/${itemId}/approve`);
      toast.success("Item approved successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve item");
    }
  };

  const handleRejectItem = async (itemId, reason) => {
    try {
      await api.put(`/admin/items/${itemId}/reject`, { reason });
      toast.success("Item rejected");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject item");
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      toast.success("User status updated");
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "pending", label: "Pending Items", count: pendingItems.length },
    { id: "users", label: "Users", count: users.length },
    { id: "stats", label: "Statistics" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Manage items, users, and platform statistics
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <ShoppingBagIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Items
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalItems}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Items
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pendingItems}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <ChartBarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Swapped Items
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.swappedItems}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Pending Items Tab */}
            {activeTab === "pending" && (
              <div>
                {pendingItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingItems.map((item) => (
                      <AdminItemCard
                        key={item._id}
                        item={item}
                        onApprove={handleApproveItem}
                        onReject={handleRejectItem}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No pending items
                    </h3>
                    <p className="text-gray-600">
                      All items have been reviewed
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.username}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold text-emerald-600">
                                    {user.firstName?.[0]}
                                    {user.lastName?.[0]}
                                  </span>
                                </div>
                              )}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @{user.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.points}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.role !== "admin" && (
                              <button
                                onClick={() => handleToggleUserStatus(user._id)}
                                className={`${
                                  user.isActive
                                    ? "text-red-600 hover:text-red-900"
                                    : "text-green-600 hover:text-green-900"
                                }`}
                              >
                                {user.isActive ? "Deactivate" : "Activate"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === "stats" && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Platform Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Users:</span>
                      <span className="font-semibold">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Users:</span>
                      <span className="font-semibold">{stats.activeUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-semibold">{stats.totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Items:</span>
                      <span className="font-semibold">
                        {stats.availableItems}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Swapped Items:</span>
                      <span className="font-semibold">
                        {stats.swappedItems}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {stats.recentActivity?.items?.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          New item: {item.title} by @{item.owner.username}
                        </span>
                      </div>
                    ))}
                    {stats.recentActivity?.users?.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          New user: {user.firstName} {user.lastName} (@
                          {user.username})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
