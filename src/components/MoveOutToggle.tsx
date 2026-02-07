'use client';

import { useState } from 'react';
import { Leaf, Package } from 'lucide-react';

interface MoveOutToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function MoveOutToggle({ isEnabled, onToggle }: MoveOutToggleProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
          {isEnabled ? (
            <Package className="h-5 w-5 text-green-600" />
          ) : (
            <Leaf className="h-5 w-5 text-gray-500" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Move-Out Mode</h3>
          <p className="text-sm text-gray-500">
            {isEnabled 
              ? 'Showing dorm essentials & bundles for move-out season'
              : 'Browse all listings'}
          </p>
        </div>
      </div>
      <button
        onClick={() => onToggle(!isEnabled)}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
          isEnabled ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
            isEnabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
