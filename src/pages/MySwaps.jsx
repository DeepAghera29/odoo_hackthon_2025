import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import SwapCard from "../components/ui/SwapCard";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const MySwaps = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("sent");
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  const fetchSwapRequests = async () => {
    try {
      const [sentResponse, receivedResponse] = await Promise.all([
        api.get("/swaps/sent"),
        api.get("/swaps/received"),
      ]);

      setSentRequests(sentResponse.data.requests);
      setReceivedRequests(receivedResponse.data.requests);
    } catch (error) {
      console.error("Error fetching swap requests:", error);
      toast.error("Failed to load swap requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToSwap = async (swapId, status, message = "") => {
    try {
      await api.put(`/swaps/${swapId}/respond`, {
        status,
        responseMessage: message,
      });

      toast.success(`Swap request ${status}`);
      fetchSwapRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to respond to swap");
    }
  };

  const handleCompleteSwap = async (swapId) => {
    try {
      await api.put(`/swaps/${swapId}/complete`);
      toast.success("Swap completed successfully!");
      fetchSwapRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete swap");
    }
  };

  const handleCancelSwap = async (swapId) => {
    if (window.confirm("Are you sure you want to cancel this swap request?")) {
      try {
        await api.delete(`/swaps/${swapId}`);
        toast.success("Swap request cancelled");
        fetchSwapRequests();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to cancel swap");
      }
    }
  };

  const tabs = [
    { id: "sent", label: "Sent Requests", count: sentRequests.length },
    {
      id: "received",
      label: "Received Requests",
      count: receivedRequests.length,
    },
  ];

  const currentRequests =
    activeTab === "sent" ? sentRequests : receivedRequests;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Swaps</h1>
          <p className="text-gray-600">
            Manage your swap requests and exchanges
          </p>
        </div>

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
                  {tab.count > 0 && (
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
        ) : currentRequests.length > 0 ? (
          <div className="space-y-6">
            {currentRequests.map((request) => (
              <SwapCard
                key={request._id}
                request={request}
                type={activeTab}
                onRespond={handleRespondToSwap}
                onComplete={handleCompleteSwap}
                onCancel={handleCancelSwap}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowPathIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {activeTab} requests
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === "sent"
                ? "You haven't sent any swap requests yet"
                : "You haven't received any swap requests yet"}
            </p>
            {activeTab === "sent" && (
              <a
                href="/browse"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Browse Items to Swap
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySwaps;
