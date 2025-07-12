import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckIcon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const SwapCard = ({ request, type, onRespond, onComplete, onCancel }) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  const handleRespond = (status) => {
    onRespond(request._id, status, responseMessage);
    setShowResponseForm(false);
    setResponseMessage("");
  };

  const getImageUrl = (image) => {
    return image?.startsWith("http") ? image : `http://localhost:5000${image}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {type === "received" && request.requester && (
            <>
              {request.requester.avatar ? (
                <img
                  src={request.requester.avatar}
                  alt={request.requester.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-600">
                    {request.requester.firstName?.[0]}
                    {request.requester.lastName?.[0]}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {request.requester.firstName} {request.requester.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  @{request.requester.username}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[request.status]
            }`}
          >
            {request.status}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="w-4 h-4 mr-1" />
            {new Date(request.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Offered Item */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {type === "sent" ? "Your Item" : "Offered Item"}
          </h4>
          <Link to={`/item/${request.itemOffered._id}`} className="block group">
            <div className="flex space-x-3 p-3 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors">
              <img
                src={getImageUrl(request.itemOffered.images?.[0])}
                alt={request.itemOffered.title}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=200";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate group-hover:text-emerald-600">
                  {request.itemOffered.title}
                </p>
                <p className="text-sm text-gray-600">
                  {request.itemOffered.pointValue} points
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Requested Item */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {type === "sent" ? "Requested Item" : "Your Item"}
          </h4>
          <Link
            to={`/item/${request.itemRequested._id}`}
            className="block group"
          >
            <div className="flex space-x-3 p-3 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors">
              <img
                src={getImageUrl(request.itemRequested.images?.[0])}
                alt={request.itemRequested.title}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=200";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate group-hover:text-emerald-600">
                  {request.itemRequested.title}
                </p>
                <p className="text-sm text-gray-600">
                  {request.itemRequested.pointValue} points
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Message */}
      {request.message && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Message</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-700">{request.message}</p>
          </div>
        </div>
      )}

      {/* Response Message */}
      {request.responseMessage && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Response</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-700">{request.responseMessage}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        {/* Received requests - pending */}
        {type === "received" && request.status === "pending" && (
          <>
            <button
              onClick={() => setShowResponseForm(!showResponseForm)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              <span>Respond</span>
            </button>
            <button
              onClick={() => handleRespond("rejected")}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button
              onClick={() => handleRespond("accepted")}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <CheckIcon className="w-4 h-4" />
              <span>Accept</span>
            </button>
          </>
        )}

        {/* Sent requests - pending */}
        {type === "sent" && request.status === "pending" && (
          <button
            onClick={() => onCancel(request._id)}
            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Cancel Request
          </button>
        )}

        {/* Accepted swaps */}
        {request.status === "accepted" && (
          <button
            onClick={() => onComplete(request._id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mark as Completed
          </button>
        )}
      </div>

      {/* Response Form */}
      {showResponseForm && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <textarea
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            placeholder="Add a message (optional)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={3}
          />
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => setShowResponseForm(false)}
              className="px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => handleRespond("rejected")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => handleRespond("accepted")}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapCard;
