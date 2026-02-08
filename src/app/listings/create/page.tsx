'use client';

import { useState } from 'react';
import { Upload, ChevronDown } from 'lucide-react';

export default function SellPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: ''
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] py-12 px-4 flex justify-center items-start font-sans">
      {/* Main Card Container */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden border border-gray-100">

        <div className="p-10">
          <h2 className="text-4xl font-bold text-[#002145] mb-8">Sell Your Item</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {/* Left: Input Form (3 Columns) */}
            <div className="md:col-span-3 space-y-6">
              <div>
                <label className="block text-lg font-semibold text-[#002145] mb-1">Title *</label>
                <input 
                  type="text"
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-md p-3 focus:outline-none focus:border-[#002145]" 
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-[#002145] mb-1">Description</label>
                <textarea 
                  rows={4}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-md p-3 focus:outline-none focus:border-[#002145]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Custom Styled Selects */}
                {['Price', 'Category'].map((label) => (
                  <div key={label}>
                    <label className="block text-lg font-semibold text-[#002145] mb-1">{label}</label>
                    <div className="relative">
                      <select 
                        onChange={(e) => updateField(label.toLowerCase(), e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-md p-3 appearance-none bg-white focus:outline-none focus:border-[#002145]"
                      >
                        <option value="">{label === 'Price' ? '$' : 'Select a...'}</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-4 text-gray-400 pointer-events-none" size={20} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload size={32} className="text-[#002145] mb-2" />
                <span className="text-xl font-bold text-[#002145]">Upload Images</span>
              </div>

              <button className="bg-[#002145] text-white px-10 py-3 rounded-md text-xl font-semibold hover:bg-[#003366] transition-all">
                Sell Item
              </button>
            </div>

            {/* Right: Preview Card (2 Columns) */}
            <div className="md:col-span-2">
              <div className="border border-gray-200 rounded-xl p-6 sticky top-6">
                <h3 className="text-xl font-bold text-[#002145] mb-4">Preview</h3>
                
                <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center mb-6">
                  <div className="text-gray-400 text-center">
                    <div className="w-16 h-12 border-4 border-gray-300 rounded-md mx-auto relative">
                        <div className="absolute top-2 right-2 w-3 h-3 bg-gray-300 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-2xl font-bold text-[#002145]">
                    {formData.title || 'Title of the item'}
                  </p>
                  <p className="text-xl font-bold text-[#002145]">
                    ${formData.price || '0.00'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Category:</span> [{formData.category || 'category'}]
                  </p>
                  <p className="text-gray-600 italic mt-4 leading-relaxed">
                    {formData.description || 'Description of the item that is for sale.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}