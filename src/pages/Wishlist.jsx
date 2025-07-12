import React from "react";
import { useAuth } from "../context/AuthContext";
import { useClothingItems } from "../hooks/useClothingItems";
import ItemCard from "../components/ui/ItemCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { HeartIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const Wishlist = () => {
  const { user } = useAuth();
  const { items, loading, toggleFavorite } = useClothingItems({
    favorites: true,
  });

  const handleToggleFavorite = async (itemId) => {
    const result = await toggleFavorite(itemId);
    if (result.success) {
      toast.success(
        result.isFavorited ? "Added to wishlist" : "Removed from wishlist"
      );
    } else {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Items you've saved for later</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item._id || item.id}
                item={item}
                onFavorite={handleToggleFavorite}
                isFavorited={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 mb-4">
              Start browsing items and save the ones you love
            </p>
            <a
              href="/browse"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Browse Items
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
