import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useClothingItems } from "../hooks/useClothingItems";
import ItemCard from "../components/ui/ItemCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const MyItems = () => {
  const { user } = useAuth();
  const { items, loading, deleteItem } = useClothingItems({
    ownerId: user?._id,
  });
  const [filter, setFilter] = useState("all");

  const statusColors = {
    available: "bg-green-100 text-green-800",
    pending_approval: "bg-yellow-100 text-yellow-800",
    reserved: "bg-blue-100 text-blue-800",
    swapped: "bg-gray-100 text-gray-800",
    rejected: "bg-red-100 text-red-800",
  };

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const result = await deleteItem(itemId);
      if (result.success) {
        toast.success("Item deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete item");
      }
    }
  };

  const statusCounts = {
    all: items.length,
    available: items.filter((item) => item.status === "available").length,
    pending_approval: items.filter((item) => item.status === "pending_approval")
      .length,
    reserved: items.filter((item) => item.status === "reserved").length,
    swapped: items.filter((item) => item.status === "swapped").length,
    rejected: items.filter((item) => item.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Items</h1>
            <p className="text-gray-600">
              Manage your listed items and track their status
            </p>
          </div>
          <Link
            to="/upload"
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>List New Item</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[
            { key: "all", label: "Total Items" },
            { key: "available", label: "Available" },
            { key: "pending_approval", label: "Pending" },
            { key: "reserved", label: "Reserved" },
            { key: "swapped", label: "Swapped" },
            { key: "rejected", label: "Rejected" },
          ].map((stat) => (
            <button
              key={stat.key}
              onClick={() => setFilter(stat.key)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                filter === stat.key
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-2xl font-bold text-gray-900">
                {statusCounts[stat.key]}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </button>
          ))}
        </div>

        {/* Items */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id || item.id} className="relative group">
                <ItemCard item={item} />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[item.status]
                    }`}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <Link
                      to={`/item/${item._id || item.id}`}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <EyeIcon className="w-4 h-4 text-gray-600" />
                    </Link>
                    {item.status === "available" && (
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <PencilIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteItem(item._id || item.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <TrashIcon className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Views Count */}
                <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <EyeIcon className="w-3 h-3" />
                  <span>{item.views || 0}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === "all"
                ? "No items yet"
                : `No ${filter.replace("_", " ")} items`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === "all"
                ? "Start by listing your first item"
                : `You don't have any ${filter.replace("_", " ")} items`}
            </p>
            {filter === "all" && (
              <Link
                to="/upload"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                List Your First Item
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyItems;
