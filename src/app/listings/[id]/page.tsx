'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MapPin, Calendar, User, ArrowLeft, MessageCircle, Package, Leaf } from 'lucide-react';
import { format } from 'date-fns';

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
  userId: { _id: string; name: string; email: string };
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/${params.id}`);
      const data = await res.json();
      setListing(data.listing);
    } catch (error) {
      console.error('Failed to fetch listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSeller = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (!listing) return;

    setSendingMessage(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: listing.userId._id,
          listingId: listing._id,
          content: `Hi! I'm interested in your listing "${listing.title}". Is this still available?`,
        }),
      });

      if (res.ok) {
        router.push('/messages');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Listing not found</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-primary hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const priceDisplay = listing.isFree 
    ? 'FREE' 
    : listing.isTrade 
    ? 'Trade' 
    : `$${listing.price}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-96 md:h-full object-cover"
            />
            {listing.isMoveOutBundle && (
              <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1.5 rounded-full flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="font-semibold">Move-Out Bundle</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {listing.category}
              </span>
              {listing.isMoveOutBundle && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  Sustainable
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
            
            <div className="text-4xl font-bold mb-6">
              <span className={listing.isFree ? 'text-green-600' : listing.isTrade ? 'text-purple-600' : 'text-gray-900'}>
                {priceDisplay}
              </span>
            </div>

            <p className="text-gray-600 mb-6">{listing.description}</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span>Pickup at <strong>{listing.location}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span>Available until <strong>{format(new Date(listing.availableDate), 'MMMM d, yyyy')}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <User className="h-5 w-5 text-gray-400" />
                <span>Seller: <strong>{listing.userId.name}</strong></span>
              </div>
            </div>

            <button
              onClick={handleMessageSeller}
              disabled={sendingMessage || (session?.user?.id === listing.userId._id)}
              className="w-full py-4 bg-primary text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              {sendingMessage ? 'Sending...' : 'Message Seller'}
            </button>

            {session?.user?.id === listing.userId._id && (
              <p className="mt-4 text-center text-sm text-gray-500">
                This is your listing
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
