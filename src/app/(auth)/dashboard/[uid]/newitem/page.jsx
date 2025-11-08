'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageUploadPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [displayText, setDisplayText] = useState('');

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (file && allowedTypes.includes(file.type)) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a JPEG, PNG, or WebP image file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (file && allowedTypes.includes(file.type)) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a JPEG, PNG, or WebP image file.');
    }
  };

  const handleRemove = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };



  // Upload and classify image
  async function handleSubmit(e) {
    e?.preventDefault();
    if (!selectedImage) return;
    setDisplayText('Classifying...');
    try {
      const result = await uploadImage(selectedImage);
      if (result.success) {
        const formatted = Array.isArray(result.wastePredictions)
          ? result.wastePredictions
              .map(p => `${p.label}: ${(p.score * 100).toFixed(1)}%`)
              .join(', ')
          : 'No predictions';
        setDisplayText(formatted);
      } else {
        setDisplayText(`Error: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Classification request failed:', err);
      setDisplayText(`Request failed: ${err.message}`);
    }
  }

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/classification', {
      method: 'POST',
      body: formData,
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok) {
      let errorPayload;
      if (contentType.includes('application/json')) {
        try { errorPayload = await response.json(); } catch { errorPayload = await response.text(); }
      } else {
        errorPayload = await response.text();
      }
      console.error('API error response:', errorPayload);
      throw new Error(`API returned ${response.status}`);
    }

    if (!contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Unexpected non-JSON response: ${text.slice(0,100)}...`);
    }

    const result = await response.json();
    return result;
  }


 

  return (
    <div className="h-screen bg-black p-4 overflow-hidden flex flex-col">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-white animate-fade-in">Trash Talk</h1>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
        {/* Left side - Upload */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Upload Your Image
          </h2>
          <p className="text-zinc-400 text-center mb-6">
            Share a photo to get started
          </p>

          <div className="space-y-6">
            {!previewUrl ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-white bg-zinc-800'
                    : 'border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <svg
                    className="w-12 h-12 text-zinc-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  
                  <div>
                    <p className="text-white font-medium mb-1">
                      Drop your image here, or browse
                    </p>
                    <p className="text-zinc-400 text-sm">
                      Supports: JPEG, PNG, WebP
                    </p>
                  </div>

                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <span className="inline-block bg-white text-black font-medium px-6 py-2 rounded-md hover:bg-zinc-200 transition-colors">
                      Choose File
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-zinc-800">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto max-h-64 object-contain"
                    width={500}
                    height={500}
                  />
                </div>

                <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-8 h-8 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-white font-medium">{selectedImage.name}</p>
                      <p className="text-zinc-400 text-sm">
                        {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemove}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!selectedImage}
              className={`w-full font-medium py-3 rounded-md transition-colors ${
                selectedImage
                  ? 'bg-white text-black hover:bg-zinc-200'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              {selectedImage ? 'Upload Image' : 'Select an image first'}
            </button>
          </div>
        </div>

        {/* Right side - Text content */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            Output
          </h2>
          <div className="space-y-4 text-zinc-300">
            {displayText ? (
              <p className="text-xl font-semibold text-white">{displayText}</p>
            ) : (
              <p className="text-zinc-400">Upload an image to see the output...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}