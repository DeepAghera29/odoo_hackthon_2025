import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClothingItems } from '../hooks/useClothingItems';
import ItemCard from '../components/ui/ItemCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  ArrowRightIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  GlobeAltIcon,
  SparklesIcon,
  UserGroupIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { user } = useAuth();
  const { items, loading } = useClothingItems({ limit: 8, status: 'available' });

  const features = [
    {
      icon: ArrowPathIcon,
      title: 'Swap or Earn Points',
      description: 'Exchange items directly or earn points by listing clothes for others to redeem.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Sustainable Fashion',
      description: 'Reduce textile waste and give your clothes a second life in someone else\'s wardrobe.'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Driven',
      description: 'Connect with like-minded fashion lovers who care about the environment.'
    },
    {
      icon: SparklesIcon,
      title: 'AI-Powered',
      description: 'Smart recommendations and auto-tagging make finding perfect items effortless.'
    }
  ];

  const stats = [
    { label: 'Items Exchanged', value: '2,450+' },
    { label: 'CO2 Saved (kg)', value: '1,200+' },
    { label: 'Active Members', value: '850+' },
    { label: 'Communities', value: '25+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Sustainable Fashion
                <span className="block text-emerald-600">Starts Here</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join our community of eco-conscious fashion lovers. Swap clothes, earn points, 
                and discover unique pieces while reducing textile waste.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to={user ? "/browse" : "/register"}
                  className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors group"
                >
                  <span>Start Swapping</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/browse"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  Browse Items
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Sustainable fashion"
                    className="rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  />
                  <img
                    src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Clothing exchange"
                    className="rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Fashion community"
                    className="rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  />
                  <img
                    src="https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Eco-friendly style"
                    className="rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How ReWear Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes sustainable fashion accessible through innovative swapping and point systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-xl mb-6 group-hover:bg-emerald-200 transition-colors">
                  <feature.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Items</h2>
              <p className="text-xl text-gray-600">
                Discover amazing pieces from our community
              </p>
            </div>
            <Link
              to="/browse"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold group"
            >
              View All
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item._id || item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Wardrobe?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Join thousands of fashion-conscious individuals making a positive impact on the planet.
            Start your sustainable fashion journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Join the Community
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Learn More
                </Link>
              </>
            ) : (
              <Link
                to="/upload"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShoppingBagIcon className="w-5 h-5 mr-2" />
                List Your First Item
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;