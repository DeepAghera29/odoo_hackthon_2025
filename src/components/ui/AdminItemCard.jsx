import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const AdminItemCard = ({ item, onApprove, onReject }) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(item._id, rejectionReason);
      setShowRejectForm(false);
      setRejectionReason("");
    }
  };

  const conditionColors = {
    excellent: "bg-green-100 text-green-800",
    good: "bg-blue-100 text-blue-800",
    fair: "bg-yellow-100 text-yellow-800",
    worn: "bg-gray-100 text-gray-800",
  };

  const getImageUrl = (image) => {
    return image?.startsWith("http") ? image : `http://localhost:5000${image}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square">
        <img
          src={getImageUrl(item.images?.[0])}
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400";
          }}
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              conditionColors[item.condition]
            }`}
          >
            {item.condition}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          {item.pointValue} pts
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {item.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {item.description}
        </p>

        {/* Item Details */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium">Category:</span> {item.category}
          </div>
          <div>
            <span className="font-medium">Size:</span> {item.size}
          </div>
          <div>
            <span className="font-medium">Color:</span> {item.color}
          </div>
          {item.brand && (
            <div>
              <span className="font-medium">Brand:</span> {item.brand}
            </div>
          )}
        </div>

        {/* Owner Info */}
        <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-50 rounded-lg">
          {item.owner.avatar ? (
            <img
              src={item.owner.avatar}
              alt={item.owner.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-emerald-600" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {item.owner.firstName} {item.owner.lastName}
            </p>
            <p className="text-xs text-gray-600">@{item.owner.username}</p>
          </div>
        </div>

        {/* Submission Date */}
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <CalendarIcon className="w-4 h-4 mr-1" />
          <span>Submitted {new Date(item.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            to={`/item/${item._id}`}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
            <span>View</span>
          </Link>

          <button
            onClick={() => setShowRejectForm(!showRejectForm)}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <XCircleIcon className="w-4 h-4" />
            <span>Reject</span>
          </button>

          <button
            onClick={() => onApprove(item._id)}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <CheckCircleIcon className="w-4 h-4" />
            <span>Approve</span>
          </button>
        </div>

        {/* Rejection Form */}
        {showRejectForm && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <label className="block text-sm font-medium text-red-800 mb-2">
              Rejection Reason
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => setShowRejectForm(false)}
                className="px-3 py-1 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminItemCard;
