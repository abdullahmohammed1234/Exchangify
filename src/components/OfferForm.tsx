'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { DollarSign, MessageSquare, Send, Loader2 } from 'lucide-react';

interface OfferFormProps {
  listingId: string;
  currentPrice: number | null;
  isFree: boolean;
  isTrade: boolean;
  onSuccess?: () => void;
}

export default function OfferForm({
  listingId,
  currentPrice,
  isFree,
  isTrade,
  onSuccess,
}: OfferFormProps) {
  const { data: session } = useSession();
  const [offeredPrice, setOfferedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!session) {
      setError('Please sign in to make an offer');
      return;
    }

    const price = parseFloat(offeredPrice);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          offeredPrice: price,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit offer');
        return;
      }

      setSuccess(true);
      setOfferedPrice('');
      setMessage('');
      onSuccess?.();
    } catch (err) {
      setError('Failed to submit offer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Offer Submitted!</h3>
        <p className="text-green-600 mb-4">
          Your offer has been sent to the seller. You'll be notified when they respond.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-green-700 font-medium hover:underline"
        >
          Make another offer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-primary" />
        Make an Offer
      </h3>

      {isFree ? (
        <p className="text-gray-600 mb-4">
          This item is free! Contact the seller to arrange pickup.
        </p>
      ) : isTrade ? (
        <p className="text-gray-600 mb-4">
          This item is available for trade only. Contact the seller to negotiate.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Offer Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                placeholder={currentPrice ? `Current price: $${currentPrice}` : 'Enter your offer'}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                step="0.01"
                min="0"
                required
              />
            </div>
            {currentPrice && (
              <p className="text-xs text-gray-500 mt-1">
                Listed price: ${currentPrice}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              Message to Seller (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you're interested..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !session}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-ubc-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Submit Offer
              </>
            )}
          </button>

          {!session && (
            <p className="text-sm text-gray-500 text-center">
              Please sign in to make an offer
            </p>
          )}
        </form>
      )}
    </div>
  );
}
