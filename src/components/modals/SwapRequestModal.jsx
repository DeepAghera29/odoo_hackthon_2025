import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useClothingItems } from "../../hooks/useClothingItems";
import api from "../../config/api";
import LoadingSpinner from "../ui/LoadingSpinner";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const SwapRequestModal = ({ item, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { items: userItems, loading } = useClothingItems({
    ownerId: user?._id,
  });
  const [selectedItem, setSelectedItem] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableItems = userItems.filter(
    (userItem) => userItem.status === "available" && userItem._id !== item._id
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedItem) {
      toast.error("Please select an item to offer");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/swaps", {
        itemOffered: selectedItem,
        itemRequested: item._id,
        message: message.trim(),
      });

      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send swap request"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (image) => {
    return image?.startsWith("http") ? image : `http://localhost:5000${image}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Request Swap</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Requested Item */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              You want to swap for:
            </h3>
            <div className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={getImageUrl(item.images?.[0])}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=200";
                }}
              />
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">
                  {item.category} • Size {item.size}
                </p>
                <p className="text-sm text-emerald-600 font-medium">
                  {item.pointValue} points
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Select Item to Offer */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Select an item to offer:
              </h3>

              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : availableItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {availableItems.map((userItem) => (
                    <label
                      key={userItem._id}
                      className={`flex space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedItem === userItem._id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedItem"
                        value={userItem._id}
                        checked={selectedItem === userItem._id}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        className="sr-only"
                      />
                      <img
                        src={getImageUrl(userItem.images?.[0])}
                        alt={userItem.title}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src =
                            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=200";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {userItem.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {userItem.category} • Size {userItem.size}
                        </p>
                        <p className="text-sm text-emerald-600 font-medium">
                          {userItem.pointValue} points
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    You don't have any available items to offer for swap.
                  </p>
                  <a
                    href="/upload"
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    List an item first
                  </a>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message to your swap request..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {message.length}/500 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedItem || isSubmitting}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="text-white" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Swap Request</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SwapRequestModal;
