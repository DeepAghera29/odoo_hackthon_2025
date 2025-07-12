import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const ItemCard = ({ item, onFavorite, isFavorited = false }) => {
  const conditionColors = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    fair: 'bg-yellow-100 text-yellow-800',
    worn: 'bg-gray-100 text-gray-800',
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    onFavorite?.(item._id || item.id);
  };

  const itemId = item._id || item.id;
  const imageUrl = item.images?.[0]?.startsWith('http') 
    ? item.images[0] 
    : `http://localhost:5000${item.images?.[0]}`;

  return (
    <Link to={`/item/${itemId}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
          
          {/* Favorite Button */}
          {onFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              {isFavorited ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          )}

          {/* Condition Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${conditionColors[item.condition]}`}>
              {item.condition}
            </span>
          </div>

          {/* Points Badge */}
          <div className="absolute bottom-3 right-3 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {item.pointValue} pts
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span className="capitalize">{item.category}</span>
            <span>Size {item.size}</span>
          </div>

          {item.brand && (
            <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
          )}

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {item.tags?.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{item.tags.length - 3}
              </span>
            )}
          </div>

          {/* Location */}
          {item.location && (
            <div className="flex items-center text-xs text-gray-500">
              <MapPinIcon className="w-3 h-3 mr-1" />
              <span>{item.location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;