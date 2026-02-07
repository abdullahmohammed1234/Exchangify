'use client';

import { useState, useEffect } from 'react';
import { Search, Leaf, Users, MapPin } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import MoveOutToggle from '@/components/MoveOutToggle';

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number | null;
  isFree: boolean;
  isTrade: boolean;
  category: string;
  location: string;
  availableDate: Date;
  imageUrl: string;
  isMoveOutBundle: boolean;
  userId?: { name: string };
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [moveOutMode, setMoveOutMode] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, [moveOutMode, category, location]);

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams();
      if (moveOutMode) params.set('moveOutMode', 'true');
      if (category !== 'all') params.set('category', category);
      if (location !== 'all') params.set('location', location);
      if (search) params.set('search', search);

      const res = await fetch(`/api/listings?${params}`);
      const data = await res.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Dorm', 'Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Appliances', 'Other'];
  const locations = ['all', 'Gage', 'Totem', 'Vanier', 'Orchard', 'Marine', 'Kitsilano', 'Thunderbird'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          UBC Student Marketplace
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Buy, sell, and trade with fellow UBC students. Sustainable. Local. Trusted.
        </p>
        
        {/* Impact Stats */}
        <div className="flex justify-center gap-8 mt-8">
          <div className="flex items-center gap-2 text-green-600">
            <Leaf className="h-5 w-5" />
            <span className="font-semibold">247 items reused</span>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            <span className="font-semibold">512 students active</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5" />
            <span className="font-semibold">8 residences covered</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchListings()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'all' ? 'All Locations' : loc}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <MoveOutToggle isEnabled={moveOutMode} onToggle={setMoveOutMode} />
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No listings found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
