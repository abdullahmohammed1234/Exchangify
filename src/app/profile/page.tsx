'use client';

import { User, Settings, ShoppingBag, BookOpen, Calculator, Coffee, Backpack, Bike, CreditCard, Bell, Lock, UserCircle } from 'lucide-react';

// Mock user data
const mockUser = {
  name: 'Sarah Chen',
  university: 'UBC',
  bio: "Hello! I'm a third-year Environmental Science major with a passion for sustainability. Looking to find new homes for my pre-loved items.",
  avatar: '/api/placeholder/100/100',
};

// Mock items for sale
const mockItemsForSale = [
  {
    id: 1,
    name: 'Reusable Water Bottle',
    price: 10,
    icon: Coffee,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 2,
    name: 'Graphing Calculator',
    price: 50,
    icon: Calculator,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 3,
    name: 'Textbooks (BIOL 200 & CHEM 250)',
    price: 40,
    icon: BookOpen,
    color: 'bg-amber-100 text-amber-700',
  },
];

// Mock purchase history
const mockPurchaseHistory = [
  { id: 1, name: 'Bicycle', price: 150 },
  { id: 2, name: 'ECON 101 Textbook', price: 35 },
  { id: 3, name: 'Backpack', price: 25 },
  { id: 4, name: 'Coffee Maker', price: 30 },
];

// Mock settings
const mockSettings = [
  { id: 1, label: 'Update Profile', icon: UserCircle },
  { id: 2, label: 'Change Password', icon: Lock },
  { id: 3, label: 'Manage Notifications', icon: Bell },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen ubc-gradient-subtle">
      {/* Top Profile Card */}
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/10 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-ubc-blue p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-ubc-grayLight flex items-center justify-center">
                  <User className="w-14 h-14 text-ubc-blue" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-ubc-red text-white text-xs px-2 py-0.5 rounded-full font-medium border-2 border-white">
                {mockUser.university}
              </div>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-ubc-blue mb-2">{mockUser.name}</h1>
              <p className="text-gray-600 leading-relaxed max-w-xl">{mockUser.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Items for Sale (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-ubc-blue mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Items for Sale
              </h2>

              {/* Item Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockItemsForSale.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-ubc-grayLight rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg hover:border-ubc-blue/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300`}>
                        <item.icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">{item.name}</h3>
                      <p className="text-lg font-bold text-ubc-blue">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Settings (1 col) */}
          <div>
            <div className="bg-ubc-blue rounded-2xl p-6 shadow-lg border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </h2>

              <div className="space-y-2">
                {mockSettings.map((setting) => (
                  <button
                    key={setting.id}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 group"
                  >
                    <setting.icon className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                    <span className="flex-1 text-left">{setting.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Purchase History */}
        <div className="mt-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-ubc-blue mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Purchase History
            </h2>

            <div className="space-y-3">
              {mockPurchaseHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-ubc-grayLight hover:bg-gray-200 transition-all duration-200"
                >
                  <span className="text-gray-800 font-medium">{item.name}</span>
                  <span className="text-ubc-red font-semibold">-${item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-8" />
    </div>
  );
}
