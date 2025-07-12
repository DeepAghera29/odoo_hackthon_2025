import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClothingItems } from '../hooks/useClothingItems';
import ItemCard from '../components/ui/ItemCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  PlusIcon,
  ShoppingBagIcon,
  HeartIcon,
  ArrowPathIcon,
  TrophyIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const { items: userItems, loading } = useClothingItems({ ownerId: user?._id });

  const stats = [
    {
      icon: ShoppingBagIcon,
      label: 'Items Listed',
      value: userItems.length.toString(),
      color: 'bg-blue-500'
    },
    {
      icon: TrophyIcon,
      label: 'Points Balance',
      value: user?.points?.toString() || '0',
      color: 'bg-emerald-500'
    },
    {
      icon: ArrowPathIcon,
      label: 'Successful Swaps',
      value: '3',
      color: 'bg-purple-500'
    },
    {
      icon: HeartIcon,
      label: 'Wishlist Items',
      value: '7',
      color: 'bg-pink-500'
    }
  ];

  const recentActivity = [
    {
      type: 'swap_request',
      message: 'Sarah requested to swap for your Vintage Denim Jacket',
      time: '2 hours ago',
      icon: ArrowPathIcon,
      color: 'text-blue-600'
    },
    {
      type: 'item_approved',
      message: 'Your Floral Summer Dress has been approved and is now live',
      time: '1 day ago',
      icon: ShoppingBagIcon,
      color: 'text-green-600'
    },
    {
      type: 'points_earned',
      message: 'You earned 75 points from listing an item',
      time: '2 days ago',
      icon: TrophyIcon,
      color: 'text-yellow-600'
    }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-600">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600">
                Member since {new Date(user.createdAt || user.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {user.bio && (
            <div className="bg-white rounded-lg p-4 mb-6">
              <p className="text-gray-700">{user.bio}</p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/upload"
                  className="flex items-center p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors group"
                >
                  <PlusIcon className="w-5 h-5 text-emerald-600 mr-3" />
                  <span className="text-emerald-700 font-medium">List New Item</span>
                </Link>
                <Link
                  to="/browse"
                  className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                  <ShoppingBagIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-blue-700 font-medium">Browse Items</span>
                </Link>
                <Link
                  to="/my-swaps"
                  className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                >
                  <ArrowPathIcon className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-purple-700 font-medium">Manage Swaps</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors group"
                >
                  <HeartIcon className="w-5 h-5 text-pink-600 mr-3" />
                  <span className="text-pink-700 font-medium">View Wishlist</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`mt-1 ${activity.color}`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* My Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Items</h2>
              <Link
                to="/my-items"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : userItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {userItems.slice(0, 4).map((item) => (
                  <ItemCard key={item._id || item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No items listed yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by listing your first item to begin swapping!
                </p>
                <Link
                  to="/upload"
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  List Your First Item
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;