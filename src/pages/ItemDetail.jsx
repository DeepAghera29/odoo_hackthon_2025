import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import SwapRequestModal from "../components/modals/SwapRequestModal";
import toast from "react-hot-toast";
import {
  HeartIcon,
  MapPinIcon,
  CalendarIcon,
  EyeIcon,
  ArrowLeftIcon,
  ShareIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data.item);
      setIsFavorited(response.data.item.favorites?.includes(user?._id));
    } catch (error) {
      console.error("Error fetching item:", error);
      toast.error("Item not found");
      navigate("/browse");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }

    try {
      const response = await api.post(`/items/${id}/favorite`);
      setIsFavorited(response.data.isFavorited);
      toast.success(
        response.data.isFavorited
          ? "Added to favorites"
          : "Removed from favorites"
      );
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  const handleRedeem = async () => {
    if (!user) {
      toast.error("Please login to redeem items");
      return;
    }

    if (user.points < item.pointValue) {
      toast.error("Insufficient points");
      return;
    }

    try {
      await api.post(`/items/${id}/redeem`);
      toast.success("Item redeemed successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to redeem item");
    }
  };

  const conditionColors = {
    excellent: "bg-green-100 text-green-800",
    good: "bg-blue-100 text-blue-800",
    fair: "bg-yellow-100 text-yellow-800",
    worn: "bg-gray-100 text-gray-800",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Item not found
          </h2>
          <Link
            to="/browse"
            className="text-emerald-600 hover:text-emerald-700"
          >
            Back to browse
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?._id === item.owner._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md mb-4">
              <img
                src={
                  item.images[selectedImage]?.startsWith("http")
                    ? item.images[selectedImage]
                    : `http://localhost:5000${item.images[selectedImage]}`
                }
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800";
                }}
              />
            </div>

            {/* Thumbnail Gallery */}
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-emerald-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={
                        image.startsWith("http")
                          ? image
                          : `http://localhost:5000${image}`
                      }
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="capitalize">{item.category}</span>
                    <span>•</span>
                    <span>Size {item.size}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <EyeIcon className="w-4 h-4" />
                      <span>{item.views} views</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleFavorite}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {isFavorited ? (
                      <HeartSolidIcon className="w-6 h-6 text-red-500" />
                    ) : (
                      <HeartIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ShareIcon className="w-6 h-6 text-gray-400" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <FlagIcon className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center space-x-3 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    conditionColors[item.condition]
                  }`}
                >
                  {item.condition}
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                  {item.pointValue} points
                </span>
                {item.brand && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {item.brand}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Color
                  </span>
                  <p className="text-gray-900">{item.color}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Type
                  </span>
                  <p className="text-gray-900 capitalize">{item.type}</p>
                </div>
                {item.location && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-500">
                      Location
                    </span>
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{item.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Owner Info */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Listed by
                </h3>
                <div className="flex items-center space-x-3">
                  {item.owner.avatar ? (
                    <img
                      src={item.owner.avatar}
                      alt={item.owner.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-emerald-600">
                        {item.owner.firstName?.[0]}
                        {item.owner.lastName?.[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.owner.firstName} {item.owner.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      @{item.owner.username}
                    </p>
                  </div>
                </div>
                {item.owner.bio && (
                  <p className="text-gray-600 mt-3">{item.owner.bio}</p>
                )}
              </div>

              {/* Actions */}
              {!isOwner && item.status === "available" && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowSwapModal(true)}
                    className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Request Swap
                  </button>
                  <button
                    onClick={handleRedeem}
                    disabled={!user || user.points < item.pointValue}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Redeem ({item.pointValue} pts)
                  </button>
                </div>
              )}

              {isOwner && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-center">This is your item</p>
                </div>
              )}

              {item.status !== "available" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-center font-medium">
                    This item is no longer available
                  </p>
                </div>
              )}

              {/* Posted Date */}
              <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mt-4">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  Posted {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <SwapRequestModal
          item={item}
          onClose={() => setShowSwapModal(false)}
          onSuccess={() => {
            setShowSwapModal(false);
            toast.success("Swap request sent!");
          }}
        />
      )}
    </div>
  );
};

export default ItemDetail;
